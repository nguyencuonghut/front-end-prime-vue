<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const store = useAuthStore();
const route = useRoute();
const router = useRouter();

const form = ref({});
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const errors = ref('');
const errorMsg = ref('');

function resetPassword() {
  form.value = {
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value,
    token: route.params.token,
  }

  store
    .resetPassword(form.value)
    .then(() => {
        router.push({
            name: "Login",
        });
    })
    .catch((err) => {
      if (err.response.status === 422) {
        if (err.response.data.errors) {
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
                        <div class="text-900 text-3xl font-medium mb-3">Đặt lại mật khẩu</div>
                    </div>
                    <form @submit.prevent="resetPassword">
                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email" type="text" placeholder="Email" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password" class="block text-900 font-medium text-xl mb-2">Mật khẩu</label>
                        <Password id="password" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <label for="password_confirmation" class="block text-900 font-medium text-xl mb-2">Mật khẩu</label>
                        <Password id="password_confirmation" v-model="password_confirmation" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        <Button label="Đặt lại" type="submit" class="w-full p-3 mb-3 text-xl"></Button>

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
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
