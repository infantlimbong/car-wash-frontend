<template>
    <div class="w-full flex justify-center mt-4">
        <div class="max-w-2xl w-full">
            <h1 class="text-2xl font-bold mb-5 text-center">Tambah permintaan</h1>
            <form @submit.prevent="submitForm" class="bg-slate-400 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4">
                <div class="mb-2">
                    <label for="mobil_id" class="block text-sm font-bold mb-1">Mobil</label>
                    <select v-model="permintaan.mobil_id" id="mobil_id" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <option disabled value="">Pilih mobil anda</option>
                        <option v-for="mobil in mobils" :key="mobil.id" :value="mobil.id">{{ mobil.model_mobil }}</option>
                    </select>
                </div>
                <div class="mb-2">
                    <label for="layanan_id" class="block text-sm font-bold mb-1">Layanan</label>
                    <select v-model="permintaan.layanan_id" id="layanan_id" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Pilih layanan</option>
                        <option v-for="layanan in layanans" :key="layanan.id" :value="layanan.id">{{ layanan.nama_layanan }}</option>
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
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const permintaan = ref({
    mobil_id: '',
    layanan_id: '',
    status: 'Pending'
});
const router = useRouter();

// Fetch the list of mobils and layanans
const mobils = ref([]);
const layanans = ref([]);

const fetchData = async () => {
    try {
        const [mobilsResponse, layanansResponse] = await Promise.all([
            axios.get('http://localhost:8000/api/mobils', {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            }),
            axios.get('http://localhost:8000/api/layanans', {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            })
        ]);
        // mobils.value = mobilsResponse.data.data;
        const allMobils = mobilsResponse.data.data;
        mobils.value = allMobils.filter(mobil => mobil.user_id === authStore.user.data.id);

        // layanan data
        layanans.value = layanansResponse.data.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        alert('Failed to fetch data.');
    }
};

fetchData(); // Fetch data on component mount

const submitForm = async () => {
    if (!permintaan.value.mobil_id || !permintaan.value.layanan_id) {
        alert('Data tidak valid, harap lengkapi semua form');
        return;
    }
    try {
        const requestData = {
            ...permintaan.value,
            user_id: authStore.user.id
        };
        await axios.post('http://localhost:8000/api/permintaans', requestData, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        alert('Berhasil menambahkan Permintaan!');
        router.push({ name: 'permintaanlist' });
    } catch (error) {
        console.error('There was an error!', error);
        alert('Gagal menambahkan data Permintaan.');
    }
};

const confirmCancel = () => {
    if (confirm('Apakah anda yakin? Perubahan yang dibuat tidak akan tersimpan!')) {
        router.go(-1);
    }
};
</script>
