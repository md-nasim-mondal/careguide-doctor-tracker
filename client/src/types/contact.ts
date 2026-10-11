export interface ContactInquiry {
  name: string;
  hospital: string;
  email: string;
  topic: string;
  message: string;
}

export interface ContactFormProps {
  errorMessage?: string;
  isSent?: boolean;
}

export type ContactPageSearchParams = {
  sent?: string;
  error?: string;
};
