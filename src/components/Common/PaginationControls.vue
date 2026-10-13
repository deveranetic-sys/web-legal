<template>
  <div
    v-if="totalItems > 0"
    class="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl shadow-xs text-xs text-[#475569]"
  >
    <!-- Left: Data Count Summary -->
    <div class="flex items-center gap-2">
      <span>
        Menampilkan
        <strong class="text-[#0F172A] font-semibold">{{ startIndex + 1 }}</strong>
        –
        <strong class="text-[#0F172A] font-semibold">{{ endIndex }}</strong>
        dari
        <strong class="text-[#0F172A] font-semibold">{{ totalItems }}</strong>
        data
      </span>

      <!-- Page Size Selector -->
      <div class="flex items-center gap-1.5 ml-2 pl-2 border-l border-[#E2E8F0]">
        <label for="page-size-select" class="text-slate-400 text-[11px]">Baris:</label>
        <select
          id="page-size-select"
          :value="pageSize"
          @change="changePageSize($event.target.value)"
          class="bg-slate-50 border border-[#E2E8F0] rounded-lg px-2 py-1 text-xs font-semibold text-[#0F172A] outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
    </div>

    <!-- Right: Pagination Buttons -->
    <div class="flex items-center gap-1">
      <!-- First Page -->
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="px-2 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
        title="Halaman Pertama"
      >
        <ChevronsLeft class="w-3.5 h-3.5" />
      </button>

      <!-- Previous Page -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-2 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1"
        title="Halaman Sebelumnya"
      >
        <ChevronLeft class="w-3.5 h-3.5" />
        <span class="hidden sm:inline text-[11px] font-medium">Sebelumnya</span>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1 mx-1">
        <template v-for="page in visiblePages" :key="page">
          <span
            v-if="page === '...'"
            class="px-1 text-slate-400 select-none"
          >
            …
          </span>
          <button
            v-else
            @click="goToPage(page)"
            :class="[
              page === currentPage
                ? 'bg-[#6366F1] text-white font-bold shadow-xs'
                : 'text-[#0F172A] hover:bg-slate-100 font-medium'
            ]"
            class="w-7 h-7 rounded-lg text-xs flex items-center justify-center transition cursor-pointer"
          >
            {{ page }}
          </button>
        </template>
      </div>

      <!-- Next Page -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="px-2 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1"
        title="Halaman Selanjutnya"
      >
        <span class="hidden sm:inline text-[11px] font-medium">Berikutnya</span>
        <ChevronRight class="w-3.5 h-3.5" />
      </button>

      <!-- Last Page -->
      <button
        @click="goToPage(totalPages)"
        :disabled="currentPage >= totalPages"
        class="px-2 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
        title="Halaman Terakhir"
      >
        <ChevronsRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-vue-next';

const props = defineProps({
  totalItems: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 25, 50]
  }
});

const emit = defineEmits(['update:currentPage', 'update:pageSize']);

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.totalItems / props.pageSize));
});

const startIndex = computed(() => {
  return (props.currentPage - 1) * props.pageSize;
});

const endIndex = computed(() => {
  return Math.min(props.totalItems, startIndex.value + props.pageSize);
});

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = props.currentPage;

  if (total <= 6) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];
  if (current <= 3) {
    pages.push(1, 2, 3, 4, '...', total);
  } else if (current >= total - 2) {
    pages.push(1, '...', total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }

  return pages;
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('update:currentPage', page);
  }
}

function changePageSize(val) {
  const newSize = Number(val);
  emit('update:pageSize', newSize);
  emit('update:currentPage', 1);
}
</script>
