<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
      <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <component :is="isEdit ? Pencil : Plus" class="w-5 h-5 text-indigo-400" />
          <h3 class="font-extrabold text-white text-base">
            {{ isEdit ? 'Edit Klausul Standar' : 'Tambah Klausul Standar Baru' }}
          </h3>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-4 text-xs sm:text-sm">
        <div>
          <label class="block font-bold text-slate-800 mb-1">Judul Klausul *</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Contoh: Klausul Arbitrase BANI & Batasan Tanggung Jawab"
            class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Kategori Klausul</label>
            <select
              v-model="form.category"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 outline-none"
            >
              <option value="Proteksi Risiko & Liabilitas">Proteksi Risiko & Liabilitas</option>
              <option value="Penyelesaian Sengketa & Arbitrase">Penyelesaian Sengketa & Arbitrase</option>
              <option value="Standar Kompensasi & Penalti">Standar Kompensasi & Penalti</option>
              <option value="Kerahasiaan & Non-Disclosure">Kerahasiaan & Non-Disclosure</option>
              <option value="Keadaan Memaksa / Force Majeure">Keadaan Memaksa / Force Majeure</option>
              <option value="Hukum Yang Berlaku & Yurisdiksi">Hukum Yang Berlaku & Yurisdiksi</option>
              <option value="Pengakhiran & Terminasi Kontrak">Pengakhiran & Terminasi Kontrak</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-800 mb-1">Model Referensi / Standar</label>
            <select
              v-model="form.standardModel"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 outline-none"
            >
              <option value="Standar Korporasi">Standar Korporasi PT Nusantara</option>
              <option value="BANI Arbitrase">Model BANI Arbitrase</option>
              <option value="FIDIC Silver/Yellow Book">FIDIC Silver/Yellow Book</option>
              <option value="ICC Model Contract">ICC International Model</option>
              <option value="Standard PPA PLN">Standard PPA PLN</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-800 mb-1">Teks / Rumusan Baku Klausul *</label>
          <textarea
            v-model="form.content"
            required
            rows="4"
            placeholder="Tuliskan rumusan lengkap pasal atau klausul baku..."
            class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-mono text-xs"
          ></textarea>
        </div>

        <div>
          <label class="block font-bold text-slate-800 mb-1">Catatan / Panduan Penggunaan Legal</label>
          <textarea
            v-model="form.explanation"
            rows="2"
            placeholder="Jelaskan kapan klausul ini wajib disisipkan dan batasan negosiasi..."
            class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 resize-none"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer transition text-xs"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-md transition text-xs"
          >
            {{ isEdit ? 'Simpan Perubahan' : 'Simpan Klausul' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Plus, Pencil } from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close']);

const form = ref({
  title: '',
  category: 'Proteksi Risiko & Liabilitas',
  standardModel: 'Standar Korporasi',
  content: '',
  explanation: ''
});

onMounted(() => {
  if (props.isEdit && props.initialData) {
    form.value = {
      title: props.initialData.title || '',
      category: props.initialData.category || 'Proteksi Risiko & Liabilitas',
      standardModel: props.initialData.standardModel || 'Standar Korporasi',
      content: props.initialData.content || '',
      explanation: props.initialData.explanation || props.initialData.description || ''
    };
  }
});

function submitForm() {
  if (props.isEdit && props.initialData.id) {
    legalStore.updateClause(props.initialData.id, {
      title: form.value.title,
      category: form.value.category,
      standardModel: form.value.standardModel,
      content: form.value.content,
      description: form.value.explanation,
      explanation: form.value.explanation
    });
    legalStore.triggerToast('Klausul berhasil diperbarui!', 'success');
  } else {
    legalStore.addClause({
      title: form.value.title,
      category: form.value.category,
      standardModel: form.value.standardModel,
      content: form.value.content,
      explanation: form.value.explanation
    });
    legalStore.triggerToast('Klausul baru berhasil ditambahkan!', 'success');
  }
  emit('close');
}
</script>
