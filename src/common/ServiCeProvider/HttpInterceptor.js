import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const HttpInterceptor = () => {
  const instance = axios.create({ baseURL: apiUrl });

  const defaultHeaders = () => {
    const authToken = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (authToken) {
      try {
        // Remove any quotes and whitespace from the token
        const cleanToken = authToken.trim().replace(/['"]+/g, '');
        headers["Authorization"] = `Bearer ${cleanToken}`;
      } catch (error) {
        console.error("Error processing auth token:", error);
        // Remove invalid token
        localStorage.removeItem("token");
      }
    }

    return headers;
  };

  // Add request interceptor
  instance.interceptors.request.use(
    (config) => {
      config.headers = {
        ...config.headers,
        ...defaultHeaders(),
      };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  const request = async (method, url, data = null, customHeaders = {}, configOptions = {}) => {
    const headers = { ...defaultHeaders(), ...customHeaders };
    const source = axios.CancelToken.source();

    const config = {
      method,
      url,
      headers,
      cancelToken: source.token,
      ...configOptions,
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
        console.error("Error:", error);
      }
      throw error;
    }
  };

  const get = (url, customHeaders = {}, configOptions = {}) => {
    return request("get", url, null, customHeaders, configOptions);
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
