<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-slate-200">
      <!-- Modal Header -->
      <div class="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4338CA]">
            <ShieldAlert class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base font-bold text-[#0F172A]">Tambah Peran Kustom (Custom Role)</h3>
            <p class="text-[11px] text-[#64748B] mt-0.5">Duplikasi hak akses dari peran dasar ke peran operasional baru.</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center transition cursor-pointer"
          title="Tutup"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Modal Body Form -->
      <div class="p-6 overflow-y-auto max-h-[80vh]">
        <form @submit.prevent="handleSaveRole" class="space-y-4 text-xs">
          <!-- Role Name -->
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">
              Nama / Kode Peran Kustom Baru *
            </label>
            <input
              v-model="roleForm.name"
              type="text"
              required
              placeholder="Misal: LEGAL OFFICER REGIONAL 2"
              class="form-input text-xs w-full h-[38px] uppercase font-mono font-bold"
            />
            <p class="text-[10px] text-[#64748B] mt-1">Nama kode peran otomatis dikonversi ke huruf besar (Uppercase).</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">
              Deskripsi & Konteks Fungsi Peran *
            </label>
            <textarea
              v-model="roleForm.description"
              required
              rows="2"
              placeholder="Misal: Penelaahan kontrak regional, perizinan OSS wilayah, dan administrasi lelang unit..."
              class="form-input text-xs w-full p-2.5 leading-relaxed resize-none"
            ></textarea>
          </div>

          <!-- Clone From Base Role Selection -->
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">
              Salin (Clone) Izin dari Peran Dasar *
            </label>
            <select
              v-model="roleForm.cloneFromRole"
              required
              class="form-select text-xs w-full h-[38px] font-semibold"
            >
              <option value="" disabled>-- Pilih Peran Acuan untuk Menyalin Izin --</option>
              <option
                v-for="opt in baseRoleOptions"
                :key="opt.key"
                :value="opt.key"
              >
                {{ opt.key }} — {{ opt.label }}
              </option>
              <option value="EMPTY">-- Izin Kosong (Semua Izin Awal Nonaktif) --</option>
            </select>
          </div>

          <!-- Live Preview Box: Cloned Permissions Details -->
          <div
            v-if="selectedRoleInfo"
            class="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-2.5 animate-in fade-in duration-150"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <ShieldCheck class="w-4 h-4 text-indigo-600" />
                <span>Pratinjau Paket Izin: {{ roleForm.cloneFromRole === 'EMPTY' ? 'Izin Kosong' : roleForm.cloneFromRole }}</span>
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-[#4338CA] border border-indigo-200">
                {{ activeCapabilitiesCount }} / {{ totalCapabilitiesCount }} Izin Aktif
              </span>
            </div>

            <p class="text-[11px] text-indigo-800 leading-relaxed">
              {{ selectedRoleInfo.description }}
            </p>

            <!-- Active Permissions Badges -->
            <div v-if="activeCapabilitiesList.length > 0" class="pt-1.5 border-t border-indigo-200/60">
              <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block mb-1.5">
                Hak Akses yang Akan Diberikan Otomatis:
              </span>
              <div class="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
                <span
                  v-for="cap in activeCapabilitiesList"
                  :key="cap.key"
                  class="px-2 py-0.5 rounded bg-white text-indigo-700 text-[10px] font-medium border border-indigo-200/70 shadow-2xs"
                >
                  ✓ {{ cap.label }}
                </span>
              </div>
            </div>

            <p class="text-[10px] text-indigo-600 italic mt-1">
              * Seluruh izin di atas dapat disesuaikan kembali secara individual melalui tabel Matriks RBAC setelah peran disimpan.
            </p>
          </div>

          <!-- Form Actions -->
          <div class="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F1F5F9] font-semibold text-xs cursor-pointer transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-lg bg-[#4338CA] hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Check class="w-4 h-4 stroke-[2.5]" />
              <span>Buat Peran Baru</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ShieldAlert, ShieldCheck, X, Check } from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  rolesMatrix: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close']);

const roleForm = ref({
  name: '',
  description: '',
  cloneFromRole: 'STAFF LEGAL'
});

const activeRolesMatrix = computed(() => {
  if (props.rolesMatrix && Object.keys(props.rolesMatrix).length > 0) {
    return props.rolesMatrix;
  }
  return legalStore.state.rolesMatrix || legalStore.state.masterRoles || {};
});

const capabilitiesList = computed(() => {
  return legalStore.state.capabilityList || legalStore.state.masterCapabilities || [];
});

const totalCapabilitiesCount = computed(() => capabilitiesList.value.length || 13);

const baseRoleOptions = computed(() => {
  const matrix = activeRolesMatrix.value;
  const keys = Object.keys(matrix);
  if (!keys.length) {
    return [
      { key: 'STAFF LEGAL', label: 'Staff Legal' },
      { key: 'KEPALA LEGAL', label: 'Kepala Legal' },
      { key: 'REQUESTOR', label: 'Requestor' },
      { key: 'DIREKTUR (DASHBOARD)', label: 'Direktur (dashboard)' },
      { key: 'SUPER ADMIN', label: 'Super Admin' }
    ];
  }
  return keys.map(k => ({
    key: k,
    label: matrix[k]?.label || k
  }));
});

const selectedRoleInfo = computed(() => {
  const selectedKey = roleForm.value.cloneFromRole;
  if (!selectedKey) return null;
  if (selectedKey === 'EMPTY') {
    return {
      description: 'Peran akan dibuat dengan seluruh izin kapabilitas dinonaktifkan (akses kosong). Anda dapat mencentang izin yang diperlukan secara manual pada Matriks RBAC.',
      capabilities: {}
    };
  }
  const role = activeRolesMatrix.value[selectedKey];
  return {
    description: role?.description || `Paket izin standar dari peran ${selectedKey}`,
    capabilities: role?.capabilities || {}
  };
});

const activeCapabilitiesList = computed(() => {
  if (!selectedRoleInfo.value) return [];
  const caps = selectedRoleInfo.value.capabilities || {};
  return capabilitiesList.value.filter(c => !!caps[c.key]);
});

const activeCapabilitiesCount = computed(() => {
  return activeCapabilitiesList.value.length;
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    roleForm.value = {
      name: '',
      description: '',
      cloneFromRole: 'STAFF LEGAL'
    };
  }
});

function handleSaveRole() {
  const newRoleKey = roleForm.value.name.toUpperCase().trim();
  if (!newRoleKey) {
    legalStore.triggerToast('Nama peran kustom wajib diisi', 'warning');
    return;
  }
  if (!roleForm.value.cloneFromRole) {
    legalStore.triggerToast('Pilih peran dasar untuk menyalin izin', 'warning');
    return;
  }

  const cloneTarget = roleForm.value.cloneFromRole === 'EMPTY' ? null : roleForm.value.cloneFromRole;
  const success = legalStore.addCustomRole({
    name: newRoleKey,
    description: roleForm.value.description.trim() || `Peran kustom operasional: ${newRoleKey}`,
    cloneFromRole: cloneTarget
  });

  if (success) {
    emit('close');
  }
}
</script>
