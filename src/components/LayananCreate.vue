<template>
    <div class="w-full flex justify-center mt-4">
        <div class="max-w-2xl w-full">
            <h1 class="text-2xl font-bold mb-5 text-center">Tambah layanan</h1>
            <form @submit.prevent="submitForm" class="bg-slate-400 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4">
                <div class="mb-2">
                    <label for="nama_layanan" class="block text-sm font-bold mb-1">Nama layanan</label>
                    <input v-model="layanan.nama_layanan" id="nama_layanan" type="text" placeholder="Nama layanan" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-2">
                    <label for="harga" class="block text-sm font-bold mb-1">Harga</label>
                    <input v-model="layanan.harga" id="harga" type="number" placeholder="Harga" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-2">
                    <label for="deskripsi" class="block text-sm font-bold mb-1">Deskripsi</label>
                    <textarea v-model="layanan.deskripsi" id="deskripsi" placeholder="Deskripsi" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"></textarea>
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
    const layanan = ref({
        nama_layanan: '',
        harga: '',
        deskripsi: ''
    });
    const router = useRouter();

    const submitForm = async () => {
        // Untuk menampilkan alert jika ada field yang kosong
        if (!layanan.value.nama_layanan || !layanan.value.harga || !layanan.value.deskripsi) {
            alert('Data tidak valid, harap lengkapi semua form');
            return;
        }

        // Melakukan submit data jika kondisi diatas sudah terpenuhi
        try {
            await axios.post('http://localhost:8000/api/layanans', layanan.value, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            // Menampilkan alert jika data berhasil dibuat
            alert('Berhasil menambahkan Layanan!');
            router.push({ name: 'layananlist' });
        } catch (error) {
            console.error('There was an error!', error);
            alert('Gagal menambahkan data Layanan.');
        }
    };

    // Kembali ke halaman sebelumnya jika tombol cancel dikonfirmasi
    const confirmCancel = () => {
        if (confirm('Apakah anda yakin? Perubahan yang dibuat tidak akan tersimpan!')) {
            router.go(-1);
        }
    };
</script>
