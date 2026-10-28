<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Users class="w-5 h-5 text-indigo-600" />
          Manajemen Pengguna (Pegawai)
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          Kelola akses akun individual dan hubungkan identitas dari ERP perusahaan.
        </p>
      </div>

      <button
        @click="$emit('open-add-user-modal')"
        class="px-4 py-2 bg-[#4338CA] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
      >
        <UserPlus class="w-4 h-4" />
        Daftarkan Pengguna
      </button>
    </div>

    <!-- Filters & Search -->
    <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3">
      <div class="flex-1 relative">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          v-model="userSearchQuery"
          type="text"
          placeholder="Cari berdasarkan nama, NIK, email, departemen..."
          class="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <select
        v-model="userRoleFilter"
        class="md:w-48 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        <option value="">Semua Peran</option>
        <option v-for="(val, rk) in rolesMatrix" :key="rk" :value="rk">{{ rk }}</option>
      </select>

      <select
        v-model="userStatusFilter"
        class="md:w-36 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        <option value="">Semua Status</option>
        <option value="active">Aktif</option>
        <option value="inactive">Nonaktif</option>
      </select>
    </div>

    <!-- Users Table -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
            <tr>
              <th class="py-3 px-4">Pegawai (Identitas ERP)</th>
              <th class="py-3 px-4">Kontak & Departemen</th>
              <th class="py-3 px-4">Peran & Otoritas Sistem</th>
              <th class="py-3 px-4">Status Akses</th>
              <th class="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-slate-50 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-indigo-100 text-[#4338CA] font-bold text-xs flex items-center justify-center shrink-0">
                    {{ u.name.slice(0,2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 flex items-center gap-1.5">
                      {{ u.name }}
                      <span v-if="u.id === legalStore.state.currentUser.id" class="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[9px] font-extrabold uppercase">Anda</span>
                    </div>
                    <div class="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                      <Fingerprint class="w-3 h-3" /> NIK: {{ u.nik }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="font-medium text-slate-800">{{ u.department }}</div>
                <div class="text-[10px] text-slate-500 mt-0.5">{{ u.email }}</div>
              </td>
              <td class="py-3 px-4">
                <div class="flex flex-col items-start gap-1">
                  <span :class="getRoleBadgeClass(u.role)" class="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                    {{ u.role }}
                  </span>
                  <span class="text-[10px] text-slate-500">{{ u.title }}</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <span :class="u.active !== false ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-red-100 text-red-800'" class="px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {{ u.active !== false ? 'AKTIF' : 'NONAKTIF' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="u.id !== legalStore.state.currentUser.id && u.active !== false"
                    @click="legalStore.switchToUser(u.id)"
                    class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Simulasikan Login sebagai pengguna ini"
                  >
                    <LogIn class="w-4 h-4" />
                  </button>
                  <button
                    @click="$emit('open-edit-user-modal', u)"
                    class="p-1.5 text-slate-400 hover:text-[#4338CA] hover:bg-slate-100 rounded-lg transition"
                    title="Ubah Konfigurasi"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    v-if="u.id !== legalStore.state.currentUser.id"
                    @click="legalStore.toggleUserActive(u.id)"
                    :class="u.active !== false ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'"
                    class="p-1.5 rounded-lg transition"
                    :title="u.active !== false ? 'Nonaktifkan Akses' : 'Aktifkan Akses'"
                  >
                    <Power class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredUsers.length === 0" class="p-8 text-center text-xs text-slate-500 bg-white">
          Tidak ada pengguna yang cocok dengan filter pencarian.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Users, UserPlus, Search, Fingerprint, LogIn, Edit2, Power } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  users: {
    type: Array,
    required: true
  },
  rolesMatrix: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['open-add-user-modal', 'open-edit-user-modal']);

const userSearchQuery = ref('');
const userRoleFilter = ref('');
const userStatusFilter = ref('');

const filteredUsers = computed(() => {
  return props.users.filter(u => {
    const q = userSearchQuery.value.toLowerCase().trim();
    const matchQ = !q ||
      u.name?.toLowerCase().includes(q) ||
      u.nik?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q) ||
      u.title?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q);

    const matchRole = !userRoleFilter.value || u.role === userRoleFilter.value;
    const matchStatus = !userStatusFilter.value ||
      (userStatusFilter.value === 'active' && u.active !== false) ||
      (userStatusFilter.value === 'inactive' && u.active === false);

    return matchQ && matchRole && matchStatus;
  });
});

function getRoleBadgeClass(role) {
  switch (role) {
    case 'SUPER ADMIN':
    case 'ADMIN':
      return 'bg-purple-100 text-purple-800 border border-purple-200';
    case 'KEPALA LEGAL':
    case 'LEGAL MANAGER':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'STAFF LEGAL':
    case 'LEGAL COUNSEL':
    case 'LEGAL STAFF':
      return 'bg-indigo-100 text-[#4338CA] border border-indigo-200';
    case 'REQUESTOR':
      return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    case 'DIREKTUR (DASHBOARD)':
    case 'MANAGEMENT':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}
</script>
