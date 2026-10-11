import { QueryBuilder } from '../../utils/QueryBuilder';
import { IContact } from './contact.interface';
import { Contact } from './contact.model';

const createContactInquiry = async (payload: IContact) => {
  const contact = await Contact.create(payload);
  return contact;
};

const getContactInquiries = async (query: Record<string, string>) => {
  const contactQuery = new QueryBuilder(
    Contact.find(),
    query
  )
    .search(['name', 'hospital', 'email', 'topic'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [inquiries, meta] = await Promise.all([
    contactQuery.build(),
    contactQuery.getMeta(),
  ]);

  return {
    inquiries,
    total: meta.total,
    page: meta.page,
    limit: meta.limit,
    totalPages: meta.totalPage,
  };
};

export const ContactServices = {
  createContactInquiry,
  getContactInquiries,
};
