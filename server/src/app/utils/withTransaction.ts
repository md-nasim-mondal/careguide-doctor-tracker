import mongoose, { ClientSession } from 'mongoose';

/**
 * Executes a callback within a MongoDB transaction if replica sets are enabled.
 * If the connected MongoDB is a standalone instance (which doesn't support transactions),
 * it seamlessly falls back to running the operations without a transaction session.
 */
export const withTransaction = async <T>(
  callback: (session?: ClientSession) => Promise<T>
): Promise<T> => {
  let session: ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const result = await callback(session);

    await session.commitTransaction();
    return result;
  } catch (error: unknown) {
    if (session) {
      try {
        await session.abortTransaction();
      } catch {
        // Ignore abort error if transaction was never started
      }
    }

    // Check if error is due to MongoDB running as standalone (replica set required)
    const err = error as { code?: number; codeName?: string; message?: string } | null | undefined;
    const isStandaloneError =
      err?.code === 20 ||
      err?.codeName === 'IllegalOperation' ||
      (typeof err?.message === 'string' &&
        err.message.includes('Transaction numbers are only allowed on a replica set member or mongos'));

    if (isStandaloneError) {
      // Gracefully run without session for standalone MongoDB environments
      return await callback(undefined);
    }

    throw error;
  } finally {
    if (session) {
      try {
        await session.endSession();
      } catch {
        // Ignore session end error
      }
    }
  }
};
