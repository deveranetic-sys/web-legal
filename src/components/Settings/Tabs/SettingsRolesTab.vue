<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldAlert class="w-5 h-5 text-indigo-600" />
          Konfigurasi Hak Akses (Role-Based Access Control)
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          Atur kapabilitas sistem spesifik (CRUD, Approval, Confidential) untuk setiap level peran (Role).
        </p>
      </div>
      <button
        @click="$emit('open-add-role-modal')"
        class="px-4 py-2 bg-[#4338CA] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
      >
        <Plus class="w-4 h-4" />
        Tambah Peran Kustom
      </button>
    </div>

    <!-- Capabilities Matrix Table -->
    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
            <tr>
              <th class="py-3 px-4 min-w-[200px]">Peran (Role)</th>
              <th
                v-for="cap in (legalStore.state.masterCapabilities || [])"
                :key="cap.key"
                class="py-3 px-2 text-center min-w-[100px]"
                :title="cap.label + ' (' + cap.category + ')'"
              >
                <div class="flex flex-col items-center gap-0.5">
                  <span class="truncate w-full">{{ cap.label }}</span>
                  <span class="text-[8px] px-1 bg-slate-200 rounded text-slate-600">{{ cap.category }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="(roleData, roleKey) in rolesMatrix"
              :key="roleKey"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="py-3 px-4 font-bold text-slate-900 border-r border-slate-100 relative group">
                <div class="flex items-center justify-between">
                  <span>{{ roleKey }}</span>
                  <button
                    v-if="!['ADMIN', 'LEGAL MANAGER', 'REQUESTOR'].includes(roleKey)"
                    @click.stop="confirmDeleteRole(roleKey)"
                    class="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition"
                    title="Hapus Peran Kustom"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
              <td
                v-for="cap in (legalStore.state.masterCapabilities || [])"
                :key="cap.key"
                class="py-2 px-2 text-center border-r border-slate-100"
              >
                <button
                  @click="legalStore.toggleRoleCapability(roleKey, cap.key)"
                  :class="roleData.capabilities?.[cap.key] ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-slate-500'"
                  class="w-6 h-6 rounded-md inline-flex items-center justify-center transition cursor-pointer font-bold"
                  :title="(roleData.capabilities?.[cap.key] ? 'Cabut' : 'Berikan') + ' akses ' + cap.label"
                >
                  {{ roleData.capabilities?.[cap.key] ? '✓' : '✕' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ShieldAlert, Plus, Trash2 } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  rolesMatrix: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['open-add-role-modal']);

async function confirmDeleteRole(roleKey) {
  const confirmed = await legalStore.confirm({
    title: 'Hapus Peran Kustom?',
    message: `Yakin ingin menghapus peran kustom "${roleKey}" dari matriks sistem?`,
    confirmText: 'Ya, Hapus Peran',
    cancelText: 'Batal',
    variant: 'danger'
  });
  if (confirmed) {
    legalStore.deleteCustomRole(roleKey);
  }
}
</script>
