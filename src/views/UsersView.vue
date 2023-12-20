<script setup>
import { useAuthStore } from '@/stores/auth.js';

const store = useAuthStore();
</script>

<template>
    <h1>Users View</h1>
    <p>Token: {{ store.user.token }}</p>
    <p>Logged User: {{ store.user.data }}</p>
</template>