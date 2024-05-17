<template>
    <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-xl font-semibold"><span v-if="authStore.user.data.role == 1">Semua</span> Permintaan <span v-if="authStore.user.data.role !== 1">Anda</span></h1>
            <RouterLink v-if="hasMobils" to="/permintaancreate" class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">Tambah</RouterLink>
            <div v-else class="text-xs">
                Anda belum memiliki mobil terdaftar, silahkan
                <RouterLink to="/mobilcreate" class="text-blue-600 font-semibold hover:underline">tambah mobil</RouterLink> 
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto">
                <thead class="bg-blue-500/10">
                    <tr class="border-y text-xs uppercase">
                        <th class="px-4 py-2 text-left">No</th>
                        <th class="px-4 py-2 text-left">Pemilik</th>
                        <th class="px-4 py-2 text-left">Mobil</th>
                        <th class="px-4 py-2 text-left">Layanan</th>
                        <th class="px-4 py-2 text-left">Status Pengerjaan</th>
                        <th class="px-4 py-2 text-left">Status Pembayaran</th>
                        <th class="px-4 py-2 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody v-if="permintaans && permintaans.length > 0">
                    <tr class="hover:bg-slate-300 even:bg-gray-300/5" v-for="(permintaan, index) in permintaans" :key="permintaan.id">
                        <td class="border-b px-4 py-2">{{ index + 1 }}</td>
                        <td class="border-b px-4 py-2 capitalize">{{ getUserName(permintaan.user_id) }}</td>
                        <td class="border-b px-4 py-2">{{ getMobilName(permintaan.mobil_id) }}</td>
                        <td class="border-b px-4 py-2">{{ getLayananName(permintaan.layanan_id) }}</td>
                        <td class="border-b px-4 py-2">
                            <div class="flex w-full">
                                <!-- menonaktifkan opsi jika user bukanlah Admin dan menyembunyikan opsi jika status permintaan sudah Selesai -->
                                <select :disabled="!isAdmin" v-if="permintaan.status !== 'Selesai'" v-model="permintaan.status" @change="confirmStatusChange(permintaan)" :class="{ 'bg-pink-500': permintaan.status == 'Pending', 'bg-blue-500': permintaan.status == 'Dalam Proses' }" class="appearance-none text-xs text-white cursor-pointer text-center rounded-md py-1 w-full focus:outline-none">
                                    <option v-if="permintaan.status == 'Pending'" value="Pending">Pending</option>
                                    <option value="Dalam Proses">Proses</option>
                                    <option value="Selesai">Selesaikan</option>
                                </select>
                                <!-- jika status permintaan sudah selesai -->
                                <span v-if="permintaan.status == 'Selesai'" class="bg-green-500 py-1 rounded-md text-white text-xs text-center w-full">Selesai</span>
                            </div>
                        </td>
                        <td class="border-b px-4 py-2">
                            <!-- Menampilkan tombol bayar jika pembayaran belum dilakukan -->
                            <div v-if="!permintaan.isPaid" class="flex items-center gap-x-1">
                                <p class="text-xs">Menunggu</p>
                                <RouterLink :to="{ name: 'pembayarancreate', params: { permintaanId: permintaan.id }}" class="bg-yellow-500 hover:bg-yellow-700 text-white text-xs py-1 px-3 rounded-md">Bayar</RouterLink>
                            </div>
                            <!-- Menampilkan status lunas jika pembayaran telah dilakukan -->
                            <p v-else class="text-sm text-slate-600">Lunas✅</p>
                        </td>
                        <td class="border-b px-4 py-2 text-white">
                            <!-- Menyembunyikan tombol aksi jika user bukan admin dan status pengerjaan sudah dalam proses atau selesai -->
                            <div v-if="isAdmin && permintaan.status == 'Pending'" class="flex gap-x-2 text-sm">
                                <RouterLink :to="'/permintaanedit/' + permintaan.id" class="bg-green-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded">Edit</RouterLink>
                                <button @click="confirmDelete(permintaan.id)" class="bg-red-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded">Hapus</button>
                            </div>
                            <div v-else class="text-gray-900 text-xs">
                                Permintaan yang telah diproses atau selesai tidak dapat diubah.
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
const permintaans = ref([]);
const usersMap = ref({});
const mobilsMap = ref({});
const layanansMap = ref({});
const pembayaransMap = ref({});

const fetchData = async () => {
    try {
        const responses = await Promise.all([
            axios.get('http://localhost:8000/api/permintaans', {
                headers: { Authorization: `Bearer ${authStore.accessToken}` },
            }),
            axios.get('http://localhost:8000/api/users', {
                headers: { Authorization: `Bearer ${authStore.accessToken}` },
            }),
            axios.get('http://localhost:8000/api/mobils', {
                headers: { Authorization: `Bearer ${authStore.accessToken}` },
            }),
            axios.get('http://localhost:8000/api/layanans', {
                headers: { Authorization: `Bearer ${authStore.accessToken}` },
            }),
            axios.get('http://localhost:8000/api/pembayarans', {
                headers: { Authorization: `Bearer ${authStore.accessToken}` },
            })
        ]);

        const [permintaansResponse, usersResponse, mobilsResponse, layanansResponse, pembayaransResponse] = responses;
        
        // Map untuk user, mobil, layanan, dan pembayaran agar muddah diakses
        usersMap.value = Object.fromEntries(usersResponse.data.data.map(user => [user.id, user]));
        mobilsMap.value = Object.fromEntries(mobilsResponse.data.data.map(mobil => [mobil.id, mobil]));
        layanansMap.value = Object.fromEntries(layanansResponse.data.data.map(layanan => [layanan.id, layanan]));
        pembayaransMap.value = Object.fromEntries(pembayaransResponse.data.data.map(pembayaran => [pembayaran.permintaan_id, pembayaran]));

        // Mengintegrasikan apakah permintaan yang dibuat sudah dibayar atau belum
        permintaans.value = permintaansResponse.data.data.map(permintaan => ({
            ...permintaan,
            isPaid: permintaan.id in pembayaransMap.value
        })).reverse()

        if (authStore.user.data.role !== 1) {
            permintaans.value = permintaans.value.filter(permintaan => permintaan.user_id === authStore.user.data.id);
        }
    } catch (error) {
        console.error('Failed to fetch data:', error);
        alert('Failed to fetch data.');
    }
};

const hasMobils = computed(() => {
    return Object.values(mobilsMap.value).some(mobil => mobil.user_id === authStore.user.data.id);
});

onMounted(fetchData);

const getUserName = (userId) => usersMap.value[userId]?.name || 'Unknown';
const getMobilName = (mobilId) => mobilsMap.value[mobilId]?.model_mobil || 'Unknown';
const getLayananName = (layananId) => layanansMap.value[layananId]?.nama_layanan || 'Unknown';

const confirmStatusChange = async (permintaan) => {
    const originalStatus = permintaan.status;  // menangkap status asli jika perubahan status dibatalkan
    const confirmed = confirm(`Are you sure you want to change the status to ${permintaan.status}?`);
    if (confirmed) {
        try {
            const response = await axios.put(`http://localhost:8000/api/permintaans/${permintaan.id}`, {
                status: permintaan.status
            }, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            alert('Status updated successfully!');
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status. Please try again.');
            permintaan.status = originalStatus;
        }
    } else {
        permintaan.status = originalStatus;
    }
};


const confirmDelete = async (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
        try {
            await axios.delete(`http://localhost:8000/api/permintaans/${id}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            permintaans.value = permintaans.value.filter(permintaan => permintaan.id !== id);
            alert('Data Permintaan berhasil dihapus.');
        } catch (error) {
            console.error('Failed to delete permintaan:', error);
            alert('Gagal menghapus data! Terjadi kesalahan saat menghapus data.');
        }
    }
};

const isAdmin = computed(() => {
    return authStore.user && authStore.user.data && authStore.user.data.role === 1;
});
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
