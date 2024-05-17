<template>
    <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-xl font-semibold">Layanan</h1>
            <RouterLink v-if="isAdmin" to="/layanancreate" class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">Tambah</RouterLink>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto">
                <thead class="bg-blue-500/10">
                    <tr class="border-y text-xs uppercase">
                        <th class="px-4 py-2 text-left">No</th>
                        <th class="px-4 py-2 text-left">Layanan</th>
                        <th class="px-4 py-2 text-left">Harga</th>
                        <th class="px-4 py-2 text-left">Deskripsi</th>
                        <th v-if="isAdmin" class="px-4 py-2 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody v-if="layanans && layanans.length > 0">
                    <tr class="hover:bg-slate-300 even:bg-gray-300/5" v-for="(layanan, loop) in layanans" :key="layanan.id">
                        <td class="border-b px-4 py-2">{{ loop + 1 }}</td>
                        <td class="border-b px-4 py-2 capitalize">{{ layanan.nama_layanan }}</td>
                        <td class="border-b px-4 py-2">{{ layanan.harga }}</td>
                        <td class="border-b px-4 py-2">{{ layanan.deskripsi }}</td>
                        <td v-if="isAdmin" class="border-b px-4 py-2 text-white">
                            <div class="flex gap-x-2 text-sm">
                                <RouterLink :to="'/layananedit/' + layanan.id" class="bg-green-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded">Edit</RouterLink>
                                <button @click="confirmDelete(layanan.id)" class="bg-red-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded">Hapus</button>
                            </div>
                        </td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr>
                        <td colspan="8" class="text-center pt-12">Tidak ada data</td>
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

    const layanans = ref([]);

    onMounted(async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/layanans', {
                headers:{
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            layanans.value = response.data.data;
        } catch (error) {
            console.error('Failed to fetch layanans:', error);
        }
    });

    const confirmDelete = (id) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            deleteLayanan(id);
        }
    };

    // Fungsi untuk menghapus data user
    const deleteLayanan = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/layanans/${id}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            layanans.value = layanans.value.filter(m => m.id !== id);
            alert('Data Layanan berhasil dihapus.');
        } catch (error) {
            console.error('Failed to delete layanan:', error);
            alert('Gagal mengapus data! Terjadi kesalahan saat menghapus data.');
        }
    };

    // Mendefinisikan role user 1 === admin
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