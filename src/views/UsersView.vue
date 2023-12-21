<script setup>
import { onBeforeMount, ref } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import moment from 'moment';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

const store = useAuthStore();
const filters1 = ref(null);

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
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Người dùng</h5>
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
                            <Button type="button" icon="pi pi-filter-slash" label="Xóa" class="p-button-outlined mb-2" @click="clearFilter1()" />
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
