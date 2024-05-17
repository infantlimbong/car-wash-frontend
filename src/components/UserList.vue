<template>
    <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-xl font-semibold">User</h1>
            <RouterLink to="/usercreate" class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">Tambah</RouterLink>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto">
                <thead class="bg-blue-500/10">
                    <tr class="border-y text-xs uppercase">
                        <th class="px-4 py-2 text-left">No</th>
                        <th class="px-4 py-2 text-left">Name</th>
                        <th class="px-4 py-2 text-left">Email</th>
                        <th class="px-4 py-2 text-left">Role</th>
                        <th class="px-4 py-2 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody v-if="users && users.length > 0">
                    <tr class="hover:bg-slate-300 even:bg-gray-300/5" v-for="(user, index) in users" :key="user.id">
                        <td class="border-b px-4 py-2">{{ index + 1 }}</td>
                        <td class="border-b px-4 py-2 capitalize">{{ user.name }}</td>
                        <td class="border-b px-4 py-2">{{ user.email }}</td>
                        <td v-if="user.role == 1" class="border-b px-4 py-2">Admin</td>
                        <td v-else class="border-b px-4 py-2">Pelanggan</td>
                        <td class="border-b px-4 py-2 text-white">
                            <div class="flex gap-x-2 text-sm">
                                <RouterLink :to="'/useredit/' + user.id" class="bg-green-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded">Edit</RouterLink>
                                <button @click="confirmDelete(user.id)" class="bg-red-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded">Hapus</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="7" class="text-center pt-12">Tidak ada data</td>
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

    const users = ref([]);
    const usersMap = ref({});

    onMounted(async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users', {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            users.value = response.data.data;

            // Store users in a map for easy access
            for (const user of users.value) {
            usersMap.value[user.id] = user;
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    });

    const confirmDelete = (id) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            deleteUser(id);
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            users.value = users.value.filter(user => user.id !== id);
            alert('Data User berhasil dihapus.');
        } catch (error) {
            console.error('Failed to delete user:', error);
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