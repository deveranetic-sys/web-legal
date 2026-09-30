<template>
  <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 transition-all">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      
      <!-- Brand & Entity Info -->
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-sm font-extrabold tracking-tight text-slate-900">LMS ENTERPRISE</h1>
            <span class="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-200">Vue 3 • Corp</span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium">Corporate Legal Operations & Governance</p>
        </div>
      </div>

      <!-- Entity Switcher Dropdown -->
      <div class="hidden md:flex items-center gap-2 border-l border-r border-slate-200 px-4 py-1">
        <span class="text-xs text-slate-400 font-medium">Entitas:</span>
        <select 
          :value="legalStore.state.currentEntity" 
          @change="legalStore.changeEntity($event.target.value)"
          class="bg-slate-100 hover:bg-slate-200/70 border border-slate-300 text-xs font-semibold rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition"
        >
          <option value="PT Nusantara Energi">PT Nusantara Energi (Holding)</option>
          <option value="PT Nusantara Holdings Utama">PT Nusantara Holdings Utama</option>
          <option value="PT Sinergi Tambang Gemilang">PT Sinergi Tambang Gemilang</option>
        </select>
      </div>

      <!-- Right Header Actions -->
      <div class="flex items-center gap-3">
        <!-- Quick Universal Search Button -->
        <button 
          @click="legalStore.state.isSearchModalOpen = true"
          class="hidden sm:flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 text-xs text-slate-500 border border-slate-200/80 transition"
          title="Pencarian Cepat"
        >
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span>Cari kontrak...</span>
          <kbd class="rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-200 shadow-xs">⌘K</kbd>
        </button>

        <!-- Notification Bell -->
        <button 
          @click="legalStore.state.isNotificationDrawerOpen = !legalStore.state.isNotificationDrawerOpen"
          class="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
          title="Pemberitahuan Sistem"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <span v-if="legalStore.kpis.value.criticalContractsCount > 0" class="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        </button>

        <!-- Interactive Role Switcher -->
        <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div class="hidden lg:block text-right">
            <div class="text-xs font-bold text-slate-800">{{ legalStore.state.currentUser?.name }}</div>
            <div class="text-[10px] text-slate-400">{{ legalStore.state.currentUser?.title }}</div>
          </div>
          <div class="relative">
            <select 
              :value="legalStore.state.currentUser?.role" 
              @change="legalStore.switchRole($event.target.value)"
              class="rounded-xl border border-slate-300 bg-white py-1.5 px-2.5 text-xs font-bold text-indigo-700 shadow-xs hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ADMIN">ADMIN (Full Access)</option>
              <option value="LEGAL MANAGER">LEGAL MANAGER</option>
              <option value="LEGAL COUNSEL">LEGAL COUNSEL</option>
              <option value="LEGAL STAFF">LEGAL STAFF</option>
              <option value="REQUESTOR">REQUESTOR (Unit Bisnis)</option>
              <option value="MANAGEMENT">MANAGEMENT (BOD/BOC)</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  </header>
</template>

<script setup>
import { legalStore } from '../stores/legalStore';
</script>
