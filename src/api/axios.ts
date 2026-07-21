import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(config => {
  const key = localStorage.getItem('claude_api_key');
  if (key) config.headers.Authorization = `Bearer ${key}`;
  return config;
});

export default axiosInstance;
