<template>
  <div>
    <!-- Header -->
    <header v-if="authStore.isLoggedIn" class="sticky top-0 bg-indigo-600 text-white z-40">
      <div class="flex justify-between h-16 items-center px-5">
        <h1 class="text-2xl font-bold">Carwash</h1>

        <!-- Untuk menampilkan nama user yang login -->
        <h2 class="capitalize" v-if="authStore.user && authStore.user.data && authStore.user.data.name">
          <b>{{ authStore.user.data.name }}</b>

          <!-- Untuk menampilkan role user yang login. Admin | Pelanggan -->
          <span v-if="isAdmin" class="text-sm font-light">, Admin</span>
          <span v-else class="text-sm font-light">, Pelanggan</span>
        </h2>
      </div>
    </header>

    <!-- Navigasi -->
    <nav v-if="authStore.isLoggedIn" class="bg-indigo-600 fixed w-64 h-full">
      <div class="flex flex-col justify-start">
        <RouterLink to="/" :class="{ 'bg-indigo-500': route.path === '/' }" class="text-white font-semibold px-5 py-3 hover:bg-indigo-500">
          Dashboard
        </RouterLink>

        <!-- v-if="isAdmin" = Memastikan hanya admin yang dapat melihat, mengubah dan menghapus data user -->
        <RouterLink v-if="isAdmin" to="/userlist" :class="{ 'bg-indigo-500': route.path === '/userlist' || route.path === '/mobilcreate' }"  class="text-white font-semibold px-5 py-3 hover:bg-indigo-500">
          User
        </RouterLink>
        <RouterLink to="/mobillist" :class="{ 'bg-indigo-500': route.path === '/mobillist' || route.path === '/mobilcreate' }" class="text-white font-semibold px-5 py-3 hover:bg-indigo-500">
          Mobil
        </RouterLink>
        <RouterLink to="/permintaanlist" :class="{ 'bg-indigo-500': route.path === '/permintaanlist' || route.path === '/permintaancreate' }" class="text-white font-semibold px-5 py-3 hover:bg-indigo-500">
          Permintaan
        </RouterLink>
        <RouterLink to="/pembayaranlist" :class="{ 'bg-indigo-500': route.path === '/pembayaranlist' || route.path === '/pembayaranlist' }" class="text-white font-semibold px-5 py-3 hover:bg-indigo-500">
          Pembayaran
        </RouterLink>
        <RouterLink to="/layananlist" :class="{ 'bg-indigo-500': route.path === '/layananlist' || route.path === '/layanancreate' }" class="text-white font-semibold px-5 py-3 hover:bg-indigo-500">
          Layanan
        </RouterLink>
        <button @click="logout" class="text-start text-white font-semibold px-5 py-3 hover:bg-indigo-500">
          Logout
        </button>
      </div>
    </nav>

    <!-- Konten Utama -->
    <div class="p-5 ml-64">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { RouterLink, RouterView } from "vue-router";
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from "@/stores/auth";

  const authStore = useAuthStore();

  const router = useRouter();
  const route = useRoute();

  // Untuk mendefinisikan role user, jika 1 (Admin) dan 0 (Pelanggan)
  const isAdmin = computed(() => {
    return authStore.user && authStore.user.data && authStore.user.data.role === 1;
  });

  // Untuk logout
  const logout = () => {
    authStore.logout(); 
    router.push({ name: "login" });
  };
</script>

