import { Teacher } from './Teacher'; // Reusing the School type

export class TeacherResponse {
    status: boolean;
    data: {
      teacherDetails: Teacher[];
    };
  
    constructor(status: boolean, teacherDetails: Teacher[]) {
      this.status = status;
      this.data = { teacherDetails };
    }
  }