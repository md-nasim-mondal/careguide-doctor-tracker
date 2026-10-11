import { TGenericErrorResponse } from "../interfaces/error.types";

interface IMongoDuplicateError {
  message: string;
}

export const handlerDuplicateError = (err: IMongoDuplicateError): TGenericErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);
  const matchedValue = matchedArray && matchedArray[1] ? matchedArray[1] : "Field";

  return {
    statusCode: 400,
    message: `${matchedValue} already exists!!`,
  };
};
