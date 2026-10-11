export interface IContact {
  name: string;
  hospital: string;
  email: string;
  topic: string;
  message: string;
  status: 'pending' | 'resolved';
}
