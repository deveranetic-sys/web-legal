<template>
  <div class="space-y-4">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
            Administrasi Surat Menyurat, Somasi & Kuasa
          </span>
          <span class="text-[11px] text-slate-500 font-medium">Buku Register Digital</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Surat Menyurat & Korespondensi Legal
        </h1>
      </div>

      <div class="flex items-center gap-2 shrink-0 flex-nowrap">
        <!-- Sub-tabs Switcher -->
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            @click="activeTab = 'register'"
            :class="activeTab === 'register' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 font-medium'"
            class="px-3 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap"
          >
            Register Surat ({{ correspondence.length }})
          </button>
          <button
            @click="activeTab = 'templates'"
            :class="activeTab === 'templates' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 font-medium'"
            class="px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Template Surat</span>
            <span class="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
              {{ letterTemplates.length }}
            </span>
          </button>
        </div>

        <!-- Tombol Tambah Template Surat (when on templates tab) -->
        <button
          v-if="activeTab === 'templates'"
          id="btn-add-letter-template"
          @click="openAddTemplate"
          :class="[
            'px-3.5 py-2 rounded-xl',
            'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800',
            'text-white font-bold text-xs shadow-sm transition cursor-pointer',
            'flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.98] whitespace-nowrap'
          ]"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Template</span>
        </button>

        <!-- Tombol Catat Surat (when on register tab) -->
        <button
          v-if="activeTab === 'register'"
          id="btn-catat-surat"
          @click="openAddCorrespondence"
          :class="[
            'px-3.5 py-2 rounded-xl',
            'bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm',
            'transition cursor-pointer flex items-center gap-1.5',
            'hover:scale-[1.01] active:scale-[0.98] whitespace-nowrap'
          ]"
        >
          <Send class="w-4 h-4" />
          <span>Catat Surat</span>
        </button>
      </div>
    </div>

    <!-- VIEW 1: Buku Register Surat (Compact & Packed Layout) -->
    <div v-if="activeTab === 'register'" class="space-y-3">
      
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
                @click="openDetailCorrespondence(item)"
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
                      @click="openDetailCorrespondence(item)"
                      class="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="Lihat Detail Surat"
                    >
                      <Eye class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="openEditCorrespondence(item)"
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

    <!-- VIEW 2: Koleksi Template Surat -->
    <div v-else-if="activeTab === 'templates'" class="space-y-4">
      
      <!-- Top Search & Quick Stats -->
      <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div class="flex-1 relative">
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="templateSearch"
            type="text"
            placeholder="Cari template surat somasi, SPK, surat kuasa, klarifikasi..."
            class="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="flex items-center gap-2 text-xs text-slate-500">
          <span class="font-medium">Total: <strong>{{ filteredLetterTemplates.length }}</strong> template surat</span>
        </div>
      </div>

      <!-- Grid Template Surat Cards -->
      <div v-if="filteredLetterTemplates.length === 0" class="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <FileText class="w-6 h-6" />
        </div>
        <h4 class="text-base font-bold text-slate-800">Tidak ada template surat yang cocok</h4>
        <p class="text-xs text-slate-500 max-w-md mx-auto">
          Belum ada template surat yang sesuai dengan kata kunci pencarian Anda. Klik tombol di bawah untuk menambahkan template baru.
        </p>
        <button
          @click="openAddTemplate"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Template</span>
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="tmpl in filteredLetterTemplates"
          :key="tmpl.id"
          class="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow group relative"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {{ tmpl.category }}
              </span>

              <div class="flex items-center gap-2">
                <span v-if="tmpl.language" class="text-[11px] font-medium text-slate-400">
                  {{ tmpl.language }}
                </span>
                <button
                  v-if="isUserAdded(tmpl)"
                  @click="confirmDeleteTemplate(tmpl)"
                  class="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Hapus template ini"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Title & Description -->
            <div>
              <h3 class="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {{ tmpl.title || tmpl.templateName }}
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-3">
                {{ tmpl.description }}
              </p>
            </div>

            <!-- Uploaded File Badge -->
            <div
              v-if="tmpl.fileName"
              class="px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold flex items-center justify-between gap-2"
            >
              <div class="flex items-center gap-1.5 truncate">
                <Paperclip class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span class="truncate">Berkas: {{ tmpl.fileName }}</span>
              </div>
              <span class="text-emerald-700 font-mono text-[10px] shrink-0" v-if="tmpl.fileSize">
                {{ tmpl.fileSize }}
              </span>
            </div>

            <!-- Klausul / Variabel Termasuk -->
            <div v-if="tmpl.clausesIncluded && tmpl.clausesIncluded.length" class="space-y-1 pt-1">
              <span class="text-[10px] font-semibold text-slate-700 block">Klausul & Komponen:</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="clauseName in tmpl.clausesIncluded"
                  :key="clauseName"
                  class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px]"
                >
                  {{ clauseName }}
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-1.5">
              <button
                v-if="tmpl.contentSample"
                @click="openPreview(tmpl)"
                class="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer flex items-center gap-1 transition"
              >
                <Eye class="w-3.5 h-3.5 text-slate-500" />
                <span>Lihat Draf</span>
              </button>

              <button
                @click="openGenerator(tmpl)"
                class="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1 shadow-xs transition"
              >
                <Zap class="w-3.5 h-3.5" />
                <span>Generate Surat</span>
              </button>
            </div>

            <button
              @click="downloadTemplate(tmpl)"
              class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1 transition"
              :title="tmpl.fileName ? 'Unduh berkas asli template' : 'Unduh draf teks'"
            >
              <Download class="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh Berkas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Form Modal (Create & Edit) -->
    <CorrespondenceFormModal
      :is-open="isFormModalOpen"
      :is-edit="isEditMode"
      :initial-data="currentFormData"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />
div>

    <!-- Detail Modal -->
    <CorrespondenceDetailModal
      :is-open="!!selectedCorrDetail"
      :item="selectedCorrDetail"
      @close="selectedCorrDetail = null"
      @edit="openEditCorrespondence"
    />

    <!-- Preview Template Modal -->
    <PreviewTemplateModal
      :is-open="!!previewTmpl"
      :template="previewTmpl"
      @close="previewTmpl = null"
      @generate="openGenerator"
    />

    <!-- Modal Interactive Template Generator -->
    <TemplateGeneratorModal
      v-if="selectedTemplateForGen"
      :template="selectedTemplateForGen"
      @close="selectedTemplateForGen = null"
    />

    <!-- Modal Tambah Template Surat -->
    <AddTemplateModal
      v-if="isAddModalOpen"
      defaultCategory="Template Surat (Korespondensi / Somasi)"
      @close="isAddModalOpen = false"
      @created="handleTemplateCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import {
  Send,
  Plus,
  Search,
  FileText,
  Paperclip,
  Eye,
  Zap,
  Download,
  Copy,
  X,
  Trash2,
  Edit3,
  UploadCloud,
  ArrowDownLeft,
  ArrowUpRight,
  Clock
} from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';
import TemplateGeneratorModal from './TemplateGeneratorModal.vue';
import AddTemplateModal from './AddTemplateModal.vue';
import CorrespondenceFormModal from './Correspondence/CorrespondenceFormModal.vue';
import CorrespondenceDetailModal from './Correspondence/CorrespondenceDetailModal.vue';
import PreviewTemplateModal from './Correspondence/PreviewTemplateModal.vue';

const activeTab = ref('register');
const corrSearch = ref('');
const filterDirection = ref('ALL');
const filterStatus = ref('ALL');
const templateSearch = ref('');
const isAddModalOpen = ref(false);
const previewTmpl = ref(null);
const selectedTemplateForGen = ref(null);
const selectedCorrDetail = ref(null);

const isFormModalOpen = ref(false);
const isEditMode = ref(false);
const currentFormData = ref({});


const correspondence = computed(() => legalStore.state.correspondence || []);
const allTemplates = computed(() => legalStore.state.templates || []);

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

function openAddCorrespondence() {
  isEditMode.value = false;
  currentFormData.value = {};
  isFormModalOpen.value = true;
}

function openEditCorrespondence(item) {
  isEditMode.value = true;
  currentFormData.value = {
    ...item,
    direction: isIncoming(item) ? 'MASUK' : 'KELUAR',
    type: item.type || 'Surat Somasi',
    pic: item.pic || 'Legal Counsel',
    status: item.status || 'SENT'
  };
  isFormModalOpen.value = true;
}

function handleFormSubmit(formData) {
  if (isEditMode.value) {
    legalStore.updateCorrespondence(formData.id, formData);
  } else {
    legalStore.addCorrespondence(formData);
  }
  isFormModalOpen.value = false;
}


function confirmDeleteCorrespondence(item) {
  const num = item.letterNumber || item.id;
  if (confirm(`Apakah Anda yakin ingin menghapus surat register "${num}"?`)) {
    legalStore.deleteCorrespondence(item.id);
  }
}

function openDetailCorrespondence(item) {
  selectedCorrDetail.value = item;
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

function copyLetterInfo(item) {
  const info = [
    '[REGISTER SURAT LEGAL]',
    `Nomor: ${item.letterNumber || item.id}`,
    `Perihal: ${item.subject}`,
    `Pengirim: ${item.sender}`,
    `Penerima: ${item.recipient}`,
    `Tanggal: ${item.date}`,
    `Status: ${item.status}`
  ].join('\n');
  navigator.clipboard.writeText(info);
  legalStore.triggerToast('Informasi surat disalin ke clipboard!', 'success');
}

function formatFileSize(bytes) {
  if (!bytes) return '1.2 MB';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function isLetterTemplate(tmpl) {
  const cat = (tmpl.category || '').toLowerCase();
  const title = (tmpl.title || tmpl.templateName || '').toLowerCase();
  const tags = (tmpl.tags || []).join(' ').toLowerCase();
  return (
    cat.includes('surat') ||
    cat.includes('somasi') ||
    cat.includes('spk') ||
    cat.includes('korespondensi') ||
    cat.includes('dispute') ||
    title.includes('surat') ||
    title.includes('somasi') ||
    title.includes('spk') ||
    tags.includes('surat') ||
    tags.includes('somasi') ||
    tmpl.fileName?.toLowerCase().includes('surat') ||
    tmpl.fileName?.toLowerCase().includes('somasi')
  );
}

function isUserAdded(tmpl) {
  return tmpl.fileName || tmpl.uploadedAt || tmpl.id?.startsWith('TMPL-008') || Number(tmpl.id?.replace('TMPL-', '')) > 7;
}

const letterTemplates = computed(() => {
  return allTemplates.value.filter(isLetterTemplate);
});

const filteredLetterTemplates = computed(() => {
  const q = templateSearch.value.toLowerCase().trim();
  if (!q) return letterTemplates.value;
  return letterTemplates.value.filter(t => {
    const title = (t.title || t.templateName || '').toLowerCase();
    const desc = (t.description || '').toLowerCase();
    const cat = (t.category || '').toLowerCase();
    return title.includes(q) || desc.includes(q) || cat.includes(q);
  });
});

function openAddTemplate() {
  isAddModalOpen.value = true;
}

function openPreview(tmpl) {
  previewTmpl.value = tmpl;
}

function openGenerator(tmpl) {
  selectedTemplateForGen.value = tmpl;
}

function copyText(text) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  legalStore.triggerToast('Teks naskah surat disalin ke clipboard!', 'success');
}

function downloadTemplate(tmpl) {
  const name = tmpl.title || tmpl.templateName || 'Template_Surat';
  if (tmpl.fileDataUrl && tmpl.fileName) {
    const a = document.createElement('a');
    a.href = tmpl.fileDataUrl;
    a.download = tmpl.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    legalStore.triggerToast(`Mengunduh berkas surat: ${tmpl.fileName}`, 'success');
  } else {
    const content = tmpl.contentSample || `${name}\n\n${tmpl.description || ''}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    legalStore.triggerToast(`Mengunduh draf naskah surat: ${name}`, 'success');
  }
}

function confirmDeleteTemplate(tmpl) {
  const title = tmpl.title || tmpl.templateName;
  if (confirm(`Apakah Anda yakin ingin menghapus template "${title}"?`)) {
    legalStore.deleteTemplate(tmpl.id);
  }
}

function handleTemplateCreated() {
  activeTab.value = 'templates';
}
</script>
