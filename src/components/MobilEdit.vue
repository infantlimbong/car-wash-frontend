<template>
    <div class="w-full flex justify-center mt-4">
        <div class="max-w-2xl w-full">
            <h1 class="text-2xl font-bold mb-5 text-center">Edit Mobil</h1>
            <form @submit.prevent="submitForm" class="bg-slate-400 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4">
                <div class="mb-2">
                    <label for="model_mobil" class="block text-sm font-bold mb-1">Model mobil</label>
                    <input v-model="mobil.model_mobil" id="model_mobil" type="text" placeholder="Model mobil" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-2">
                    <label for="nomor_plat" class="block text-sm font-bold mb-1">Nomor plat</label>
                    <input v-model="mobil.nomor_plat" id="nomor_plat" type="text" placeholder="Nomor plat" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-2">
                    <label for="warna_mobil" class="block text-sm font-bold mb-1">Warna mobil</label>
                    <input v-model="mobil.warna_mobil" id="warna_mobil" type="text" placeholder="Warna mobil" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
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
    const mobilId = route.params.id;
    const mobil = ref({
        model_mobil: '',
        nomor_plat: '',
        warna_mobil: ''
    });

    onMounted(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/mobils/${mobilId}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                }
            });
            mobil.value = response.data.data;
        } catch (error) {
            console.error('Error fetching mobil details:', error);
            alert('Failed to load mobil details.');
        }
    });

    const submitForm = async () => {
        if (!mobil.value.model_mobil || !mobil.value.nomor_plat || !mobil.value.warna_mobil) {
            alert('Data tidak valid, harap lengkapi semua form');
            return;
        }
        try {
            await axios.put(`http://localhost:8000/api/mobils/${mobilId}`, mobil.value, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                }
            });
            alert('Berhasil memperbarui Mobil!');
            router.push({ name: 'mobillist' });
        } catch (error) {
            console.error('There was an error updating mobil:', error);
            alert('Gagal memperbarui data Mobil.');
        }
    };

    const confirmCancel = () => {
        if (confirm('Apakah anda yakin? Perubahan yang dibuat tidak akan tersimpan!')) {
            router.go(-1);
        }
    };
</script>
