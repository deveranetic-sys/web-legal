<template>
  <div class="space-y-3">
    <!-- Stats Summary Cards (Compact) -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Register</div>
          <div class="text-xl font-black text-slate-900 mt-0.5">{{ correspondence.length }}</div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
          <FileText class="w-4 h-4" />
        </div>
      </div>

      <div class="bg-white p-3 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-2xs flex items-center justify-between">
        <div>
          <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Surat Masuk</div>
          <div class="text-xl font-black text-emerald-800 mt-0.5">{{ incomingCount }}</div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <ArrowDownLeft class="w-4 h-4" />
        </div>
      </div>

      <div class="bg-white p-3 rounded-xl border border-blue-100 bg-blue-50/20 shadow-2xs flex items-center justify-between">
        <div>
          <div class="text-[10px] font-bold uppercase tracking-wider text-blue-600">Surat Keluar</div>
          <div class="text-xl font-black text-blue-800 mt-0.5">{{ outgoingCount }}</div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
          <ArrowUpRight class="w-4 h-4" />
        </div>
      </div>

      <div class="bg-white p-3 rounded-xl border border-amber-100 bg-amber-50/20 shadow-2xs flex items-center justify-between">
        <div>
          <div class="text-[10px] font-bold uppercase tracking-wider text-amber-600">Dalam Review</div>
          <div class="text-xl font-black text-amber-800 mt-0.5">{{ inReviewCount }}</div>
        </div>
        <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
          <Clock class="w-4 h-4" />
        </div>
      </div>
    </div>

    <!-- Filter and Search Bar (Compact) -->
    <div class="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
      <div class="flex-1 relative">
        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="corrSearch"
          type="text"
          placeholder="Cari nomor surat, perihal, pihak terkait, atau lampiran..."
          class="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <select
          v-model="filterDirection"
          class="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 outline-none font-semibold"
        >
          <option value="ALL">Semua Arah</option>
          <option value="MASUK">Surat Masuk</option>
          <option value="KELUAR">Surat Keluar</option>
        </select>

        <select
          v-model="filterStatus"
          class="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 outline-none font-semibold"
        >
          <option value="ALL">Semua Status</option>
          <option value="SENT">SENT</option>
          <option value="RECEIVED">RECEIVED</option>
          <option value="IN_REVIEW">IN REVIEW</option>
          <option value="REPLIED">REPLIED</option>
          <option value="DRAFT">DRAFT</option>
        </select>
      </div>
    </div>

    <!-- Compact Packed Correspondence Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
            <tr>
              <th class="py-2.5 px-3">Nomor & Arah</th>
              <th class="py-2.5 px-3">Tanggal & Jenis</th>
              <th class="py-2.5 px-3">Perihal Surat</th>
              <th class="py-2.5 px-3">Pihak Terkait</th>
              <th class="py-2.5 px-3 text-center">Status & Lampiran</th>
              <th class="py-2.5 px-3 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="filteredCorrespondence.length === 0">
              <td colspan="6" class="py-8 text-center text-slate-400">
                <FileText class="w-6 h-6 mx-auto text-slate-300 mb-1" />
                <p class="font-medium text-slate-600 text-xs">Tidak ada data korespondensi yang sesuai.</p>
              </td>
            </tr>
            <tr
              v-for="item in filteredCorrespondence"
              :key="item.id"
              class="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
              @click="$emit('select-detail', item)"
            >
              <!-- 1. Nomor & Arah -->
              <td class="py-2.5 px-3 whitespace-nowrap">
                <div class="font-mono text-xs font-bold text-indigo-700 group-hover:text-indigo-900">
                  {{ item.letterNumber || item.id }}
                </div>
                <div class="mt-0.5">
                  <span
                    :class="isIncoming(item) ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'"
                    class="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wide inline-flex items-center gap-0.5"
                  >
                    <ArrowDownLeft v-if="isIncoming(item)" class="w-2.5 h-2.5" />
                    <ArrowUpRight v-else class="w-2.5 h-2.5" />
                    {{ isIncoming(item) ? 'Masuk' : 'Keluar' }}
                  </span>
                </div>
              </td>

              <!-- 2. Tanggal & Jenis -->
              <td class="py-2.5 px-3 whitespace-nowrap">
                <div class="text-slate-800 font-semibold">{{ item.date }}</div>
                <div class="mt-0.5">
                  <span
                    :class="item.type && item.type.toLowerCase().includes('somasi') ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'"
                    class="px-1.5 py-0.2 rounded text-[10px] font-medium"
                  >
                    {{ item.type }}
                  </span>
                </div>
              </td>

              <!-- 3. Perihal Surat (Clean & Concise) -->
              <td class="py-2.5 px-3 min-w-[200px] max-w-md">
                <div class="font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-indigo-700 transition-colors">
                  {{ item.subject }}
                </div>
                <div class="text-[11px] text-slate-400 mt-0.5 truncate flex items-center gap-1.5">
                  <span>PIC: {{ item.pic || 'Legal Counsel' }}</span>
                  <span v-if="item.deadline" class="text-rose-600 font-semibold">· Batas: {{ item.deadline }}</span>
                </div>
              </td>

              <!-- 4. Pihak Terkait (Compact Sender -> Recipient) -->
              <td class="py-2.5 px-3 whitespace-nowrap">
                <div class="text-[11px] text-slate-700 truncate max-w-[200px]">
                  <span class="text-slate-400 font-medium">Dari:</span> {{ item.sender }}
                </div>
                <div class="text-[11px] text-slate-700 truncate max-w-[200px] mt-0.5">
                  <span class="text-slate-400 font-medium">Ke:</span> {{ item.recipient }}
                </div>
              </td>

              <!-- 5. Status & Lampiran -->
              <td class="py-2.5 px-3 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-1.5">
                  <span
                    :class="getStatusBadgeClass(item.status)"
                    class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase"
                  >
                    {{ item.status }}
                  </span>

                  <button
                    v-if="hasAttachment(item)"
                    @click.stop="downloadAttachment(item)"
                    class="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer"
                    :title="'Unduh lampiran: ' + getAttachmentName(item)"
                  >
                    <Paperclip class="w-3 h-3" />
                  </button>
                </div>
              </td>

              <!-- 6. Aksi (Stop propagation for buttons) -->
              <td class="py-2.5 px-3 text-center whitespace-nowrap" @click.stop>
                <div class="flex items-center justify-center gap-1">
                  <button
                    @click="$emit('select-detail', item)"
                    class="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    title="Lihat Detail Surat"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="$emit('edit-item', item)"
                    class="p-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition cursor-pointer"
                    title="Edit Surat"
                  >
                    <Edit3 class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="confirmDeleteCorrespondence(item)"
                    class="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                    title="Hapus Surat"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Search,
  FileText,
  Paperclip,
  Eye,
  Trash2,
  Edit3,
  ArrowDownLeft,
  ArrowUpRight,
  Clock
} from 'lucide-vue-next';
import { legalStore } from '../../stores/legalStore';

const emit = defineEmits(['select-detail', 'edit-item']);

const corrSearch = ref('');
const filterDirection = ref('ALL');
const filterStatus = ref('ALL');

const correspondence = computed(() => legalStore.state.correspondence || []);

const incomingCount = computed(() => {
  return correspondence.value.filter(isIncoming).length;
});

const outgoingCount = computed(() => {
  return correspondence.value.filter(c => !isIncoming(c)).length;
});

const inReviewCount = computed(() => {
  return correspondence.value.filter(c => c.status === 'IN_REVIEW' || c.status === 'DRAFT').length;
});

function isIncoming(item) {
  if (item.direction) return item.direction === 'MASUK';
  const t = (item.type || '').toLowerCase();
  return t.includes('incoming') || t.includes('masuk');
}

function hasAttachment(item) {
  return Boolean(item.fileName || item.fileRef || item.documentLink);
}

function getAttachmentName(item) {
  if (item.fileName) return item.fileName;
  if (item.fileRef) return item.fileRef;
  if (item.documentLink) {
    const parts = item.documentLink.split('/');
    return parts[parts.length - 1] || 'Lampiran.pdf';
  }
  return 'Lampiran.pdf';
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'SENT':
      return 'bg-emerald-100 text-emerald-800';
    case 'RECEIVED':
      return 'bg-blue-100 text-blue-800';
    case 'IN_REVIEW':
      return 'bg-amber-100 text-amber-800';
    case 'REPLIED':
      return 'bg-indigo-100 text-indigo-800';
    case 'DRAFT':
      return 'bg-slate-200 text-slate-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

const filteredCorrespondence = computed(() => {
  let list = correspondence.value;

  if (filterDirection.value !== 'ALL') {
    if (filterDirection.value === 'MASUK') {
      list = list.filter(isIncoming);
    } else {
      list = list.filter(c => !isIncoming(c));
    }
  }

  if (filterStatus.value !== 'ALL') {
    list = list.filter(c => c.status === filterStatus.value);
  }

  const q = corrSearch.value.toLowerCase().trim();
  if (q) {
    list = list.filter(c => {
      const num = (c.letterNumber || c.id || '').toLowerCase();
      const subj = (c.subject || '').toLowerCase();
      const send = (c.sender || '').toLowerCase();
      const rec = (c.recipient || '').toLowerCase();
      const sum = (c.summary || c.remarks || '').toLowerCase();
      const fn = (c.fileName || c.fileRef || '').toLowerCase();
      return num.includes(q) || subj.includes(q) || send.includes(q) || rec.includes(q) || sum.includes(q) || fn.includes(q);
    });
  }

  return list;
});

async function confirmDeleteCorrespondence(item) {
  const num = item.letterNumber || item.id;
  const confirmed = await legalStore.confirm({
    title: 'Hapus Surat Register?',
    message: `Apakah Anda yakin ingin menghapus surat register "${num}" (${item.subject})?`,
    confirmText: 'Ya, Hapus Surat',
    cancelText: 'Batal',
    variant: 'danger'
  });
  if (confirmed) {
    legalStore.deleteCorrespondence(item.id);
  }
}

function downloadAttachment(item) {
  const fileName = getAttachmentName(item);
  if (item.fileDataUrl) {
    const a = document.createElement('a');
    a.href = item.fileDataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    const content = [
      '[DOKUMEN KORESPONDENSI RESMI]',
      `Nomor Surat: ${item.letterNumber || item.id}`,
      `Perihal: ${item.subject}`,
      `Pengirim: ${item.sender}`,
      `Penerima: ${item.recipient}`,
      `Tanggal: ${item.date}`,
      `Status: ${item.status}`,
      '',
      'Ringkasan:',
      item.summary || item.remarks || ''
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
</script>
