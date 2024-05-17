<template>
    <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-xl font-semibold"><span v-if="authStore.user.data.role == 1">Semua</span> Mobil <span v-if="authStore.user.data.role !== 1">Anda</span></h1>
            <RouterLink to="/mobilcreate" class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">Tambah</RouterLink>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto">
                <thead class="bg-blue-500/10">
                    <tr class="border-y text-xs uppercase">
                        <th class="px-4 py-2 text-left">No</th>
                        <th class="px-4 py-2 text-left">Model Mobil</th>
                        <th class="px-4 py-2 text-left">Nomor Plat</th>
                        <th class="px-4 py-2 text-left">Warna Mobil</th>
                        <th class="px-4 py-2 text-left">Pemilik</th>
                        <th class="px-4 py-2 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody v-if="mobils && mobils.length > 0">
                    <tr class="hover:bg-slate-300 even:bg-gray-300/5" v-for="(mobil, index) in mobils" :key="mobil.id">
                        <td class="border-b px-4 py-2">{{ index + 1 }}</td>
                        <td class="border-b px-4 py-2">{{ mobil.model_mobil }}</td>
                        <td class="border-b px-4 py-2">{{ mobil.nomor_plat }}</td>
                        <td class="border-b px-4 py-2">{{ mobil.warna_mobil }}</td>
                        <td class="border-b px-4 py-2 capitalize">{{ getUserName(mobil.user_id) }}</td>
                        <td class="border-b px-4 py-2 text-white">
                            <div class="flex gap-x-2 text-sm">
                                <RouterLink :to="'/mobiledit/' + mobil.id" class="bg-green-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded">Edit</RouterLink>
                                <button @click="confirmDelete(mobil.id)" class="bg-red-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded">Hapus</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="6" class="text-center pt-12">Tidak ada data</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const mobils = ref([]);
const usersMap = ref({});

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/mobils', {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });

        if (authStore.user.data.role === 1) {
            // Admin gets all data
            mobils.value = response.data.data;
        } else {
            // Non-admin users get only their data
            mobils.value = response.data.data.filter(mobil => mobil.user_id === authStore.user.data.id);
        }

        // Fetch and store users
        const userResponse = await axios.get("http://localhost:8000/api/users", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        const users = userResponse.data.data;
        for (const user of users) {
            usersMap.value[user.id] = user.name;
        }
    } catch (error) {
        console.error('Failed to fetch mobils:', error);
    }
});

const getUserName = (userId) => {
    return usersMap.value[userId] || 'Unknown';
};

const confirmDelete = (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
        deleteMobil(id);
    }
};

const deleteMobil = async (id) => {
    try {
        await axios.delete(`http://localhost:8000/api/mobils/${id}`, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        mobils.value = mobils.value.filter(mobil => mobil.id !== id);
        alert('Data Mobil berhasil dihapus.');
    } catch (error) {
        console.error('Failed to delete mobil:', error);
        alert('Gagal mengapus data! Terjadi kesalahan saat menghapus data.');
    }
};

</script>


<style scoped>
    .overflow-x-auto::-webkit-scrollbar {
        height: 3px;
        background-color: #ffffff5e;
    }

    .overflow-x-auto::-webkit-scrollbar-thumb {
        background-color: #213ebd;
        border-radius: 2px;
    }
</style>
