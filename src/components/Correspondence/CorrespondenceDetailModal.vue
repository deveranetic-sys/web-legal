<template>
  <div
    v-if="isOpen && item"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <FileText class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-extrabold text-white text-base">Rincian Lengkap Surat</h3>
            <p class="text-xs text-slate-400 font-mono">{{ item.letterNumber || item.id }}</p>
          </div>
        </div>
        <button @click="closeModal" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
      </div>

      <!-- Body Details -->
      <div class="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
        <!-- Badges & Status Banner -->
        <div class="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div class="flex items-center gap-2">
            <span
              :class="isIncoming ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'"
              class="px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1"
            >
              <ArrowDownLeft v-if="isIncoming" class="w-3.5 h-3.5" />
              <ArrowUpRight v-else class="w-3.5 h-3.5" />
              {{ isIncoming ? 'Surat Masuk (Incoming)' : 'Surat Keluar (Outgoing)' }}
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 text-xs font-semibold">
              {{ item.type }}
            </span>
          </div>
          <div>
            <span
              :class="statusBadgeClass"
              class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider"
            >
              {{ item.status }}
            </span>
          </div>
        </div>

        <!-- Perihal & Subjek -->
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Perihal / Pokok Surat</span>
          <h4 class="text-base font-bold text-slate-900 mt-1 leading-snug">{{ item.subject }}</h4>
        </div>

        <!-- Pihak Terlibat Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pihak Pengirim</span>
            <div class="font-bold text-slate-800 mt-0.5">{{ item.sender }}</div>
          </div>
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pihak Tujuan / Penerima</span>
            <div class="font-bold text-slate-800 mt-0.5">{{ item.recipient }}</div>
          </div>
        </div>

        <!-- Metadata & Waktu Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tanggal Surat</span>
            <span class="font-bold text-slate-800 mt-0.5 block">{{ item.date }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">PIC Legal Counsel</span>
            <span class="font-bold text-slate-800 mt-0.5 block">{{ item.pic || 'Legal Counsel' }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Batas Respons / Deadline</span>
            <span class="font-bold text-rose-600 mt-0.5 block">{{ item.deadline || 'Tidak ditentukan' }}</span>
          </div>
        </div>

        <!-- Disposisi / Ringkasan Catatan -->
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Catatan Disposisi & Ringkasan</span>
          <div class="p-3.5 bg-slate-100 rounded-xl text-slate-700 leading-relaxed text-xs">
            {{ item.summary || item.remarks || 'Tercatat dalam Buku Agenda Register Resmi Divisi Legal.' }}
          </div>
        </div>

        <!-- Lampiran Berkas Digital -->
        <div class="pt-2 border-t border-slate-200">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Berkas Lampiran Digital</span>
          <div v-if="hasAttachment" class="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 truncate">
              <Paperclip class="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div class="font-bold text-emerald-900 truncate">{{ attachmentName }}</div>
                <div class="text-[10px] text-emerald-700">{{ item.fileSize || 'Dokumen Resmi' }}</div>
              </div>
            </div>
            <button
              @click="downloadAttachment"
              class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1 shadow-xs transition shrink-0"
            >
              <Download class="w-3.5 h-3.5" />
              <span>Unduh Berkas</span>
            </button>
          </div>
          <div v-else class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-xs italic">
            Tidak ada berkas lampiran digital yang terunggah.
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          @click="copyInfo"
          class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer flex items-center gap-1 transition"
        >
          <Copy class="w-3.5 h-3.5" />
          <span>Salin Info</span>
        </button>
        <div class="flex items-center gap-2">
          <button
            @click="editItem"
            class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1 transition shadow-xs"
          >
            <Edit3 class="w-3.5 h-3.5" />
            <span>Edit Surat</span>
          </button>
          <button
            @click="closeModal"
            class="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { FileText, ArrowDownLeft, ArrowUpRight, Paperclip, Download, Copy, Edit3 } from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const props = defineProps({
  isOpen: Boolean,
  item: Object
});

const emit = defineEmits(['close', 'edit']);

const isIncoming = computed(() => {
  if (!props.item) return false;
  if (props.item.direction) return props.item.direction === 'MASUK';
  const t = (props.item.type || '').toLowerCase();
  return t.includes('incoming') || t.includes('masuk');
});

const statusBadgeClass = computed(() => {
  if (!props.item) return '';
  switch (props.item.status) {
    case 'SENT': return 'bg-emerald-100 text-emerald-800';
    case 'RECEIVED': return 'bg-blue-100 text-blue-800';
    case 'IN_REVIEW': return 'bg-amber-100 text-amber-800';
    case 'REPLIED': return 'bg-indigo-100 text-indigo-800';
    case 'DRAFT': return 'bg-slate-200 text-slate-800';
    default: return 'bg-slate-100 text-slate-700';
  }
});

const hasAttachment = computed(() => {
  if (!props.item) return false;
  return Boolean(props.item.fileName || props.item.fileRef || props.item.documentLink);
});

const attachmentName = computed(() => {
  if (!props.item) return '';
  if (props.item.fileName) return props.item.fileName;
  if (props.item.fileRef) return props.item.fileRef;
  if (props.item.documentLink) {
    const parts = props.item.documentLink.split('/');
    return parts[parts.length - 1] || 'Lampiran.pdf';
  }
  return 'Lampiran.pdf';
});

function closeModal() {
  emit('close');
}

function editItem() {
  emit('edit', props.item);
  closeModal();
}

function downloadAttachment() {
  if (!props.item) return;
  const fileName = attachmentName.value;
  if (props.item.fileDataUrl) {
    const a = document.createElement('a');
    a.href = props.item.fileDataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    const content = [
      '[DOKUMEN KORESPONDENSI RESMI]',
      `Nomor Surat: ${props.item.letterNumber || props.item.id}`,
      `Perihal: ${props.item.subject}`,
      `Pengirim: ${props.item.sender}`,
      `Penerima: ${props.item.recipient}`,
      `Tanggal: ${props.item.date}`,
      `Status: ${props.item.status}`,
      '',
      'Ringkasan:',
      props.item.summary || props.item.remarks || ''
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.pdf$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  legalStore.triggerToast(`Mengunduh berkas lampiran: ${fileName}`, 'success');
}

function copyInfo() {
  if (!props.item) return;
  const info = [
    '[REGISTER SURAT LEGAL]',
    `Nomor: ${props.item.letterNumber || props.item.id}`,
    `Perihal: ${props.item.subject}`,
    `Pengirim: ${props.item.sender}`,
    `Penerima: ${props.item.recipient}`,
    `Tanggal: ${props.item.date}`,
    `Status: ${props.item.status}`
  ].join('\n');
  navigator.clipboard.writeText(info);
  legalStore.triggerToast('Informasi surat disalin ke clipboard!', 'success');
}
</script>
