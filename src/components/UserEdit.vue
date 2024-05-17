<template>
    <div class="w-full flex justify-center mt-4">
        <div class="max-w-2xl w-full">
            <h1 class="text-2xl font-bold mb-5 text-center">Edit User</h1>
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
                    <label for="password" class="block text-sm font-bold mb-1">Password <span class="text-xs font-light">(Kosongkan jika tidak ingin mengubah password)</span></label>
                    <input v-model="user.password" id="password" type="password" placeholder="**********" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-2">
                    <label for="role" class="block text-sm font-bold mb-1">Role</label>
                    <select v-model="user.role" id="role" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="0">Pelanggan</option>
                        <option value="1">Admin</option>
                    </select>
                </div>
                <div class="flex gap-x-2 text-white">
                    <button class="bg-blue-500 hover:bg-blue-700 font-semibold py-2 px-3 rounded-md focus:outline-none focus:shadow-outline" type="submit">
                        Submit
                    </button>
                    <button class="bg-red-500 hover:bg-red-700 font-semibold py-2 px-3 rounded-md focus:outline-none focus:shadow-outline" type="button" @click="confirmCancel">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();
const userId = route.params.id;
const user = ref({
    name: '',
    email: '',
    password: '',
    role: ''
});

onMounted(async () => {
    try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        user.value = response.data.data;
    } catch (error) {
        console.error('Terjadi Kesalahan!', error);
        alert('Gagal menampilkan data user.');
    }
});

const submitForm = async () => {
    try {
        await axios.put(`http://localhost:8000/api/users/${userId}`, user.value, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        alert('Berhasil mengedit User!');
        router.push({ name: 'userlist' });
    } catch (error) {
        console.error('Terjadi Kesalahan!', error);
        alert('Gagal mengedit data User.');
    }
};

const confirmCancel = () => {
    if (confirm('Apakah anda yakin? Perubahan yang dibuat tidak akan tersimpan!')) {
        router.go(-1);
    }
};
</script>