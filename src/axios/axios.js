/**
 * Created by Zura on 12/25/2021.
 */
import axios from "axios";
import router from "../router";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
})
axiosClient.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${sessionStorage.getItem("TOKEN")}`
  return config;
})

axiosClient.interceptors.response.use(response => {
  return response;
}, error => {
  console.log(error)
  if (error.response.status === 401) {
    sessionStorage.removeItem('TOKEN')
    router.push({name: 'Login'})
  } else if (error.response.status === 404) {
    router.push({name: 'NotFound'})
  }
  throw error;
})

export default axiosClient;