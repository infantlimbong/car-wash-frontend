<template>
    <div class="w-full flex justify-center mt-20 -ml-28">
        <div class="max-w-md w-full">
            <h1 class="text-2xl font-bold mb-5 text-center">Daftar sebagai pelanggan</h1>
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

const router = useRouter();
const user = ref({
    name: '',
    email: '',
    password: '',
    role: 0
});

const submitForm = async () => {
    if (!user.value.name || !user.value.email || !user.value.password) {
        alert('Data tidak valid, harap lengkapi semua form');
        return;
    }
    try {
        await axios.post('http://localhost:8000/api/register', user.value);
        alert('Berhasil mendaftar! silahkan login');
        router.push({ name: 'login' });
    } catch (error) {
        console.error('Terjadi kesalahan, gagal mendaftar:', error);
        if (error.response && error.response.status === 400 && error.response.data.errors) {
            const errorMessages = Object.values(error.response.data.errors).map(e => e.join('\n')).join('\n');
            alert(errorMessages);
        } else {
            alert('Terjadi kesalahan, gagal mendaftar.');
        }
    }
};

const confirmCancel = () => {
    if (confirm('Apakah anda yakin? Perubahan yang dibuat akan dihapus')) {
        router.go(-1);
    }
};
</script>
