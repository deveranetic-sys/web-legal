<template>
  <div class="p-6 space-y-5 animate-in fade-in duration-150">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
      <div class="space-y-1">
        <h3 class="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <FileCheck2 class="w-5 h-5 text-[#6366F1]" />
          <span>Audit Dokumen Persyaratan & Kelengkapan Berkas</span>
        </h3>
        <p class="text-xs text-[#475569]">
          Periksa status pemenuhan dokumen kualifikasi legalitas, teknis, dan finansial untuk paket <strong class="text-[#0F172A]">{{ tender.title }}</strong>.
        </p>
      </div>

      <!-- Quick Action & Add Button -->
      <div class="flex items-center gap-2 flex-wrap">
        <button
          @click="isAddDocModalOpen = true"
          class="px-3.5 py-2 text-xs font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Tambah Syarat Dokumen</span>
        </button>

        <button
          @click="openVault"
          class="px-3.5 py-2 text-xs font-bold text-[#0F172A] bg-white border border-[#E2E8F0] hover:border-[#C7D2FE] rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Archive class="w-3.5 h-3.5 text-[#6366F1]" />
          <span>Buka Bank Dokumen Master</span>
        </button>
      </div>
    </div>

    <!-- Readiness Bar & Sub-Filters -->
    <div class="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4 flex-wrap flex-1">
        <!-- Percentage Ring / Bar -->
        <div class="flex items-center gap-3">
          <div class="w-36 bg-slate-200 h-3 rounded-full overflow-hidden">
            <div
              :class="completenessColor"
              class="h-full rounded-full transition-all duration-500"
              :style="{ width: completeness + '%' }"
            ></div>
          </div>
          <span class="font-extrabold text-[#0F172A] text-sm font-mono">
            {{ completeness }}% Kesiapan
          </span>
        </div>

        <div class="flex items-center gap-2 text-xs">
          <span class="inline-flex items-center gap-1 text-[#166534] bg-[#DCFCE7] px-2.5 py-1 rounded-lg font-semibold border border-[#BBF7D0]">
            <CheckCircle2 class="w-3.5 h-3.5 text-[#166534]" />
            <span>{{ fulfilledCount }} Terpenuhi</span>
          </span>

          <span
            v-if="missingCount > 0"
            class="inline-flex items-center gap-1 text-[#9F1239] bg-[#FFE4E6] px-2.5 py-1 rounded-lg font-bold border border-[#FECDD3]"
          >
            <XCircle class="w-3.5 h-3.5 text-[#9F1239]" />
            <span>{{ missingCount }} Dokumen Kurang</span>
          </span>
        </div>
      </div>

      <!-- Filter Kategori Dokumen -->
      <div class="flex items-center gap-2 text-xs">
        <span class="text-[#475569]">Filter:</span>
        <select
          v-model="docSubFilter"
          class="py-1 px-2.5 text-xs font-medium border border-[#E2E8F0] rounded-lg bg-white text-[#0F172A] outline-none"
        >
          <option value="ALL">Semua Berkas ({{ tender.documents?.length || 0 }})</option>
          <option value="TERPENUHI">Terpenuhi Saja</option>
          <option value="KURANG">Hanya Yang Kurang / Gap</option>
        </select>
      </div>
    </div>

    <!-- Documents Table -->
    <div class="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-xs">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] uppercase font-bold text-[10px]">
          <tr>
            <th class="py-3 px-4">Nama Dokumen Persyaratan</th>
            <th class="py-3 px-4">Kategori Berkas</th>
            <th class="py-3 px-4">Lampiran Berkas (File)</th>
            <th class="py-3 px-4">Masa Berlaku</th>
            <th class="py-3 px-4">Status Kesiapan</th>
            <th class="py-3 px-4 text-right">Tindakan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E2E8F0]">
          <tr
            v-for="doc in filteredDocs"
            :key="doc.id"
            :class="getDocRowBorderClass(doc.status)"
            class="hover:bg-[#F8FAFC] transition-colors"
          >
            <!-- Doc Name & Notes -->
            <td class="py-3 px-4">
              <div class="font-bold text-[#0F172A]">{{ doc.name }}</div>
              <div v-if="doc.notes" class="text-[11px] text-[#475569] mt-0.5">
                {{ doc.notes }}
              </div>
            </td>

            <!-- Category -->
            <td class="py-3 px-4 text-[#475569] whitespace-nowrap">
              {{ doc.category }}
            </td>

            <!-- Attached File -->
            <td class="py-3 px-4">
              <div v-if="doc.fileRef" class="flex items-center gap-1.5 font-mono text-[11px] text-[#4338CA]">
                <Paperclip class="w-3.5 h-3.5 text-[#6366F1]" />
                <span class="truncate max-w-[180px]" :title="doc.fileRef">{{ doc.fileRef }}</span>
              </div>
              <div v-else class="text-[11px] text-slate-400 italic">
                Belum dilampirkan
              </div>
            </td>

            <!-- Expiry -->
            <td class="py-3 px-4 whitespace-nowrap text-[#475569]">
              {{ doc.expiryDate || 'Seumur Hidup / Tidak Ada' }}
            </td>

            <!-- Status Badge -->
            <td class="py-3 px-4 whitespace-nowrap">
              <span
                :class="getDocStatusBadgeClass(doc.status)"
                class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              >
                {{ getDocStatusLabel(doc.status) }}
              </span>
            </td>

            <!-- Actions -->
            <td class="py-3 px-4 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-1.5">
                <!-- Direct File Attachment Button -->
                <button
                  @click="triggerDirectDocUpload(doc)"
                  class="p-1.5 text-slate-500 hover:text-[#4338CA] hover:bg-[#EEF2FF] rounded-lg transition cursor-pointer"
                  title="Unggah berkas langsung dari komputer"
                >
                  <UploadCloud class="w-4 h-4" />
                </button>

                <!-- Toggle Status Button -->
                <button
                  @click="setDocStatus(doc.id, doc.status === 'TERPENUHI' ? 'KURANG' : 'TERPENUHI')"
                  :class="doc.status === 'TERPENUHI' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'"
                  class="p-1.5 rounded-lg transition cursor-pointer"
                  :title="doc.status === 'TERPENUHI' ? 'Ubah status ke Kurang' : 'Tandai dokumen Terpenuhi'"
                >
                  <Check v-if="doc.status !== 'TERPENUHI'" class="w-4 h-4" />
                  <X v-else class="w-4 h-4" />
                </button>

                <!-- Edit Notes -->
                <button
                  @click="promptEditDocNotes(doc)"
                  class="p-1.5 text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  title="Edit catatan berkas"
                >
                  <Edit3 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals & Inputs -->
    <AddDocumentModal
      :is-open="isAddDocModalOpen"
      @close="isAddDocModalOpen = false"
      @submit="submitNewDocRequirement"
    />

    <input
      ref="directDocFileInputRef"
      type="file"
      class="hidden"
      @change="onDirectDocFilePicked"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  FileCheck2, Plus, Archive, CheckCircle2, XCircle, Paperclip,
  UploadCloud, Check, X, Edit3
} from 'lucide-vue-next';
import { legalStore } from '../../../stores/legalStore';
import AddDocumentModal from '../AddDocumentModal.vue';

const props = defineProps({
  tender: {
    type: Object,
    required: true
  }
});

const docSubFilter = ref('ALL');
const isAddDocModalOpen = ref(false);
const directDocFileInputRef = ref(null);
const directUploadTargetDoc = ref(null);

const completeness = computed(() => {
  const t = props.tender;
  if (!t.documents || t.documents.length === 0) return 0;
  const fulfilled = t.documents.filter(d => d.status === 'TERPENUHI').length;
  return Math.round((fulfilled / t.documents.length) * 100);
});

const completenessColor = computed(() => {
  const pct = completeness.value;
  if (pct === 100) return 'bg-emerald-500';
  if (pct >= 75) return 'bg-[#6366F1]';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
});

const fulfilledCount = computed(() => {
  return props.tender.documents?.filter(d => d.status === 'TERPENUHI').length || 0;
});

const missingCount = computed(() => {
  return props.tender.documents?.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA').length || 0;
});

const filteredDocs = computed(() => {
  const docs = props.tender.documents;
  if (!docs) return [];
  if (docSubFilter.value === 'ALL') return docs;
  if (docSubFilter.value === 'TERPENUHI') return docs.filter(d => d.status === 'TERPENUHI');
  if (docSubFilter.value === 'KURANG') return docs.filter(d => d.status === 'KURANG' || d.status === 'KEDALUWARSA' || d.status === 'DALAM_PROSES');
  return docs;
});

function getDocRowBorderClass(status) {
  switch (status) {
    case 'KURANG': return 'border-rose-100 bg-rose-50/20';
    case 'DALAM_PROSES': return 'border-amber-100 bg-amber-50/20';
    default: return 'border-[#E2E8F0]';
  }
}

function getDocStatusBadgeClass(status) {
  switch (status) {
    case 'TERPENUHI': return 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]';
    case 'KURANG': return 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]';
    case 'DALAM_PROSES': return 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]';
    default: return 'bg-slate-100 text-slate-800';
  }
}

function getDocStatusLabel(status) {
  switch (status) {
    case 'TERPENUHI': return 'Terpenuhi (Valid)';
    case 'KURANG': return 'Kurang (Belum Ada)';
    case 'DALAM_PROSES': return 'Dalam Proses Pengurusan';
    case 'KEDALUWARSA': return 'Kedaluwarsa (Perlu Update)';
    default: return status;
  }
}

function openVault() {
  legalStore.setTenderTab('vault');
}

function submitNewDocRequirement(formData) {
  legalStore.addTenderDocument(props.tender.id, formData);
  isAddDocModalOpen.value = false;
}

function setDocStatus(docId, status) {
  legalStore.toggleTenderDocStatus(props.tender.id, docId, status);
}

function promptEditDocNotes(doc) {
  const currentNotes = doc.notes || '';
  const newNotes = window.prompt('Perbarui catatan untuk dokumen "' + doc.name + '":', currentNotes);
  if (newNotes !== null) {
    legalStore.updateTenderDocNotes(props.tender.id, doc.id, newNotes);
  }
}

function triggerDirectDocUpload(doc) {
  directUploadTargetDoc.value = { tenderId: props.tender.id, docId: doc.id, docName: doc.name };
  if (directDocFileInputRef.value) {
    directDocFileInputRef.value.value = '';
    directDocFileInputRef.value.click();
  }
}

function onDirectDocFilePicked(e) {
  const file = e.target.files?.[0];
  if (!file || !directUploadTargetDoc.value) return;
  const fileName = file.name;
  legalStore.attachTenderDocumentFile(
    directUploadTargetDoc.value.tenderId,
    directUploadTargetDoc.value.docId,
    fileName
  );
  legalStore.triggerToast(`File ${fileName} berhasil diunggah ke ${directUploadTargetDoc.value.docName}`, 'success');
  directUploadTargetDoc.value = null;
}
</script>
