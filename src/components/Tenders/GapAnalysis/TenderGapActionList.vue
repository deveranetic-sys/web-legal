<template>
  <div class="space-y-4">
    <!-- Empty State -->
    <div v-if="items.length === 0" class="bg-white rounded-2xl border border-[#BBF7D0] p-8 text-center space-y-3">
      <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 class="w-7 h-7" />
      </div>
      <h3 class="text-base font-bold text-[#0F172A]">
        Luar Biasa! Tidak Ada Dokumen Kurang Berdasarkan Filter Saat Ini
      </h3>
      <p class="text-xs text-[#475569] max-w-md mx-auto">
        Seluruh berkas persyaratan tender sudah terpenuhi dan valid, atau sesuaikan filter pencarian untuk melihat data lelang lainnya.
      </p>
    </div>

    <!-- Items List -->
    <div
      v-for="item in items"
      :key="`${item.tenderId}-${item.docId}`"
      class="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:border-[#C7D2FE] transition-all p-4 space-y-3"
    >
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <!-- Document and Tender Info -->
        <div class="space-y-1.5 flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Tender Badge -->
            <span class="font-mono text-xs font-bold text-[#0F172A] bg-blue-50 text-[#4338CA] px-2.5 py-0.5 rounded-md border border-[#C7D2FE]">
              {{ item.tenderId }}
            </span>
            <span class="text-xs font-bold text-[#0F172A]">
              {{ item.tenderTitle }}
            </span>
            <span class="text-xs text-[#475569] font-mono">
              ({{ item.tenderNumber }})
            </span>
            <span class="text-xs text-[#475569]">
              • {{ item.company }}
            </span>
          </div>

          <!-- Doc Name and Urgency Badges -->
          <div class="flex items-center gap-2 flex-wrap pt-1">
            <span
              v-if="item.status === 'KURANG'"
              class="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]"
            >
              <AlertCircle class="w-3 h-3 text-rose-600" />
              <span>KURANG</span>
            </span>
            <span
              v-else-if="item.status === 'KEDALUWARSA'"
              class="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200"
            >
              <Clock class="w-3 h-3 text-orange-600" />
              <span>KEDALUWARSA</span>
            </span>

            <span
              v-if="item.isMandatory"
              class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100/70 text-rose-800 border border-[#FECDD3]"
            >
              Wajib Gugur
            </span>

            <span class="text-xs font-bold text-[#0F172A]">
              {{ item.docName }}
            </span>
          </div>

          <!-- Panitia & Category -->
          <div class="text-xs text-[#475569] flex items-center gap-3 flex-wrap">
            <span>Panitia: <strong class="text-[#0F172A]">{{ item.organizer }}</strong></span>
            <span>•</span>
            <span>Kategori: <strong class="text-[#0F172A]">{{ item.category }}</strong></span>
            <span>•</span>
            <span>Batas Waktu: <strong class="text-rose-600">{{ item.deadline }} ({{ calculateDaysRemaining(item.deadline) }} hari lagi)</strong></span>
          </div>

          <!-- Notes or Bottleneck Explanation -->
          <div v-if="item.notes" class="text-xs text-[#0F172A] bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
            <FileWarning class="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div class="flex-1">
              <span class="font-semibold text-[#0F172A]">Catatan Kendala:</span> {{ item.notes }}
            </div>
            <button
              @click="$emit('edit-notes', item)"
              class="text-[#6366F1] hover:text-[#0F172A] text-xs font-medium cursor-pointer"
              title="Perbarui catatan"
            >
              Edit
            </button>
          </div>
        </div>

        <!-- Action Buttons for this item -->
        <div class="flex md:flex-col items-center md:items-end gap-2 shrink-0">
          <!-- Quick Link from Vault -->
          <button
            @click="$emit('open-link', item)"
            class="px-3 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs focus:ring-3 focus:ring-[#C7D2FE] border border-[#C7D2FE] text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            title="Tautkan dokumen dari Bank Dokumen Kualifikasi Master"
          >
            <Link2 class="w-3.5 h-3.5" />
            <span>Tautkan dari Bank Dokumen</span>
          </button>

          <!-- Mark Fulfilled Manually -->
          <button
            @click="$emit('fulfill', item)"
            class="px-3 py-1.5 bg-emerald-50 hover:bg-[#DCFCE7] text-[#166534] border border-emerald-300 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            title="Tandai berkas telah diterima dan terpenuhi"
          >
            <Check class="w-3.5 h-3.5" />
            <span>Tandai Terpenuhi</span>
          </button>

          <button
            @click="$emit('edit-notes', item)"
            class="px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <Edit3 class="w-3.5 h-3.5 text-[#475569]" />
            <span>Catatan Kendala</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  FileWarning,
  Link2,
  Check,
  Edit3
} from 'lucide-vue-next';
import { calculateDaysRemaining } from '../../../stores/legalStore';

defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

defineEmits(['open-link', 'fulfill', 'edit-notes']);
</script>
