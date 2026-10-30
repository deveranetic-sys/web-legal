<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-slate-200">
      <!-- Modal Header -->
      <div class="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4338CA]">
            <component :is="isEdit ? Pencil : GitFork" class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base font-bold text-[#0F172A]">
              {{ isEdit ? 'Edit Butir Tahapan (Step)' : 'Tambah Butir Tahapan (Step)' }}
            </h3>
            <p class="text-[11px] text-[#64748B] mt-0.5">
              Alur Sektor: <strong class="text-[#0F172A]">{{ sectorName }} ({{ sectorCode }})</strong>
            </p>
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

      <!-- Form Body -->
      <div class="p-6 overflow-y-auto max-h-[80vh]">
        <form @submit.prevent="handleSubmit" class="space-y-4 text-xs">
          <!-- Stage Full Name -->
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">
              Nama Lengkap Tahapan Tender *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Contoh: 5. Evaluasi Teknis, Kualifikasi & EKH (<80% HPS)"
              class="form-input text-xs w-full h-[38px]"
            />
            <p class="text-[10px] text-[#64748B] mt-1">Nama tahapan yang ditampilkan pada alur pipeline dan stepper tender.</p>
          </div>

          <!-- Stage Short Name -->
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">
              Nama Singkat / Label Stepper
            </label>
            <input
              v-model="form.shortName"
              type="text"
              placeholder="Contoh: 5. Evaluasi & EKH"
              class="form-input text-xs w-full h-[38px]"
            />
            <p class="text-[10px] text-[#64748B] mt-1">Versi ringkas untuk tombol gate dan pill navigasi cepat.</p>
          </div>

          <!-- Stage Key -->
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">
              Kode Unik Tahapan (Key) *
            </label>
            <input
              v-model="form.key"
              type="text"
              required
              :disabled="isEdit"
              placeholder="Contoh: EVALUASI_PEMBUKTIAN"
              class="form-input text-xs w-full h-[38px] font-mono uppercase"
              :class="{ 'opacity-60 bg-slate-100 cursor-not-allowed': isEdit }"
            />
            <p class="text-[10px] text-[#64748B] mt-1">
              {{ isEdit ? 'Kode key unik tidak dapat diubah setelah dibuat untuk menjaga konsistensi data tender aktif.' : 'Gunakan huruf besar dan garis bawah (Underscore).' }}
            </p>
          </div>

          <!-- Insert Position (Only for Add Mode) -->
          <div v-if="!isEdit && totalStages > 0">
            <label class="block font-semibold text-[#0F172A] mb-1">
              Posisi Penempatan Tahapan
            </label>
            <select
              v-model="form.insertPosition"
              class="form-select text-xs w-full h-[38px]"
            >
              <option value="end">Paling Akhir (Sebagai Tahap {{ totalStages + 1 }})</option>
              <option value="start">Paling Awal (Sebagai Tahap 1)</option>
            </select>
          </div>

          <!-- Stage Description -->
          <div>
            <label class="block font-semibold text-[#0F172A] mb-1">
              Uraian Prosedur & Petunjuk Regulasi Tahapan *
            </label>
            <textarea
              v-model="form.description"
              required
              rows="3"
              placeholder="Jelaskan aktivitas utama yang dilakukan oleh Pokja dan Peserta Tender pada tahapan ini..."
              class="form-input text-xs w-full p-2.5 leading-relaxed resize-none"
            ></textarea>
          </div>

          <!-- Actions -->
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
              <span>{{ isEdit ? 'Simpan Perubahan' : 'Tambahkan Butir Tahap' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { GitFork, Pencil, X, Check } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  sectorCode: {
    type: String,
    default: 'KONSTRUKSI'
  },
  sectorName: {
    type: String,
    default: 'Konstruksi & Infrastruktur'
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  totalStages: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  key: '',
  name: '',
  shortName: '',
  description: '',
  insertPosition: 'end'
});

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      if (props.isEdit && props.initialData) {
        form.value = {
          key: props.initialData.key || '',
          name: props.initialData.name || '',
          shortName: props.initialData.shortName || '',
          description: props.initialData.description || '',
          insertPosition: 'end'
        };
      } else {
        const nextNum = props.totalStages + 1;
        form.value = {
          key: `TAHAP_${nextNum}`,
          name: `${nextNum}. Tahapan Baru`,
          shortName: `${nextNum}. Tahap Baru`,
          description: '',
          insertPosition: 'end'
        };
      }
    }
  },
  { immediate: true }
);

function handleSubmit() {
  emit('save', {
    ...form.value,
    key: form.value.key.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_')
  });
}
</script>

