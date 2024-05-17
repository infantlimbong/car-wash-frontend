<template>
    <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-xl font-semibold"><span v-if="authStore.user.data.role == 1">Semua</span> Pembayaran <span v-if="authStore.user.data.role !== 1">Anda</span></h1>
            <h5 class="text-sm bg-blue-500/20 px-2 rounded-md">Pembayaran ditambahkan melalui permintaan</h5>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto">
                <thead class="bg-blue-500/10">
                    <tr class="border-y text-xs uppercase">
                        <th class="px-4 py-2 text-left">No</th>
                        <th class="px-4 py-2 text-left">Jumlah</th>
                        <th class="px-4 py-2 text-left">Metode Pembayaran</th>
                        <th class="px-4 py-2 text-left">Status Pembayaran</th>
                        <th class="px-4 py-2 text-left">Tanggal Pembayaran</th>
                        <th class="px-4 py-2 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody v-if="pembayarans && pembayarans.length > 0">
                    <tr class="hover:bg-slate-300 even:bg-gray-300/5" v-for="(pembayaran, index) in pembayarans" :key="pembayaran.id">
                        <td class="border-b px-4 py-2">{{ index + 1 }}</td>
                        <td class="border-b px-4 py-2">{{ pembayaran.jumlah }}</td>
                        <td class="border-b px-4 py-2">{{ pembayaran.metode_pembayaran }}</td>
                        <td class="border-b px-4 py-2">{{ pembayaran.status_pembayaran }}<span v-if="pembayaran.status_pembayaran == 'Lunas'">✅</span></td>
                        <td class="border-b px-4 py-2">{{ pembayaran.tanggal_pembayaran }}</td>
                        <td class="border-b px-4 py-2 text-white">
                            <div v-if="isAdmin" class="flex gap-x-2 text-sm">
                                <RouterLink :to="'/pembayaranedit/' + pembayaran.id" class="bg-green-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded">Edit</RouterLink>
                                <button @click="confirmDelete(pembayaran.id)" class="bg-red-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded">Hapus</button>
                            </div>

                            <div v-else class="text-xs text-gray-900">
                                Pembayaran yang telah lunas tidak dapat diubah
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
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const pembayarans = ref([]);
const permintaansMap = ref({});

const fetchData = async () => {
    try {
        // Fetch both pembayarans and permintaans data
        const [pembayaranResponse, permintaanResponse] = await Promise.all([
            axios.get('http://localhost:8000/api/pembayarans', {
                headers: { Authorization: `Bearer ${authStore.accessToken}` },
            }),
            axios.get('http://localhost:8000/api/permintaans', {
                headers: { Authorization: `Bearer ${authStore.accessToken}` },
            })
        ]);

        // Create a map from permintaans for quick lookup
        permintaansMap.value = permintaanResponse.data.data.reduce((acc, permintaan) => {
            acc[permintaan.id] = permintaan.user_id;
            return acc;
        }, {});

        // Filter pembayarans based on permintaan's user_id if user is not admin
        if (authStore.user.data.role !== 1) {
            pembayarans.value = pembayaranResponse.data.data.filter(pembayaran =>
                permintaansMap.value[pembayaran.permintaan_id] === authStore.user.data.id
            ).reverse();
        } else {
            pembayarans.value = pembayaranResponse.data.data.reverse();
        }
    } catch (error) {
        console.error('Failed to fetch data:', error);
        alert('Failed to fetch data.');
    }
};

onMounted(async () => {
    await fetchData();
});

const confirmDelete = async (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
        try {
            await axios.delete(`http://localhost:8000/api/pembayarans/${id}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            pembayarans.value = pembayarans.value.filter(pembayaran => pembayaran.id !== id);
            alert('Data Pembayaran berhasil dihapus.');
        } catch (error) {
            console.error('Failed to delete pembayaran:', error);
            alert('Gagal menghapus data! Terjadi kesalahan saat menghapus data.');
        }
    }
};

const isAdmin = computed(() => {
    return authStore.user && authStore.user.data && authStore.user.data.role === 1;
});
</script>

