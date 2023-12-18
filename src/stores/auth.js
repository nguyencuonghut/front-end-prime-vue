import { defineStore } from 'pinia'
import axiosClient from "@/axios/axios.js";
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref( {
    data: {},
    token: sessionStorage.getItem("TOKEN"),
  })

  function login(user) {
    return axiosClient.post('/login', user)
      .then(({data}) => {
        this.user.data =  data.user;
        this.user.token = data.token;
        sessionStorage.setItem('TOKEN', this.user.token);
        return data;
      })
  }
  return { user, login }
})
