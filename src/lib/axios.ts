import axios from "axios";

// const BASE_URL = "http://14.55.157.117:8080";

const instance = axios.create({
  baseURL: "/api",
  timeout: 100000,
  withCredentials: true, // 자격 증명을 포함하도록 설정
});

export default instance;
