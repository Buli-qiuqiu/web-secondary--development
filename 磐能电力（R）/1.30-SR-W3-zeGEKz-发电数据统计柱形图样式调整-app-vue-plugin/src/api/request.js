import axios from "axios";
import qs from "querystringify";

let apiContextPath = "";
const prefix = window.apiContextPathPrefix ? (window.apiContextPathPrefix + "/") : ""
if (process.env.NODE_ENV === "development") {
  document.cookie =
    "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY3NzgwOTQwOTcxNiwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9._IM7AhdwDZ8C5HeMFmSgADEXk4ogulME4EMV1bErbGw";
  document.cookie =
    "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2NzI5MTM2NTI2Nn0.JsEDyIE636k0WwkcYF_c-tY4xOjfQWfdgP__PZtLLho";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  apiContextPath = "/api/";
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
    console.log('response', response);
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
