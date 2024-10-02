import { School } from './School'; 

export interface Teacher {
  id: number;
  name: string;
  experience: number;
  schoolDetails: School;
}
