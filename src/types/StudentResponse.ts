import { Student } from './Student';
export class StudentResponse {
    status: boolean;
    data: {
      students: Student[];
    };
  
    constructor(status: boolean, students: Student[]) {
      this.status = status;
      this.data = { students };
    }
  }