<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534]">
            Perizinan Berusaha Berbasis Risiko
          </span>
          <span class="text-xs text-slate-500 font-medium">OSS RBA & PB-UMKU</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Perizinan Berusaha & Operasional (Licensing)
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Inventarisasi izin usaha, IUP Ketenagalistrikan/Pertambangan, persetujuan lingkungan AMDAL, dan status masa berlaku.
        </p>
      </div>

      <!-- Action Button -->
      <div class="shrink-0">
        <button
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Izin</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Total Izin Terdaftar</span>
        <div class="text-2xl font-black text-slate-900 mt-1">{{ licenses.length }}</div>
        <div class="text-[11px] text-slate-400 mt-0.5">Holding & Anak Perusahaan</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-emerald-600 font-semibold">Status Aktif & Valid</span>
        <div class="text-2xl font-black text-emerald-700 mt-1">{{ activeCount }}</div>
        <div class="text-[11px] text-emerald-600 mt-0.5">Berlaku Operasional</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-amber-600 font-semibold">Perlu Perpanjangan</span>
        <div class="text-2xl font-black text-amber-600 mt-1">{{ renewalCount }}</div>
        <div class="text-[11px] text-amber-600 mt-0.5">Dalam Proses Pengajuan</div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-500 font-medium">Instansi Penerbit</span>
        <div class="text-2xl font-black text-slate-900 mt-1">4</div>
        <div class="text-[11px] text-slate-400 mt-0.5">ESDM, BKPM, KLHK, Kemenhub</div>
      </div>
    </div>

    <!-- Filter and Search -->
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
      <div class="flex-1 relative">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama izin, nomor izin, atau instansi penerbit..."
          class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div class="w-full md:w-48">
        <select
          v-model="filterStatus"
          class="w-full py-2 px-3 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none bg-white"
        >
          <option value="ALL">Semua Status</option>
          <option value="ACTIVE">Aktif (Valid)</option>
          <option value="RENEWAL_IN_PROGRESS">Perpanjangan</option>
          <option value="EXPIRED">Kedaluwarsa</option>
        </select>
      </div>
    </div>

    <!-- Table of Licenses -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th class="py-3 px-4">Nama Izin & Tipe</th>
              <th class="py-3 px-4">Nomor Izin</th>
              <th class="py-3 px-4">Instansi Penerbit</th>
              <th class="py-3 px-4">Entitas Perseroan</th>
              <th class="py-3 px-4">Masa Berlaku</th>
              <th class="py-3 px-4 text-center">Status</th>
              <th class="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="lic in filteredLicenses" :key="lic.id" class="hover:bg-slate-50">
              <td class="py-3.5 px-4 font-bold text-slate-900">
                <div>{{ lic.licenseName }}</div>
                <span class="text-[11px] font-normal text-slate-500">{{ lic.licenseType }}</span>
              </td>
              <td class="py-3.5 px-4 font-mono text-xs font-semibold text-slate-700">
                {{ lic.licenseNumber }}
              </td>
              <td class="py-3.5 px-4 text-slate-700">{{ lic.authority }}</td>
              <td class="py-3.5 px-4 text-slate-600">{{ lic.company }}</td>
              <td class="py-3.5 px-4 whitespace-nowrap">
                <div class="font-semibold text-slate-800">{{ lic.expiryDate }}</div>
                <div class="text-[10px] text-slate-400">Terbit: {{ lic.issueDate }}</div>
              </td>
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                <span
                  :class="lic.status === 'ACTIVE' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEF3C7] text-[#92400E]'"
                  class="px-2.5 py-0.5 rounded-full text-xs font-bold"
                >
                  {{ lic.status === 'ACTIVE' ? 'Aktif' : 'Perpanjangan' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-right">
                <button
                  @click="selectedLicense = lic"
                  class="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                >
                  <Eye class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Detail License -->
    <div
      v-if="selectedLicense"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="selectedLicense = null"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 class="font-extrabold text-slate-900 text-base">{{ selectedLicense.licenseName }}</h3>
          <button @click="selectedLicense = null" class="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
        </div>
        <div class="space-y-2 text-xs text-slate-700">
          <div><span class="text-slate-400 block">Nomor Izin:</span> <span class="font-mono font-bold">{{ selectedLicense.licenseNumber }}</span></div>
          <div><span class="text-slate-400 block">Instansi Penerbit:</span> <span class="font-bold">{{ selectedLicense.authority }}</span></div>
          <div><span class="text-slate-400 block">Perusahaan:</span> <span class="font-bold">{{ selectedLicense.company }}</span></div>
          <div><span class="text-slate-400 block">Masa Berlaku:</span> <span class="font-bold">{{ selectedLicense.expiryDate }}</span></div>
          <div><span class="text-slate-400 block">Kewajiban Pelaporan:</span> <span class="text-slate-600">{{ selectedLicense.reportingObligation || 'Laporan berkas berkala per semester via OSS RBA.' }}</span></div>
        </div>
        <div class="pt-3 border-t border-slate-100 flex justify-end">
          <button @click="selectedLicense = null" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer">
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Tambah Izin Usaha / Operasional Baru -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="isAddModalOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div class="px-6 py-4 bg-[#1E293B] text-white border-b border-[#1E293B] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Plus class="w-5 h-5 text-emerald-400" />
            <h3 class="font-extrabold text-white text-base">Pendaftaran Izin Berusaha Baru</h3>
          </div>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer transition">✕</button>
        </div>

        <form @submit.prevent="submitNewLicense" class="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Nama Izin / Sertifikat Standar *</label>
            <input
              v-model="newForm.licenseName"
              type="text"
              required
              placeholder="Contoh: Izin Usaha Penyediaan Tenaga Listrik (IUPTLU)"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Tipe Dokumen Izin</label>
              <select
                v-model="newForm.licenseType"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 outline-none"
              >
                <option value="OSS RBA (NIB)">OSS RBA (NIB)</option>
                <option value="PB-UMKU Sektoral">PB-UMKU Sektoral</option>
                <option value="Izin Lingkungan (AMDAL)">Izin Lingkungan (AMDAL)</option>
                <option value="Sertifikat Laik Operasi (SLO)">Sertifikat Laik Operasi (SLO)</option>
                <option value="IUP Operasi Produksi">IUP Operasi Produksi</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Nomor Registrasi Izin *</label>
              <input
                v-model="newForm.licenseNumber"
                type="text"
                required
                placeholder="0220001234567"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-mono"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Instansi Penerbit</label>
              <select
                v-model="newForm.authority"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 outline-none"
              >
                <option value="Kementerian ESDM">Kementerian ESDM</option>
                <option value="Kementerian Investasi / BKPM">Kementerian Investasi / BKPM</option>
                <option value="Kementerian LHK">Kementerian LHK</option>
                <option value="Kementerian Perhubungan">Kementerian Perhubungan</option>
                <option value="Dinas PMPTSP Provinsi">Dinas PMPTSP Provinsi</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Entitas Pemegang Izin</label>
              <select
                v-model="newForm.company"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 outline-none"
              >
                <option value="PT Nusantara Energi">PT Nusantara Energi</option>
                <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings Utama</option>
                <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-800 mb-1">Tanggal Terbit</label>
              <input
                v-model="newForm.issueDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-800 mb-1">Masa Berlaku *</label>
              <input
                v-model="newForm.expiryDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-800 mb-1">Kewajiban Pelaporan & Kepatuhan</label>
            <textarea
              v-model="newForm.reportingObligation"
              rows="2"
              placeholder="Contoh: Laporan berkala per semester dan audit lingkungan berkala..."
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md transition text-xs"
            >
              Simpan Izin
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { Plus, Search, Eye } from 'lucide-vue-next';
import { legalStore } from '../stores/legalStore';

const searchQuery = ref('');
const filterStatus = ref('ALL');
const isAddModalOpen = ref(false);
const selectedLicense = ref(null);

const newForm = reactive({
  licenseName: '',
  licenseType: 'OSS RBA (NIB)',
  licenseNumber: '',
  authority: 'Kementerian ESDM',
  company: 'PT Nusantara Energi',
  issueDate: new Date().toISOString().slice(0, 10),
  expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  status: 'ACTIVE',
  reportingObligation: 'Laporan kepatuhan berkala per semester via portal OSS RBA.'
});

function submitNewLicense() {
  legalStore.addLicense({ ...newForm });
  isAddModalOpen.value = false;
  newForm.licenseName = '';
  newForm.licenseNumber = '';
}

const licenses = computed(() => legalStore.state.licenses);

const activeCount = computed(() => licenses.value.filter(l => l.status === 'ACTIVE').length);
const renewalCount = computed(() => licenses.value.filter(l => l.status === 'RENEWAL_IN_PROGRESS').length);

const filteredLicenses = computed(() => {
  return licenses.value.filter(l => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchSearch = !q || l.licenseName.toLowerCase().includes(q) || l.licenseNumber.toLowerCase().includes(q);
    const matchStatus = filterStatus.value === 'ALL' || l.status === filterStatus.value;
    return matchSearch && matchStatus;
  });
});
</script>
