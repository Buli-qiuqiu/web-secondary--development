import axios from "axios";
import qs from "querystringify";

let apiContextPath = "";
const prefix = window.apiContextPathPrefix ? (window.apiContextPathPrefix + "/") : ""
if (process.env.NODE_ENV === "development") {
  document.cookie =
    "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY3NzcyMjg5ODAxMywidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.MkQEdJxRcNbzwjO_25-sE8PM1gx0wUBAnij5ViYcd-U";
  document.cookie =
    "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2MDUzMTEwMTYwN30.LLFogLE1s0_z1xs-D-iB_q3v7YI8zutqHtfEcD3kLIY";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  apiContextPath = "/api";
}

const instance = axios.create({
  baseURL: `${apiContextPath}/dtyq/pngf/sdata/rest`,
  timeout: 60000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  headers:
    (window.location.search && qs.parse(window.location.search).token) ||
      window.token
      ? { token: qs.parse(window.location.search).token || window.token }
      : {},
});

instance.defaults.headers.post["Content-Type"] = "application/json";

instance.interceptors.response.use(
  response => {
    let { data } = response;
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    if (data && data.status !== 200 && !(data instanceof Blob)) {
      return Promise.reject(response);
    }
    if (data instanceof Blob) {
      response.data = data;
      return response;
    }
    response.data = data && data.result;
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      return Promise.reject(error.response);
    }
    return Promise.reject(error.response);
  }
);

export default instance;
