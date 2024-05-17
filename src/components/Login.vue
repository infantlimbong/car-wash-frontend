<template>
    <div class="h-full mt-20 flex items-center justify-center px-4 -ml-64">
        <div class="max-w-xs bg-slate-500 w-full space-y-10 rounded-md p-4">
            <div class="grid">
                <h2 class="text-center text-2xl font-bold">Login</h2>
                <h4 class="text-center text-base font-semibold">Carwash Web App</h4>
                <h5 class="text-center text-xs font-light">Kevin Grado</h5>
                <h5 class="text-center text-xs font-light">Valentino Rossi</h5>
            </div>
            <form class="space-y-10" @submit.prevent="onSubmit">
                <div v-if="errorMessage" class="text-red-500 text-center text-sm bg-red-100 py-2 rounded-md">
                {{ errorMessage }}
                </div>
                <div class="rounded-md shadow-sm">
                    <div>
                        <label for="email" class="sr-only">Email address</label>
                        <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address">
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password">
                    </div>
                </div>

                <div>
                    <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:border-none focus:outline-none">
                        Login
                    </button>
                    <div class="text-center mt-5">
                        Belum punya akun?
                        <RouterLink to="/register" class="text-blue-700 hover:underline font-semibold rounded-md">Daftar</RouterLink>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
  

<script setup>
    import { ref } from "vue";
    import axios from "axios";
    import { useRouter } from "vue-router";
    import { useAuthStore } from "@/stores/auth";

    const router = useRouter();
    const authStore = useAuthStore();

    const email = ref("");
    const password = ref("");
    const errorMessage = ref(null);

    async function onSubmit() {
        try {
            await axios.get("http://localhost:8000/sanctum/csrf-cookie");

            const response = await axios.post("http://localhost:8000/api/login", {
                email: email.value,
                password: password.value,
            });

            authStore.setAccessToken(response.data.access_token);
            console.log("Login successful");
            router.push({ name: "dashboard" });
        } catch (error) {
            if (error.response && error.response.status === 422 && error.response.data.errors && error.response.data.errors.email) {
                errorMessage.value = error.response.data.errors.email[0];
            } else {
                errorMessage.value = "An error occurred: " + error.message;
            }
            console.error(errorMessage.value);
        }
    }
</script>
