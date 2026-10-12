<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4338CA]">
            <UserPlus class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">{{ isEditing ? 'Ubah Konfigurasi Pengguna (LMS)' : 'Registrasi Pengguna dari Direktori ERP' }}</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              {{ isEditing ? 'Ubah peran dan status akses untuk pengguna terdaftar.' : 'Pilih data pegawai dari master ERP HRIS untuk menghindari duplikasi identitas.' }}
            </p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
        <form @submit.prevent="handleSaveUser" class="space-y-6">
          <!-- SECTION A: PENCARIAN & SELEKSI PEGAWAI ERP (Hanya jika Tambah Baru) -->
          <div v-if="!isEditing" class="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold text-slate-700">1. Cari & Pilih Pegawai dari Integrasi ERP (Workday)</label>
              <div class="flex bg-white rounded-lg border border-slate-200 p-0.5">
                <button
                  type="button"
                  @click="erpFilterMode = 'all'"
                  :class="erpFilterMode === 'all' ? 'bg-slate-100 font-bold text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'"
                  class="px-2.5 py-1 text-[10px] rounded-md transition cursor-pointer"
                >
                  Semua ({{ availableErpEmployees.length }})
                </button>
                <button
                  type="button"
                  @click="erpFilterMode = 'unregistered'"
                  :class="erpFilterMode === 'unregistered' ? 'bg-indigo-100 font-bold text-[#4338CA]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'"
                  class="px-2.5 py-1 text-[10px] rounded-md transition cursor-pointer flex items-center gap-1"
                >
                  Belum Terdaftar LMS <span class="bg-indigo-500 text-white px-1.5 rounded-full text-[8px]">{{ unregisteredErpEmployeesCount }}</span>
                </button>
              </div>
            </div>
            
            <div class="relative">
              <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                v-model="erpSearchQuery"
                type="text"
                placeholder="Cari berdasarkan NIK, Nama, Email, atau Departemen..."
                class="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div class="bg-white border border-slate-200 rounded-xl max-h-48 overflow-y-auto custom-scrollbar divide-y divide-slate-100 shadow-inner">
              <div
                v-for="emp in displayedErpEmployees"
                :key="emp.nik"
                @click="selectErpEmployee(emp)"
                :class="selectedErpEmployee?.nik === emp.nik ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-white'"
                class="p-3 transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-indigo-100 text-[#4338CA] font-bold text-xs flex items-center justify-center shrink-0">
                    {{ emp.name?.slice(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {{ emp.name }}
                      <span class="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                        {{ emp.nik }}
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-500">{{ emp.title }} • {{ emp.department }}</div>
                  </div>
                </div>

                <div class="text-right shrink-0">
                  <span
                    v-if="emp.isRegisteredInLms"
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700"
                  >
                    Sudah di LMS ({{ emp.currentLmsRole }})
                  </span>
                  <span
                    v-else
                    :class="selectedErpEmployee?.nik === emp.nik ? 'bg-[#4338CA] text-white' : 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'"
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1"
                  >
                    {{ selectedErpEmployee?.nik === emp.nik ? '✓ Terpilih' : '+ Pilih' }}
                  </span>
                </div>
              </div>

              <div v-if="displayedErpEmployees.length === 0" class="p-6 text-center text-xs text-slate-400">
                Tidak ada karyawan yang cocok dengan pencarian di direktori ERP.
              </div>
            </div>
          </div>

          <!-- SECTION B: DETAIL TERVERIFIKASI ERP (READ-ONLY PROFILE) -->
          <div v-if="selectedErpEmployee || isEditing" class="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
            <div class="flex items-center justify-between border-b border-indigo-100/70 pb-2">
              <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                Profil Terverifikasi dari ERP (Workday HRIS)
              </span>
              <span class="text-[10px] font-mono text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                NIK: {{ userForm.nik || 'EMP-XXXX' }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span class="text-slate-400 block text-[11px]">Nama Lengkap Pegawai:</span>
                <span class="font-bold text-slate-900">{{ userForm.name }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Email Resmi Perusahaan:</span>
                <span class="font-mono text-slate-700 font-semibold">{{ userForm.email }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Departemen / Divisi:</span>
                <span class="font-medium text-slate-800">{{ userForm.department }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Jabatan Struktural:</span>
                <span class="font-medium text-slate-800">{{ userForm.title }}</span>
              </div>
            </div>
            <div class="text-[10px] text-slate-500 italic bg-white/70 p-2 rounded-lg border border-indigo-100/50">
              ℹ Data identitas di atas ditarik langsung dari integrasi ERP HRIS untuk mencegah duplikasi atau data fiktif.
            </div>
          </div>

          <!-- SECTION C: KONFIGURASI HAK AKSES SISTEM HUKUM (LMS) -->
          <div class="space-y-4 pt-1">
            <label class="block text-xs font-bold text-slate-700">
              {{ isEditing ? 'Konfigurasi Hak Akses LMS' : '2. Konfigurasi Hak Akses Sistem Hukum (LMS)' }}
            </label>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Peran (Role RBAC LMS)</label>
                <select
                  v-model="userForm.role"
                  required
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-semibold"
                >
                  <option v-for="(val, rk) in rolesMatrix" :key="rk" :value="rk">{{ rk }}</option>
                </select>
                <p class="text-[10px] text-slate-500 mt-1">Menentukan kapabilitas operasional dan alur persetujuan</p>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Nomor Kontak / WhatsApp</label>
                <input
                  v-model="userForm.phone"
                  type="text"
                  placeholder="+62 811..."
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="userActiveCheck"
                v-model="userForm.active"
                class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label for="userActiveCheck" class="text-xs font-medium text-slate-700 cursor-pointer">
                Akun aktif dan diizinkan login ke dalam sistem hukum (LMS)
              </label>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="!isEditing && !selectedErpEmployee"
              class="px-5 py-2.5 rounded-xl bg-[#4338CA] hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Check class="w-4 h-4" />
              {{ isEditing ? 'Simpan Perubahan' : 'Berikan Akses LMS & Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { UserPlus, X, Search, CheckCircle2, Check } from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  initialUser: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const erpSearchQuery = ref('');
const erpFilterMode = ref('all');
const selectedErpEmployee = ref(null);

const rolesMatrix = computed(() => legalStore.state.masterRoles || {});
const erpEmployees = computed(() => legalStore.state.erpEmployees || []);
const users = computed(() => legalStore.state.users || []);

const availableErpEmployees = computed(() => {
  return erpEmployees.value.map(emp => {
    const existing = users.value.find(u =>
      (emp.email && u.email?.toLowerCase() === emp.email.toLowerCase()) ||
      (emp.nik && u.nik === emp.nik)
    );
    return {
      ...emp,
      isRegisteredInLms: !!existing,
      currentLmsRole: existing ? existing.role : null,
      lmsUserId: existing ? existing.id : null
    };
  });
});

const unregisteredErpEmployeesCount = computed(() => {
  return availableErpEmployees.value.filter(e => !e.isRegisteredInLms).length;
});

const displayedErpEmployees = computed(() => {
  const q = erpSearchQuery.value.toLowerCase().trim();
  return availableErpEmployees.value.filter(emp => {
    if (erpFilterMode.value === 'unregistered' && emp.isRegisteredInLms) {
      return false;
    }
    if (!q) return true;
    return emp.name?.toLowerCase().includes(q) ||
           emp.nik?.toLowerCase().includes(q) ||
           emp.email?.toLowerCase().includes(q) ||
           emp.department?.toLowerCase().includes(q) ||
           emp.title?.toLowerCase().includes(q);
  });
});

const userForm = ref({
  id: '',
  nik: '',
  name: '',
  email: '',
  department: '',
  title: '',
  role: 'LEGAL STAFF',
  phone: '',
  workLocation: '',
  active: true
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    erpSearchQuery.value = '';
    erpFilterMode.value = 'all';
    selectedErpEmployee.value = null;

    if (props.isEditing && props.initialUser) {
      userForm.value = {
        id: props.initialUser.id,
        nik: props.initialUser.nik || props.initialUser.id,
        name: props.initialUser.name,
        email: props.initialUser.email,
        department: props.initialUser.department || 'Legal & Compliance',
        title: props.initialUser.title || '',
        role: props.initialUser.role || 'LEGAL STAFF',
        phone: props.initialUser.phone || '',
        workLocation: props.initialUser.workLocation || 'Head Office Jakarta',
        active: props.initialUser.active !== false
      };
    } else {
      const firstUnregistered = availableErpEmployees.value.find(e => !e.isRegisteredInLms) || availableErpEmployees.value[0];
      if (firstUnregistered) {
        selectErpEmployee(firstUnregistered);
      } else {
        userForm.value = {
          id: '',
          nik: '',
          name: '',
          email: '',
          department: '',
          title: '',
          role: 'LEGAL STAFF',
          phone: '',
          workLocation: '',
          active: true
        };
      }
    }
  }
});

function selectErpEmployee(emp) {
  selectedErpEmployee.value = emp;
  userForm.value = {
    id: emp.lmsUserId || '',
    nik: emp.nik,
    name: emp.name,
    email: emp.email,
    department: emp.department,
    title: emp.title,
    phone: emp.phone || '+62 21 555-0100',
    workLocation: emp.workLocation || 'Head Office Jakarta',
    role: emp.currentLmsRole || emp.defaultRole || 'REQUESTOR',
    active: true
  };
}

function handleSaveUser() {
  if (props.isEditing) {
    legalStore.updateUser(userForm.value.id, {
      name: userForm.value.name,
      email: userForm.value.email,
      department: userForm.value.department,
      title: userForm.value.title,
      role: userForm.value.role,
      phone: userForm.value.phone,
      active: userForm.value.active
    });
    legalStore.triggerToast('Profil pengguna berhasil diperbarui.', 'success');
  } else {
    // Generate an ID based on email or NIK for simulation
    const newId = userForm.value.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const newUserObj = {
      id: newId,
      nik: userForm.value.nik,
      name: userForm.value.name,
      email: userForm.value.email,
      department: userForm.value.department,
      title: userForm.value.title,
      role: userForm.value.role,
      phone: userForm.value.phone,
      active: userForm.value.active,
      joinDate: new Date().toISOString().split('T')[0]
    };
    legalStore.addUser(newUserObj);
    legalStore.triggerToast('Pengguna baru berhasil didaftarkan.', 'success');
  }
  emit('close');
}
</script>
