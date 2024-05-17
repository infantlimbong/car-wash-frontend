<template>
    <div class="w-full flex justify-center mt-4">
        <div class="max-w-2xl w-full">
            <h1 class="text-2xl font-bold mb-5 text-center">Buat Pembayaran</h1>
            <form @submit.prevent="submitForm" class="bg-slate-400 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4">
                <div class="mb-2">
                    <label class="block text-sm font-bold mb-1">Layanan <span class="font-normal text-xs">(Otomatis)</span></label>
                    <input v-model="layananName" class="text-gray-800 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" readonly>
                </div>
                <div class="mb-2">
                    <label class="block text-sm font-bold mb-1">Nama Pemilik <span class="font-normal text-xs">(Otomatis)</span></label>
                    <input v-model="userName" class="text-gray-800 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline capitalize" readonly>
                </div>
                <div class="mb-2">
                    <label class="block text-sm font-bold mb-1">Model Mobil <span class="font-normal text-xs">(Otomatis)</span></label>
                    <input v-model="mobilName" class="text-gray-800 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" readonly>
                </div>
                <div class="mb-2">
                    <label for="jumlah" class="block text-sm font-bold mb-1">Jumlah <span class="font-normal text-xs">(Otomatis)</span></label>
                    <input v-model="pembayaran.jumlah" id="jumlah" type="number" class="text-gray-800 rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" readonly>
                </div>
                <div class="mb-2">
                    <label for="metode_pembayaran" class="block text-sm font-bold mb-1">Metode Pembayaran</label>
                    <select v-model="pembayaran.metode_pembayaran" id="metode_pembayaran" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <option disabled value="">Pilih metode pembayaran</option>
                        <option value="Cash">Cash</option>
                        <option value="Transfer bank">Transfer Bank</option>
                        <option value="E-Wallet">E-Wallet</option>
                    </select>
                </div>
                <div class="flex gap-x-2 text-white">
                    <button class="bg-blue-500 hover:bg-blue-700 font-semibold py-2 px-3 rounded-md focus:outline-none focus:shadow-outline" type="submit">
                        Bayar
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
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const pembayaran = ref({
    permintaan_id: route.params.permintaanId,
    jumlah: null,
    tanggal_pembayaran: new Date().toISOString().substring(0, 10),
    metode_pembayaran: '',
    status_pembayaran: 'Lunas'
});

const userName = ref('');
const mobilName = ref('');
const layananName = ref('');
const layananHarga = ref('');

onMounted(async () => {
    if (pembayaran.value.permintaan_id) {
        await fetchPermintaanDetails();
    }
});

watch(layananHarga, (newVal) => {
    // Set the amount when layananHarga is updated
    pembayaran.value.jumlah = newVal;
});

const fetchPermintaanDetails = async () => {
    try {
        const { data } = await axios.get(`http://localhost:8000/api/permintaans/${pembayaran.value.permintaan_id}`, {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
        });
        const permintaan = data.data;
        userName.value = await fetchUserName(permintaan.user_id);
        mobilName.value = await fetchMobilName(permintaan.mobil_id);
        layananName.value = await fetchLayananName(permintaan.layanan_id);
        layananHarga.value = await fetchLayananHarga(permintaan.layanan_id);
    } catch (error) {
        console.error('Failed to fetch permintaan details:', error);
        alert('Failed to load permintaan details.');
    }
};

const fetchUserName = async (userId) => {
    try {
        const { data } = await axios.get(`http://localhost:8000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
        });
        return data.data.name;
    } catch (error) {
        console.error('Error fetching user:', error);
        return 'Unknown User';
    }
};

const fetchMobilName = async (mobilId) => {
    try {
        const { data } = await axios.get(`http://localhost:8000/api/mobils/${mobilId}`, {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
        });
        return data.data.model_mobil;
    } catch (error) {
        console.error('Error fetching mobil:', error);
        return 'Unknown Mobil';
    }
};

const fetchLayananName = async (layananId) => {
    try {
        const { data } = await axios.get(`http://localhost:8000/api/layanans/${layananId}`, {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
        });
        return data.data.nama_layanan;
    } catch (error) {
        console.error('Error fetching mobil:', error);
        return 'Unknown Layanan';
    }
};

const fetchLayananHarga = async (layananId) => {
    try {
        const { data } = await axios.get(`http://localhost:8000/api/layanans/${layananId}`, {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
        });
        return data.data.harga;
    } catch (error) {
        console.error('Error fetching mobil:', error);
        return 'Unknown Layanan';
    }
};

const submitForm = async () => {
    if (!pembayaran.value.permintaan_id || !pembayaran.value.jumlah || !pembayaran.value.metode_pembayaran) {
        alert('Data tidak valid, harap lengkapi semua form');
        return;
    }
    try {
        const requestData = {
            ...pembayaran.value,
            user_id: authStore.user.id
        };
        await axios.post('http://localhost:8000/api/pembayarans', requestData, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        alert('Berhasil menambahkan Pembayaran!');
        router.push({ name: 'pembayaranlist' });
    } catch (error) {
        console.error('There was an error!', error);
        alert('Gagal menambahkan data Pembayaran.');
    }
};

const confirmCancel = () => {
    if (confirm('Apakah anda yakin? Perubahan yang dibuat tidak akan tersimpan!')) {
        router.go(-1);
    }
};
</script>
