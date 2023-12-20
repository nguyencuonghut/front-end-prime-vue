<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useRouter } from "vue-router";

const router = useRouter();
const store = useAuthStore();
const email = ref('');
const password = ref('');
const checked = ref(false);
const errorMsg = ref('');
const errors = ref('');

function login() {
  const userForm = {
    email: email.value,
    password: password.value
  }
  store
    .login(userForm)
    .then(() => {
      router.push({
        name: "Dashboard",
      });
    })
    .catch((err) => {
      if (err.response.status === 422) {
        if(err.response.data.errors) {
          //for validation error messages
          errors.value = err.response.data.errors;
        } else {
          //for login status message
          errorMsg.value = err.response.data.error;
        }
      }
    });
}

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Đăng nhập</div>
                    </div>

                    <form @submit.prevent="login">
                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Mật khẩu</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        <small v-if="errorMsg" class="p-error" id="text-error">{{ errorMsg || '&nbsp;' }}</small>
                        <div
                            v-if="Object.keys(errors).length"
                            class="flex-col items-stretch text-sm"
                        >
                            <div v-for="(field, i) of Object.keys(errors)" :key="i">
                                <div class="p-error" v-for="(error, ind) of errors[field] || []" :key="ind">
                                    - {{ error }}
                                </div>
                            </div>
                        </div>
                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Ghi nhớ</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button label="Đăng nhập" type="submit" class="w-full p-3 text-xl"></Button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
