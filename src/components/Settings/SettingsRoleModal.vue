<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4338CA]">
            <ShieldAlert class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">Tambah Peran Kustom (Custom Role)</h3>
            <p class="text-[10px] text-slate-500 mt-0.5">Duplikasi dari peran dasar yang ada.</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6">
        <form @submit.prevent="handleSaveRole" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nama Peran Kustom Baru</label>
            <input
              v-model="roleForm.name"
              type="text"
              required
              placeholder="Misal: LEGAL OFFICER REGION 2"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Konteks</label>
            <input
              v-model="roleForm.description"
              type="text"
              required
              placeholder="Deskripsi fungsi peran ini..."
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Salin (Clone) Izin dari Peran Dasar</label>
            <select
              v-model="roleForm.cloneFromRole"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option v-for="(val, rk) in rolesMatrix" :key="rk" :value="rk">{{ rk }}</option>
            </select>
          </div>

          <div class="pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-xl bg-[#4338CA] hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Check class="w-4 h-4" />
              Buat Peran Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ShieldAlert, X, Check } from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const rolesMatrix = computed(() => legalStore.state.masterRoles || {});

const roleForm = ref({
  name: '',
  description: '',
  cloneFromRole: 'LEGAL STAFF'
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    roleForm.value = {
      name: '',
      description: '',
      cloneFromRole: 'LEGAL STAFF'
    };
  }
});

function handleSaveRole() {
  const newRoleKey = roleForm.value.name.toUpperCase().trim();
  if (!newRoleKey) return;
  legalStore.addCustomRole(newRoleKey, roleForm.value.cloneFromRole);
  legalStore.triggerToast('Peran kustom baru berhasil ditambahkan.', 'success');
  emit('close');
}
</script>
