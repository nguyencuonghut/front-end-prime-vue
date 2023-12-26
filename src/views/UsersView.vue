<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';

const router = useRouter();
const store = useAuthStore();
const visible = ref(false);
const name = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const errors = ref('');
const errorMsg = ref('');

onMounted(() => {
  store.getUsers();
});

const toast = useToast();
const dt = ref();
const users = store.usersList;
const userDialog = ref(false);
const deleteUserDialog = ref(false);
const deleteUsersDialog = ref(false);
const user = ref({});
const selectedUsers = ref();
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const submitted = ref(false);
const openNew = () => {
    //user.value = {};
    submitted.value = false;
    userDialog.value = true;

};
const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};
const saveUser = () => {
    submitted.value = true;

    if (user.value.name.trim()) {
      //Edit user
        if (user.value.id) {
          user.value.inventoryStatus = user.value.inventoryStatus.value ? user.value.inventoryStatus.value : user.value.inventoryStatus;
            users.value[findIndexById(user.value.id)] = user.value;
            toast.add({severity:'success', summary: 'Successful', detail: 'User Updated', life: 3000});
        }
      // Add new user
        else {
          store
            .addUser(user.value)
            .then(() => {
              router.push({
                name: "Users",
              });
              userDialog.value = false;
              user.value = {};
              //Update the usersList
              store.getUsers();
              toast.add({severity:'success', summary: 'Successful', detail: 'Thêm người dùng thành công', life: 3000});
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
    }
};
const editUser = (prod) => {
  user.value = {...prod};
    userDialog.value = true;
};
const confirmDeleteUser = (prod) => {
  user.value = prod;
    deleteUserDialog.value = true;
};
const deleteUser = () => {
    users.value = users.value.filter(val => val.id !== user.value.id);
    deleteUserDialog.value = false;
    user.value = {};
    toast.add({severity:'success', summary: 'Successful', detail: 'User Deleted', life: 3000});
};
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < users.value.length; i++) {
        if (users.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};
const exportCSV = () => {
    dt.value.exportCSV();
};
const confirmDeleteSelected = () => {
  deleteUsersDialog.value = true;
};
const deleteSelectedUsers = () => {
    users.value = users.value.filter(val => !selectedUsers.value.includes(val));
    deleteUsersDialog.value = false;
    selectedUsers.value = null;
    toast.add({severity:'success', summary: 'Successful', detail: 'Users Deleted', life: 3000});
};

const getRoleSeverity = (role) => {
  switch (role) {
    case 'Admin':
      return 'success';
    case 'User':
      return 'info';
    default :
      return null;
  }
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Mở':
      return 'success';
    case 'Khóa':
      return 'danger';
    default :
      return null;
  }
};


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
      router.push({
        name: "Users",
      });
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
  //hide the modal
  visible.value = false;
}
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button label="Thêm" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
          <Button label="Xóa" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" />
        </template>

        <template #end>
          <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
          <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)"  />
        </template>
      </Toolbar>

      <DataTable ref="dt" :value="store.usersList" v-model:selection="selectedUsers" dataKey="id" 
          :paginator="true" :rows="10" :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users">
          <template #header>
            <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
              <h4 class="m-0">Quản lý người dùng</h4>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Tìm kiếm..." />
              </span>
            </div>
          </template>

          <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
          <Column field="name" header="Tên" sortable style="min-width:12rem"></Column>
          <Column field="email" header="Email" sortable style="min-width:16rem"></Column>
          <Column field="is_admin" header="Vai trò" sortable style="min-width: 12rem">
            <template #body="{ data }">
              <Tag :severity="getRoleSeverity(data.is_admin)" >{{ data.is_admin }}</Tag>
            </template>
            <template #filter="{ filterModel }">
              <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Tìm theo email" />
            </template>
          </Column>
          <Column field="is_disabled" header="Trạng thái" sortable style="min-width: 12rem">
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
          <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUser(slotProps.data)" />
              <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUser(slotProps.data)" />
            </template>
          </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="Thêm người dùng" :modal="true" class="p-fluid">
        <img v-if="user.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="user.image" class="block m-auto pb-3" />
        <div class="field">
            <label for="name">Tên</label>
            <InputText id="name" v-model.trim="user.name" required="true" :class="{'p-invalid': submitted && !user.name}" />
            <small class="p-error" v-if="submitted && !user.name">Bạn phải điền tên.</small>
        </div>
        <div class="field">
            <label for="email">Email</label>
            <InputText id="email" v-model="user.email" required="true" cols="20" />
        </div>

        <div class="field">
          <label for="password">Mật khẩu</label>
          <Password id="password" v-model="user.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
        </div>
        <div class="field">
          <label for="password_confirmation">Xác nhận mật khẩu</label>
          <Password id="password_confirmation" v-model="user.password_confirmation" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
        </div>
        <div class="field">
          <div class="flex align-items-center">
            <Checkbox v-model="user.is_admin" id="is_admin" binary class="mr-2"></Checkbox>
            <label for="is_admin">Admin</label>
          </div>
        </div>
        <small v-if="errorMsg" class="text-red-500" id="text-error">{{ errorMsg || '&nbsp;' }}</small>
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
            <Button label="Lưu" icon="pi pi-check" text @click="saveUser" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteUserDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="user">Are you sure you want to delete <b>{{user.name}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteUserDialog = false"/>
            <Button label="Yes" icon="pi pi-check" text @click="deleteUser" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteUsersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="user">Are you sure you want to delete the selected users?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteUsersDialog = false"/>
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedUsers" />
        </template>
    </Dialog>
	</div>
</template>
<!-- 
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
                                      visible {{ visible }}
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
-->