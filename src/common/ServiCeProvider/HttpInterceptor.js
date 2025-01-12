import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const HttpInterceptor = () => {
  const instance = axios.create({ baseURL: apiUrl });
  // console.log("localstorage token",instance, localStorage.getItem('authtoken'))
  // const defaultHeaders = () => {
  //     return {
  //         'Authorization': "Bearer " + localStorage.getItem('authtoken').replace(/"/g, ''),
  //         'Content-Type': 'application/json',
  //     };
  // };

  const defaultHeaders = () => {
    const authToken = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (authToken) {
      headers["Authorization"] = "Bearer " + authToken.replace(/"/g, "");
    }

    return headers;
  };

  const request = async (method, url, data = null, customHeaders = {}) => {
    const headers = { ...defaultHeaders(), ...customHeaders };
    const source = axios.CancelToken.source();

    const config = {
      method,
      url,
      headers,
      cancelToken: source.token,
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await instance(config);
      return response;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        // Handle other errors
        console.error("Error:", error);
      }
      throw error;
    }
  };

  const get = (url, customHeaders = {}) => {
    return request("get", url, null, customHeaders);
  };

  const post = (url, data, customHeaders = {}) => {
    return request("post", url, data, customHeaders);
  };

  const put = (url, data, customHeaders = {}) => {
    return request("put", url, data, customHeaders);
  };

  const _delete = (url, data = null, customHeaders = {}) => {
    return request("delete", url, data, customHeaders);
  };

  return { get, post, put, delete: _delete };
};

export default HttpInterceptor;
