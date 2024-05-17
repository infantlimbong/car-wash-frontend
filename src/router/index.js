import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/components/Dashboard.vue'

import UserList from '@/components/UserList.vue'
import UserCreate from '@/components/UserCreate.vue'
import UserEdit from '@/components/UserEdit.vue'
import UserRegister from '@/components/UserRegister.vue'

import LayananList from '@/components/LayananList.vue'
import LayananCreate from '@/components/LayananCreate.vue'
import LayananEdit from '@/components/LayananEdit.vue'

import MobilList from '@/components/MobilList.vue'
import MobilCreate from '@/components/MobilCreate.vue'
import MobilEdit from '@/components/MobilEdit.vue'

import PermintaanList from '@/components/PermintaanList.vue'
import PermintaanCreate from '@/components/PermintaanCreate.vue'
import PermintaanEdit from '@/components/PermintaanEdit.vue'

import PembayaranList from '@/components/PembayaranList.vue'
import PembayaranCreate from '@/components/PembayaranCreate.vue'
import PembayaranEdit from '@/components/PembayaranEdit.vue'

import Login from '@/components/Login.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Register
    {
      path: '/register',
      name: 'register',
      component: UserRegister
    },

    // Login
    {
      path: '/login',
      name: 'login',
      component: Login
    },

    // Dashboard
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },

    // User
    {
      path: '/userlist',
      name: 'userlist',
      component: UserList
    },
    {
      path: '/usercreate',
      name: 'usercreate',
      component: UserCreate
    },
    {
      path: '/useredit/:id',
      name: 'useredit',
      component: UserEdit
    },

    // Layanan
    {
      path: '/layananlist',
      name: 'layananlist',
      component: LayananList
    },
    {
      path: '/layanancreate',
      name: 'layanancreate',
      component: LayananCreate
    },
    {
      path: '/layananedit/:id',
      name: 'layananedit',
      component: LayananEdit
    },

    // Mobil
    {
      path: '/mobillist',
      name: 'mobillist',
      component: MobilList
    },
    {
      path: '/mobilcreate',
      name: 'mobilcreate',
      component: MobilCreate
    },
    {
      path: '/mobiledit/:id',
      name: 'mobiledit',
      component: MobilEdit
    },

    // Permintaan
    {
      path: '/permintaanlist',
      name: 'permintaanlist',
      component: PermintaanList
    },
    {
      path: '/permintaancreate',
      name: 'permintaancreate',
      component: PermintaanCreate
    },
    {
      path: '/permintaanedit/:id',
      name: 'permintaanedit',
      component: PermintaanEdit
    },

    // Pembayaran
    {
      path: '/pembayaranlist',
      name: 'pembayaranlist',
      component: PembayaranList
    },
    {
      path: '/pembayarancreate/:permintaanId?',
      name: 'pembayarancreate',
      component: PembayaranCreate,
      props: true
    },
    {
      path: '/pembayaranedit/:id',
      name: 'pembayaranedit',
      component: PembayaranEdit
    },
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.name !== 'login' && to.name !== 'register' && !authStore.isLoggedIn) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router
