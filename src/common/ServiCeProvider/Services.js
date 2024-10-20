import HttpInterceptor from "./HttpInterceptor";
import { GET_ALL_SCHOOL_LIST } from "./APIURLs";

const apiServiceBased = HttpInterceptor();

export default {
    getAllSchollList: async () => {
        return apiServiceBased.get(GET_ALL_SCHOOL_LIST);
    },
};