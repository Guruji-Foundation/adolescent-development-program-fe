import { Parent } from './Parent';


export interface Student {
    id: number;
    name: string;
    dob: string;
    address: string;
    phoneNumber: string;
    alternativeNumber: string | null;
    email: string;
    parent: Parent;
  }