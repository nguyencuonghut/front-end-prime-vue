<script setup>
import { onBeforeMount, ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import moment from 'moment';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

const store = useAuthStore();
const filters1 = ref(null);
const visible = ref(false);
const name = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const checked = ref(false);
const errors = ref('');
const errorMsg = ref('');

onBeforeMount(() => {
  store.getUsers();
  initFilters();
});

const initFilters = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        is_admin: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        is_disabled: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        created_at: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    };
};

const clearFilter1 = () => {
    initFilters();
};

const getRoleSeverity = (role) => {
  switch (role) {
    case 'Admin':
      return 'success';
    case 'User':
      return 'info';
    default:
      return 'null';
  }
}
const getStatusSeverity = (status) => {
  switch (status) {
    case 'Mở':
      return 'success';
    case 'Khóa':
      return 'danger';
    default:
      return 'null';
  }
}

const addUser = () => {
  const userForm = {
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value
  }
  store
    .addUser(userForm)
    .then(() => {
      console.log("Tạo người dùng thành công!");
    })
    .catch((err) => {
      if (err.response.status === 422) {
        if(err.response.data.errors) {
          //for validation error messages
          errors.value = err.response.data.errors;
        } else {
          //for store User status message
          errorMsg.value = err.response.data.error;
        }
      }
      if (err.response.status === 403) {
        errorMsg.value = err.response.data.error;
      }
    });
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Người dùng {{ store.user  }}</h5>
                <DataTable
                    :value="store.usersList"
                    paginator
                    class="p-datatable-gridlines"
                    :rows="10"
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                    dataKey="id"
                    :rowHover="true"
                    v-model:filters="filters1"
                    filterDisplay="menu"
                    :loading="store.usersLoading"
                    :filters="filters1"
                    responsiveLayout="scroll"
                    :globalFilterFields="['name', 'email', 'created_at']"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <div>
                              <Button type="button" icon="pi pi-filter-slash" label="Xóa" class="p-button-outlined mb-2" @click="clearFilter1()" />
                              &nbsp;
                              <Button @click="visible = true" type="button" label="Thêm" severity="success" style="float:right;" icon="pi pi-plus" class="p-button-outlined mb-2" />
                                <Dialog
                                  v-model:visible="visible"
                                  modal
                                >
                                  <template #container="{ closeCallback }">
                                    <div class="flex flex-column px-8 py-5 gap-4" style="border-radius: 12px; background-image: radial-gradient(circle at left top, var(--green-400), var(--green-700))">
                                      <div class="inline-flex flex-column gap-2">
                                        <label for="name" class="text-primary-50 font-semibold">Tên</label>
                                        <InputText v-model="name" id="name" class="bg-white-alpha-20 border-none p-3 text-primary-50"></InputText>
                                      </div>
                                      <div class="inline-flex flex-column gap-2">
                                        <label for="email" class="text-primary-50 font-semibold">Email</label>
                                        <InputText v-model="email" id="email" class="bg-white-alpha-20 border-none p-3 text-primary-50"></InputText>
                                      </div>
                                      <div class="inline-flex flex-column gap-2">
                                        <label for="password" class="text-primary-50 font-semibold">Mật khẩu</label>
                                        <Password id="password" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                                      </div>
                                      <div class="inline-flex flex-column gap-2">
                                        <label for="password_confirmation" class="text-primary-50 font-semibold">Xác nhận mật khẩu</label>
                                        <Password id="password_confirmation" v-model="password_confirmation" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                                      </div>
                                      <div class="inline-flex flex-column gap-2">
                                        <div class="flex align-items-center">
                                          <Checkbox v-model="checked" id="is_admin" binary class="mr-2"></Checkbox>
                                          <label class="text-primary-50 font-semibold" for="is_admin">Admin</label>
                                        </div>
                                      </div>
                                      <small v-if="errorMsg" class="text-yellow-500" id="text-error">{{ errorMsg || '&nbsp;' }}</small>
                                      <div
                                        v-if="Object.keys(errors).length"
                                        class="flex-col items-stretch text-sm"
                                      >
                                        <div v-for="(field, i) of Object.keys(errors)" :key="i">
                                          <div class="text-yellow-500" v-for="(error, ind) of errors[field] || []" :key="ind">
                                            - {{ error }}
                                          </div>
                                        </div>
                                      </div>
                                      <div class="flex align-items-center gap-2">
                                        <Button type="submit" label="Thêm" @click.prevent="addUser" text class="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                                        <Button label="Hủy" @click="closeCallback" text class="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                                      </div>
                                    </div>
                                  </template>
                                </Dialog>
                            </div>
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Tìm" style="width: 100%" />
                            </span>
                        </div>
                    </template>
                    <template #empty> Không có người dùng. </template>
                    <template #loading> Đang tải dữ liệu. Vui lòng chờ </template>
                    <Column field="name" header="Tên" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.name }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Tìm theo tên" />
                        </template>
                    </Column>
                    <Column field="email" header="Email" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.email }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Tìm theo email" />
                        </template>
                    </Column>
                    <Column field="is_admin" header="Vai trò" style="min-width: 12rem">
                        <template #body="{ data }">
                            <Tag :severity="getRoleSeverity(data.is_admin)" >{{ data.is_admin }}</Tag>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Tìm theo email" />
                        </template>
                    </Column>
                    <Column field="is_disabled" header="Trạng thái" style="min-width: 12rem">
                        <template #body="{ data }">
                            <Tag :severity="getStatusSeverity(data.is_disabled)" >{{ data.is_disabled }}</Tag>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Tìm theo email" />
                        </template>
                    </Column>
                    <Column header="Ngày tạo" filterField="created_at" dataType="date" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ moment(data.created_at).format("YYYY-MM-DD HH:mm:ss") }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                        </template>
                    </Column>
                    
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
