import { defineStore } from 'pinia'
import axiosClient from "@/axios/axios.js";
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref( {
    data: {},
    token: sessionStorage.getItem("TOKEN"),
  });

  const usersList = ref([]);
  const usersLoading = ref(false);

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
    this.usersLoading = true;
    return await axiosClient.get('/users')
      .then((response) => {
        this.usersList = response.data.data;
        //console.log(response.data.data);
        this.usersLoading = false;
      })
  }

  async function getAuthUser() {
    return await axiosClient.get('/user')
      .then((response) => {
        this.user.data = response.data.data;
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

  async function destroyUser(user) {
    return await axiosClient.delete('/users/' + user.id);
  }

  async function changePassword(form) {
    return await axiosClient.post('/change_password', form);
  }

  return {
    user,
    usersList,
    usersLoading,
    login,
    logout,
    getUsers,
    getAuthUser,
    addUser,
    editUser,
    destroyUser,
    changePassword
  }
})
