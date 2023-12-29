<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useToast } from 'primevue/usetoast';

const store = useAuthStore();
const toast = useToast();

const form = ref({});
const errors = ref('');

function forgotPassword() {
  store
    .forgotPassword(form.value)
    .then(() => {
      toast.add({severity:'success', summary: 'Successful', detail: 'Gửi yêu cầu thành công', life: 3000});
    })
    .catch((err) => {
      if (err.response.status === 422) {
        if (err.response.data.errors) {
          //for validation error messages
          errors.value = err.response.data.errors;
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
                        <div class="text-900 text-3xl font-medium mb-3">Yêu cầu cấp lại mật khẩu</div>
                    </div>
                    <Toast />
                    <form @submit.prevent="forgotPassword">
                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email của bạn" class="w-full mb-5" style="padding: 1rem" v-model="form.email" />

                        <Button label="Cấp lại mật khẩu" type="submit" class="w-full p-3 text-xl"></Button>
                        <div class="flex align-items-center justify-content-between mt-3 mb-5 gap-5">
                            <router-link to="/login" class="font-medium no-underline text-right cursor-pointer" style="color: var(--primary-color)">
                              Đăng nhập
                            </router-link>
                        </div>
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
