<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { useToast } from 'primevue/usetoast';

const store = useAuthStore();
const router = useRouter();
const toast = useToast();
onMounted(() => {
  store.getAuthUser();
});

const form = ref({});
const submitted = ref(false);
const passwordDialog = ref(false);
const errors = ref('');

const openDialog = () => {
  form.value = {};
  submitted.value = false;
  passwordDialog.value = true;

};

const hideDialog = () => {
  passwordDialog.value = false;
  submitted.value = false;
};

const changePassword = () => {
  submitted.value = true;
  store
    .changePassword(form.value)
    .then(() => {
      router.push({
        name: "Profile",
      })
      passwordDialog.value = false;
      form.value = {};
      toast.add({severity:'success', summary: 'Successful', detail: 'Đổi mật khẩu thành công', life: 3000});
    })
    .catch((err) => {
      if (err.response.status === 422) {
        if(err.response.data.errors) {
          //for validation error messages
          errors.value = err.response.data.errors;
        }
      }
    });
}
</script>

<template>
  <div>
    <div class="card">
      <h5>Hồ sơ</h5>
      <div class="text-center mb-5">
          <div class="text-900 font-medium mb-3">
            {{ store.user.data.name }}
          </div>
          <div class="text-500 font-medium mb-3">
            {{ store.user.data.email }}
          </div>
          <Button label="Đổi mật khẩu" @click="openDialog" severity="success" class="w-full p-3"></Button>
      </div>
      
      <Dialog v-model:visible="passwordDialog" :style="{width: '450px'}" header="Đổi mật khẩu" :modal="true" class="p-fluid">
          <div class="field">
            <label for="password">Mật khẩu</label>
            <Password id="password" v-model="form.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
          </div>
          <div class="field">
            <label for="password_confirmation">Xác nhận mật khẩu</label>
            <Password id="password_confirmation" v-model="form.password_confirmation" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
          </div>
          <div
            v-if="Object.keys(errors).length"
            class="flex-col items-stretch text-sm"
          >
            <div v-for="(field, i) of Object.keys(errors)" :key="i">
              <div class="text-red-500" v-for="(error, ind) of errors[field] || []" :key="ind">
                - {{ error }}
              </div>
            </div>
          </div>
          
          <template #footer>
              <Button label="Hủy" icon="pi pi-times" text @click="hideDialog"/>
              <Button label="Lưu" icon="pi pi-check" text @click="changePassword" />
          </template>
      </Dialog>
    </div>
  </div>
</template>