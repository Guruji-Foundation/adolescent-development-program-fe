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
      const isFileUpload = config.data instanceof FormData;
      const headers = defaultHeaders();
      
      // For file uploads, don't set Content-Type header
      if (isFileUpload) {
        delete headers["Content-Type"];
      }

      config.headers = {
        ...config.headers,
        ...headers,
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
      if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
        // Handle unauthorized access (except for login endpoint)
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  const request = async (method, url, data = null, customHeaders = {}, configOptions = {}) => {
    let headers = { ...defaultHeaders(), ...customHeaders };
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

  const getBlob = (url, customHeaders = {}) => {
    return request("get", url, null, customHeaders, {
      responseType: "blob"
    });
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

  const postBlob = (url, data, customHeaders = {}) => {
    return request("post", url, data, customHeaders, {
      responseType: "blob"
    });
  };

  const uploadFile = async (url, file, customHeaders = {}) => {
    console.log('uploadFile', url, file, customHeaders);
    if (!file) {
      throw new Error('File is required for upload');
    }

    const formData = new FormData();
    formData.append('file', file);

    // For file uploads, we need to let the browser set the Content-Type header
    // with the correct boundary parameter
    const headers = {
      ...customHeaders,
      'Content-Type': 'multipart/form-data',
      Accept: '*/*'
    };
    console.log('uploadFile', url, formData, headers);

    try {
      const response = await request('post', url, formData, headers);
      return response.data;
    } catch (error) {
      console.error('File upload error:', error);
      throw error.response?.data || error;
    }
  };

  return { get, post, put, delete: _delete, getBlob, postBlob, uploadFile };
};

export default HttpInterceptor;
