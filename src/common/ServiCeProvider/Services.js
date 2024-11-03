import HttpInterceptor from "./HttpInterceptor";
import { GET_ALL_SCHOOL_LIST } from "./APIURLs";

const apiServiceBased = HttpInterceptor();

export default {
  getAllSchollList: async () => {
    return apiServiceBased.get(GET_ALL_SCHOOL_LIST);
  },

  createSchool: async (schoolData) => {
    return apiServiceBased.post(GET_ALL_SCHOOL_LIST, schoolData);
  },
  deleteSchool: async (id) =>{
    return apiServiceBased.delete(`${GET_ALL_SCHOOL_LIST}/${id}`);
  }
};
