<template>
    <div class="w-full flex justify-center mt-4">
        <div class="max-w-2xl w-full">
            <h1 class="text-2xl font-bold mb-5 text-center">Edit Pembayaran</h1>
            <form @submit.prevent="submitForm" class="bg-slate-400 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4">
                <h3 class="text-center text-sm font-medium">Hanya dapat mengubah metode pembayaran</h3>
                <h3 class="text-center mb-5 text-sm">Pembayaran yang sudah lunas tidak dapat diubah</h3>
                <div class="mb-2">
                    <label for="metode_pembayaran" class="block text-sm font-bold mb-1">Metode Pembayaran</label>
                    <select v-model="pembayaran.metode_pembayaran" id="metode_pembayaran" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="Cash">Cash</option>
                        <option value="Transfer bank">Transfer Bank</option>
                        <option value="E-Wallet">E-Wallet</option>
                    </select>
                </div>
                <div class="flex gap-x-2 text-white">
                    <button class="bg-blue-500 hover:bg-blue-700 font-semibold py-2 px-3 rounded-md focus:outline-none focus:shadow-outline" type="submit">
                        Update
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
const router = useRouter();
const route = useRoute();
const pembayaranId = route.params.id;
const pembayaran = ref({
    metode_pembayaran: '',
});

onMounted(async () => {
    try {
        const response = await axios.get(`http://localhost:8000/api/pembayarans/${pembayaranId}`, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            }
        });
        pembayaran.value = response.data.data;
    } catch (error) {
        console.error('Error fetching pembayaran details:', error);
        alert('Failed to load pembayaran details.');
    }
});

const submitForm = async () => {
    if (!pembayaran.value.metode_pembayaran) {
        alert('Data tidak valid, harap lengkapi semua form');
        return;
    }
    try {
        await axios.put(`http://localhost:8000/api/pembayarans/${pembayaranId}`, pembayaran.value, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            }
        });
        alert('Berhasil memperbarui Pembayaran!');
        router.push({ name: 'pembayaranlist' });
    } catch (error) {
        console.error('There was an error updating pembayaran:', error);
        alert('Gagal memperbarui data Pembayaran.');
    }
};

const confirmCancel = () => {
    if (confirm('Apakah anda yakin? Perubahan yang dibuat tidak akan tersimpan!')) {
        router.go(-1);
    }
};
</script>
