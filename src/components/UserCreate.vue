<template>
    <div class="w-full flex justify-center mt-4">
        <div class="max-w-2xl w-full">
            <h1 class="text-2xl font-bold mb-5 text-center">Register User</h1>
            <form @submit.prevent="submitForm" class="bg-slate-400 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4">
                <div class="mb-2">
                    <label for="name" class="block text-sm font-bold mb-1">Name</label>
                    <input v-model="user.name" id="name" type="text" placeholder="Name" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-2">
                    <label for="email" class="block text-sm font-bold mb-1">Email</label>
                    <input v-model="user.email" id="email" type="email" placeholder="Email" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-2">
                    <label for="password" class="block text-sm font-bold mb-1">Password</label>
                    <input v-model="user.password" id="password" type="password" placeholder="**********" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-2">
                    <label for="role" class="block text-sm font-bold mb-1">Role</label>
                    <select v-model="user.role" id="role" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <option disabled value="">Pilih role</option>
                        <option value="0">Pelanggan</option>
                        <option value="1">Admin</option>
                    </select>
                </div>
                <div class="flex gap-x-2 text-white">
                    <button class="bg-blue-500 hover:bg-blue-700 font-semibold py-2 px-3 rounded-md focus:outline-none focus:shadow-outline" type="submit">
                        Submit
                    </button>
                    <button class="bg-red-500 hover:bg-red-700 font-semibold py-2 px-3 rounded-md focus:outline-none focus:shadow-outline" type="button" @click="confirmCancel">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const user = ref({
    name: '',
    email: '',
    password: '',
    role: ''
});

const submitForm = async () => {
    if (!user.value.name || !user.value.email || !user.value.password || !user.value.role) {
        alert('Data tidak valid, harap lengkapi semua form');
        return;
    }
    try {
        await axios.post('http://localhost:8000/api/users', user.value, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        alert('User berhasil didaftarkan!');
        router.push({ name: 'userlist' });
    } catch (error) {
        console.error('Gagal mendaftarkan user:', error);
        alert('Gagal mendaftarkan user.');
    }
};

const confirmCancel = () => {
    if (confirm('Apakah anda yakin? Perubahan yang dibuat akan dihapus')) {
        router.go(-1);
    }
};
</script>
