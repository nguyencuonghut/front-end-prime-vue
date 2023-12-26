import { defineStore } from 'pinia'
import axiosClient from "@/axios/axios.js";
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref( {
    data: {},
    token: sessionStorage.getItem("TOKEN"),
  });

  const usersList = ref([]);
  const usersLoading = ref(true);

  async function login(user) {
    const res = await axiosClient.post('/login', user)
      .then(({data}) => {
        //console.log(data.user);
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
  async function getUsers() {
    return await axiosClient.get('/users')
      .then((response) => {
        this.usersList = response.data.data;
        //console.log(response.data.data);
        this.usersLoading = false;
      })
  }

  async function addUser(user) {
    return await axiosClient.post('/users', user)
      .then(() => {
        //console.log("them moi thanh cong");
      })
  }

  async function editUser(user) {
    return await axiosClient.put('/users/' + user.id, user)
      .then(() => {
        //console.log("sua thanh cong");
      })
  }

  return { user, usersList, usersLoading, login, logout, getUsers, addUser, editUser }
})
