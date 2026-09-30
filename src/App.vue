<template>
  <div class="h-screen w-screen overflow-hidden flex bg-[#F9FAFB] font-sans text-[#0F172A] selection:bg-[#EEF2FF] selection:text-[#4338CA]">
    
    <!-- Authentic Left Sidebar (All 5 groups & 16 modules) -->
    <AppSidebar />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden lg:pl-64">
      
      <!-- Top Header -->
      <AppHeader />

      <!-- Scrollable Module View Body -->
      <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="max-w-7xl mx-auto">
          
          <!-- Transition views -->
          <DashboardView v-if="legalStore.state.activeModule === 'dashboard'" />
          <RequestsView v-else-if="legalStore.state.activeModule === 'requests'" />
          <ContractsView v-else-if="legalStore.state.activeModule === 'contracts'" />
          <TendersView v-else-if="legalStore.state.activeModule === 'tenders'" />
          <CorporateView v-else-if="legalStore.state.activeModule === 'corporate'" />
          <LicensingView v-else-if="legalStore.state.activeModule === 'licensing'" />
          <ComplianceView v-else-if="legalStore.state.activeModule === 'compliance'" />
          <DisputesView v-else-if="legalStore.state.activeModule === 'disputes'" />
          <LDDView v-else-if="legalStore.state.activeModule === 'ldd'" />
          <OpinionsView v-else-if="legalStore.state.activeModule === 'opinions'" />
          <DocumentsView v-else-if="legalStore.state.activeModule === 'documents'" />
          <CorrespondenceView v-else-if="legalStore.state.activeModule === 'correspondence'" />
          <KnowledgeView v-else-if="legalStore.state.activeModule === 'knowledge'" />
          <TemplatesView v-else-if="legalStore.state.activeModule === 'templates'" />
          <ReportsView v-else-if="legalStore.state.activeModule === 'reports'" />
          <ActivityView v-else-if="legalStore.state.activeModule === 'activity'" />
          <MasterDataView v-else-if="legalStore.state.activeModule === 'master-data'" />
          <SettingsView v-else-if="legalStore.state.activeModule === 'settings'" />
          <DashboardView v-else />

        </div>
      </main>

      <!-- Sub-footer info -->
      <footer class="bg-white border-t border-[#E2E8F0] px-6 py-2.5 text-[11px] text-[#475569] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse"></span>
          <span>LMS TOHA Enterprise Legal Suite • Perseroan: <strong class="text-[#0F172A]">{{ legalStore.state.currentEntity }}</strong></span>
        </div>
        <div class="flex items-center gap-3">
          <span>Pengguna: <strong class="text-[#0F172A]">{{ legalStore.state.currentUser?.name }}</strong> ({{ legalStore.state.currentUser?.role }})</span>
          <span>•</span>
          <span>LocalStorage Reaktif</span>
        </div>
      </footer>

    </div>

    <!-- Modals & Drawers -->
    <NotificationDrawer />
    <SearchModal />
    <ContractDetailModal />
    <AddContractModal />

    <!-- Global Toast Alert (Pastel Floating Card) -->
    <div
      v-if="legalStore.state.toast.show"
      class="fixed bottom-5 right-5 z-50 max-w-md bg-white text-[#0F172A] p-4 rounded-xl shadow-floating border border-[#E2E8F0] flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div
        :class="{
          'text-[#166534] bg-[#DCFCE7]': legalStore.state.toast.type === 'success',
          'text-[#9F1239] bg-[#FFE4E6]': legalStore.state.toast.type === 'error',
          'text-[#075985] bg-[#E0F2FE]': legalStore.state.toast.type === 'info',
        }"
        class="shrink-0 p-1 rounded-lg"
      >
        <CheckCircle2 v-if="legalStore.state.toast.type === 'success'" class="w-4 h-4" />
        <AlertCircle v-else-if="legalStore.state.toast.type === 'error'" class="w-4 h-4" />
        <Info v-else class="w-4 h-4" />
      </div>

      <div class="flex-1 text-xs">
        <p class="font-medium text-[#0F172A] leading-relaxed">{{ legalStore.state.toast.message }}</p>
      </div>

      <button
        @click="legalStore.state.toast.show = false"
        class="text-[#94A3B8] hover:text-[#0F172A] transition cursor-pointer text-sm"
      >
        &times;
      </button>
    </div>

  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { CheckCircle2, AlertCircle, Info } from 'lucide-vue-next';
import { legalStore } from './stores/legalStore';

// Components
import AppSidebar from './components/AppSidebar.vue';
import AppHeader from './components/AppHeader.vue';
import NotificationDrawer from './components/NotificationDrawer.vue';
import SearchModal from './components/SearchModal.vue';
import ContractDetailModal from './components/ContractDetailModal.vue';
import AddContractModal from './components/AddContractModal.vue';

// 16 Module Views
import DashboardView from './components/DashboardView.vue';
import RequestsView from './components/RequestsView.vue';
import ContractsView from './components/ContractsView.vue';
import TendersView from './components/TendersView.vue';
import CorporateView from './components/CorporateView.vue';
import LicensingView from './components/LicensingView.vue';
import ComplianceView from './components/ComplianceView.vue';
import DisputesView from './components/DisputesView.vue';
import LDDView from './components/LDDView.vue';
import OpinionsView from './components/OpinionsView.vue';
import DocumentsView from './components/DocumentsView.vue';
import CorrespondenceView from './components/CorrespondenceView.vue';
import KnowledgeView from './components/KnowledgeView.vue';
import TemplatesView from './components/TemplatesView.vue';
import ReportsView from './components/ReportsView.vue';
import ActivityView from './components/ActivityView.vue';
import MasterDataView from './components/MasterDataView.vue';
import SettingsView from './components/SettingsView.vue';

// Keyboard shortcut for Cmd+K / Ctrl+K
function handleKeyDown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    legalStore.state.isSearchModalOpen = !legalStore.state.isSearchModalOpen;
  }
  if (e.key === 'Escape') {
    legalStore.state.isSearchModalOpen = false;
    legalStore.state.isNotificationDrawerOpen = false;
    legalStore.state.isContractDetailModalOpen = false;
    legalStore.state.isAddContractModalOpen = false;
    legalStore.state.isMobileSidebarOpen = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
