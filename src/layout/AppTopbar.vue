<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const { onMenuToggle, changeThemeSettings, layoutConfig } = useLayout();
const store = useAuthStore();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const theme_mode = ref('light');

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

function logout() {
    store
        .logout()
        .then(() => {
            router.push({
              name: "Login",
            });
      });
}

const onChangeTheme = (theme, mode) => {
    if (theme_mode.value === 'light') {
        theme_mode.value = 'dark';
    } else {
        theme_mode.value = 'light';
    }
    const elementId = 'theme-css';
    const linkElement = document.getElementById(elementId);
    const cloneLinkElement = linkElement.cloneNode(true);
    const newThemeUrl = linkElement.getAttribute('href').replace(layoutConfig.theme.value, theme);
    cloneLinkElement.setAttribute('id', elementId + '-clone');
    cloneLinkElement.setAttribute('href', newThemeUrl);
    cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', elementId);
        if (theme_mode.value === 'light') {
            changeThemeSettings(theme, mode === 'dark');
        } else {
            changeThemeSettings(theme, mode === 'light');
        }
    });
    linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <!-- <img :src="logoUrl" alt="logo" /> -->
            <img src="/logo.png" alt="logo" />
            <span>HONGHA</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses"> 
            <button v-if="store.user.token" @click="logout" class="p-link layout-topbar-button">
                <i class="pi pi-sign-out"></i>
                <span>Đăng xuất</span>
            </button>
            <button v-if="theme_mode === 'light'" @click="onChangeTheme('lara-dark-indigo', 'dark')" class="p-link layout-topbar-button">
                <i class="pi pi-moon"></i>
                <span>Theme</span>
            </button>
            <button v-else @click="onChangeTheme('lara-light-indigo', 'light')" class="p-link layout-topbar-button">
                <i class="pi pi-sun"></i>
                <span>Theme</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
