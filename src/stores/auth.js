import { defineStore } from 'pinia'
import axiosClient from "@/axios/axios.js";
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref( {
    data: {},
    token: sessionStorage.getItem("TOKEN"),
  });

  async function login(user) {
    const res = await axiosClient.post('/login', user)
      .then(({data}) => {
        this.user.data =  data.user;
        this.user.token = data.token;
        sessionStorage.setItem('TOKEN', this.user.token);
        return data;
      })
      return res;
  }

  async function logout() {
    const response = await axiosClient.post('/logout');
    this.user.token = null;
    this.user.data = {};
    sessionStorage.removeItem("TOKEN");
    return response;
  }
  return { user, login, logout }
})
