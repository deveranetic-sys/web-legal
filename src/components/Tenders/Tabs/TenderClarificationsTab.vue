<template>
  <div class="p-6 space-y-5 animate-in fade-in duration-150">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
      <div>
        <h3 class="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
          <HelpCircle class="w-5 h-5 text-[#6366F1]" />
          <span>Log Aanwijzing & Berita Acara Pemberian Penjelasan (BAPP)</span>
        </h3>
        <p class="text-xs text-[#475569] mt-0.5">
          Daftar pertanyaan teknis dan komersial yang diajukan ke Pokja serta dampaknya terhadap penawaran.
        </p>
      </div>

      <button
        @click="$emit('open-add-clarification-modal')"
        class="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
      >
        <Plus class="w-4 h-4" />
        <span>Tambah Pertanyaan Aanwijzing</span>
      </button>
    </div>

    <!-- Clarifications Table -->
    <div v-if="(tender.clarifications || []).length > 0" class="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-xs">
      <table class="w-full text-left text-xs">
        <thead class="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] uppercase font-bold text-[10px]">
          <tr>
            <th class="py-3 px-4">No & Pertanyaan Diajukan</th>
            <th class="py-3 px-4">Kategori & Dampak</th>
            <th class="py-3 px-4">Jawaban Resmi Panitia (Pokja)</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4 text-right">Tindakan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E2E8F0]">
          <tr
            v-for="c in tender.clarifications"
            :key="c.id"
            class="hover:bg-[#F8FAFC] transition-colors"
          >
            <td class="py-3 px-4 max-w-sm">
              <div class="flex items-center gap-2">
                <span class="font-mono text-[10px] font-bold text-[#4338CA] bg-[#EEF2FF] px-1.5 py-0.5 rounded">
                  {{ c.id }}
                </span>
                <span class="text-[11px] text-[#475569]">{{ c.date }}</span>
              </div>
              <div class="font-bold text-[#0F172A] mt-1">{{ c.query }}</div>
              <div class="text-[10px] text-[#475569] mt-0.5">Penanya: {{ c.askedBy }}</div>
            </td>

            <td class="py-3 px-4 whitespace-nowrap">
              <div class="font-semibold text-[#0F172A]">{{ c.category }}</div>
              <div class="text-[11px] text-[#475569] mt-0.5">Dampak: {{ c.impact }}</div>
            </td>

            <td class="py-3 px-4 max-w-md">
              <div v-if="c.answer" class="text-xs text-[#0F172A] leading-relaxed">
                {{ c.answer }}
                <div v-if="c.effect" class="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  Efek: {{ c.effect }}
                </div>
              </div>
              <div v-else class="text-xs text-amber-700 italic">
                Menunggu jawaban pada Berita Acara Pemberian Penjelasan (BAPP)
              </div>
            </td>

            <td class="py-3 px-4 whitespace-nowrap">
              <span
                :class="c.status === 'DIJAWAB' ? 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]' : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'"
                class="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
              >
                {{ c.status === 'DIJAWAB' ? 'DIJAWAB POKJA' : 'MENUNGGU POKJA' }}
              </span>
            </td>

            <td class="py-3 px-4 text-right whitespace-nowrap">
              <button
                @click="$emit('open-answer-modal', c)"
                class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Catat Jawaban
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="p-8 text-center border border-dashed border-[#E2E8F0] rounded-2xl bg-white text-xs text-[#475569]">
      Belum ada pertanyaan aanwijzing yang dicatatkan untuk paket lelang ini.
    </div>
  </div>
</template>

<script setup>
import { HelpCircle, Plus } from 'lucide-vue-next';

const props = defineProps({
  tender: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['open-add-clarification-modal', 'open-answer-modal']);
</script>
