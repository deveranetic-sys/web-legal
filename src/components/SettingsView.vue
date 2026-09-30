<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-[#4338CA]">
            Administrasi & Tata Kelola
          </span>
          <span class="text-xs text-slate-500 font-medium">Enterprise RBAC & Approval Engine</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Pengaturan Sistem & Kontrol Akses
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Konfigurasi terpusat hak akses peran (RBAC), alur persetujuan multi-jenjang berjenjang eskalasi, manajemen akun terintegrasi ERP, dan konektivitas bridge enterprise.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="resetToDefault"
          class="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-[#FECDD3] text-rose-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Data Simulasi
        </button>
      </div>
    </div>

    <!-- Navigation Tabs (4 Fitur Sesuai Referensi HTML) -->
    <div class="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
      <button
        @click="activeTab = 'roles'"
        :class="activeTab === 'roles' ? 'bg-[#4338CA] text-white shadow-xs font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-medium'"
        class="px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Matriks Peran & Izin (RBAC)
      </button>

      <button
        @click="activeTab = 'users'"
        :class="activeTab === 'users' ? 'bg-[#4338CA] text-white shadow-xs font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-medium'"
        class="px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Manajemen Pengguna & ERP ({{ users.length }})
      </button>

      <button
        @click="activeTab = 'flows'"
        :class="activeTab === 'flows' ? 'bg-[#4338CA] text-white shadow-xs font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-medium'"
        class="px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Alur Persetujuan ({{ approvalFlows.length }})
      </button>

      <button
        @click="activeTab = 'integrasi'"
        :class="activeTab === 'integrasi' ? 'bg-[#4338CA] text-white shadow-xs font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-medium'"
        class="px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Integrasi ERP & Layanan
      </button>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 1: MATRIKS PERAN & IZIN (INTERACTIVE RBAC)                            -->
    <!-- ========================================================================= -->
    <div v-if="activeTab === 'roles'" class="space-y-6">
      <!-- Segregation of Duties Banner -->
      <div class="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-100 text-[#4338CA] flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">Prinsip Segregation of Duties (SoD) & Kebijakan Matriks</h3>
            <p class="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
              Klik pada tanda centang atau silang pada setiap sel untuk mengubah izin kapabilitas peran secara langsung. Perubahan disimpan secara otomatis ke dalam profil otorisasi sistem.
            </p>
          </div>
        </div>

        <button
          @click="openAddRoleModal"
          class="px-4 py-2 rounded-xl bg-[#4338CA] hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          + Tambah Peran Kustom
        </button>
      </div>

      <!-- Interactive Matrix Table -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 class="font-bold text-slate-900 text-sm">Matriks Izin Kapabilitas Operasional</h3>
            <p class="text-xs text-slate-500">13 Kapabilitas operasional hukum, pengadaan, dan audit sistem</p>
          </div>
          <div class="flex items-center gap-4 text-xs font-medium text-slate-600">
            <span class="flex items-center gap-1.5">
              <span class="w-4 h-4 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center text-[10px] font-bold">✓</span>
              Izin Diberikan
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-bold">✕</span>
              Tidak Diberikan
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-600">
              <tr>
                <th class="py-3.5 px-4 min-w-[240px]">Kapabilitas & Modul</th>
                <th
                  v-for="(roleData, roleKey) in rolesMatrix"
                  :key="roleKey"
                  class="py-3.5 px-3 text-center min-w-[120px]"
                >
                  <div class="flex flex-col items-center">
                    <span
                      :class="getRoleBadgeClass(roleKey)"
                      class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                    >
                      {{ roleKey }}
                    </span>
                    <span v-if="roleData.isCustom" class="text-[9px] text-indigo-600 font-semibold mt-0.5 flex items-center gap-1">
                      Kustom
                      <button
                        @click.stop="confirmDeleteRole(roleKey)"
                        title="Hapus peran kustom"
                        class="text-rose-500 hover:text-rose-700 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <!-- Group 1: Kontrak, Permintaan & Pengadaan -->
              <tr class="bg-slate-50/70">
                <td :colspan="1 + Object.keys(rolesMatrix).length" class="py-2 px-4 font-bold text-slate-700 text-[11px] tracking-wide uppercase">
                  Kontrak, Pengadaan Tender & Permintaan Legal
                </td>
              </tr>
              <tr
                v-for="cap in capabilitiesGroup1"
                :key="cap.key"
                class="hover:bg-indigo-50/20 transition-colors"
              >
                <td class="py-3 px-4">
                  <div class="font-bold text-slate-800">{{ cap.label }}</div>
                  <div class="text-[11px] text-slate-400">{{ cap.category }}</div>
                </td>
                <td
                  v-for="(roleData, roleKey) in rolesMatrix"
                  :key="roleKey"
                  class="py-3 px-3 text-center"
                >
                  <button
                    @click="legalStore.toggleRoleCapability(roleKey, cap.key)"
                    :class="roleData.capabilities?.[cap.key] ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0] hover:bg-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'"
                    class="w-7 h-7 rounded-lg border text-xs font-bold inline-flex items-center justify-center transition cursor-pointer shadow-xs"
                    :title="`${roleKey} - ${cap.label}: ${roleData.capabilities?.[cap.key] ? 'Aktif' : 'Nonaktif'}`"
                  >
                    {{ roleData.capabilities?.[cap.key] ? '✓' : '✕' }}
                  </button>
                </td>
              </tr>

              <!-- Group 2: Litigasi, Kepatuhan & Dokumen Rahasia -->
              <tr class="bg-slate-50/70">
                <td :colspan="1 + Object.keys(rolesMatrix).length" class="py-2 px-4 font-bold text-slate-700 text-[11px] tracking-wide uppercase">
                  Litigasi, Kepatuhan & Akses Vault Rahasia
                </td>
              </tr>
              <tr
                v-for="cap in capabilitiesGroup2"
                :key="cap.key"
                class="hover:bg-indigo-50/20 transition-colors"
              >
                <td class="py-3 px-4">
                  <div class="font-bold text-slate-800">{{ cap.label }}</div>
                  <div class="text-[11px] text-slate-400">{{ cap.category }}</div>
                </td>
                <td
                  v-for="(roleData, roleKey) in rolesMatrix"
                  :key="roleKey"
                  class="py-3 px-3 text-center"
                >
                  <button
                    @click="legalStore.toggleRoleCapability(roleKey, cap.key)"
                    :class="roleData.capabilities?.[cap.key] ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0] hover:bg-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'"
                    class="w-7 h-7 rounded-lg border text-xs font-bold inline-flex items-center justify-center transition cursor-pointer shadow-xs"
                    :title="`${roleKey} - ${cap.label}: ${roleData.capabilities?.[cap.key] ? 'Aktif' : 'Nonaktif'}`"
                  >
                    {{ roleData.capabilities?.[cap.key] ? '✓' : '✕' }}
                  </button>
                </td>
              </tr>

              <!-- Group 3: Administrasi & Pengaturan Sistem -->
              <tr class="bg-slate-50/70">
                <td :colspan="1 + Object.keys(rolesMatrix).length" class="py-2 px-4 font-bold text-slate-700 text-[11px] tracking-wide uppercase">
                  Laporan Eksekutif, Manajemen Akun & Pengaturan
                </td>
              </tr>
              <tr
                v-for="cap in capabilitiesGroup3"
                :key="cap.key"
                class="hover:bg-indigo-50/20 transition-colors"
              >
                <td class="py-3 px-4">
                  <div class="font-bold text-slate-800">{{ cap.label }}</div>
                  <div class="text-[11px] text-slate-400">{{ cap.category }}</div>
                </td>
                <td
                  v-for="(roleData, roleKey) in rolesMatrix"
                  :key="roleKey"
                  class="py-3 px-3 text-center"
                >
                  <button
                    @click="legalStore.toggleRoleCapability(roleKey, cap.key)"
                    :class="roleData.capabilities?.[cap.key] ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0] hover:bg-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'"
                    class="w-7 h-7 rounded-lg border text-xs font-bold inline-flex items-center justify-center transition cursor-pointer shadow-xs"
                    :title="`${roleKey} - ${cap.label}: ${roleData.capabilities?.[cap.key] ? 'Aktif' : 'Nonaktif'}`"
                  >
                    {{ roleData.capabilities?.[cap.key] ? '✓' : '✕' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 2: MANAJEMEN PENGGUNA (ERP DIRECTORY INTEGRATION)                     -->
    <!-- ========================================================================= -->
    <div v-else-if="activeTab === 'users'" class="space-y-6">
      <!-- ERP HRIS Integration Banner -->
      <div class="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-slate-900">Integrasi Direktori Karyawan ERP (Workday HRIS Active)</h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
                Live Synced
              </span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
              Penambahan akun pengguna ke sistem hukum (LMS) dilakukan langsung dari master database <strong>Workday HRIS</strong> perseroan. Data NIK, email resmi, unit kerja, dan jabatan terkunci dari ERP untuk menjaga validitas dan audit trail perseroan.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <div class="text-right hidden sm:block">
            <div class="text-xs font-bold text-slate-800">{{ erpEmployees.length }} Total Karyawan di ERP</div>
            <div class="text-[11px] text-emerald-700 font-medium">{{ users.length }} Memiliki Akses LMS</div>
          </div>
          <button
            @click="openAddUserModal"
            class="px-4 py-2.5 rounded-xl bg-[#4338CA] hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            + Tambah Pengguna dari Direktori ERP
          </button>
        </div>
      </div>

      <!-- Toolbar Filter -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <!-- Search input -->
          <div class="relative w-full sm:w-72">
            <input
              v-model="userSearchQuery"
              type="text"
              placeholder="Cari nama, NIK, email, jabatan..."
              class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Role Filter -->
          <select
            v-model="userRoleFilter"
            class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Semua Peran</option>
            <option v-for="(val, rk) in rolesMatrix" :key="rk" :value="rk">{{ rk }}</option>
          </select>

          <!-- Status Filter -->
          <select
            v-model="userStatusFilter"
            class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        <div class="text-xs text-slate-500 font-medium self-end md:self-center">
          Menampilkan <span class="font-bold text-slate-800">{{ filteredUsers.length }}</span> pengguna terdaftar
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead class="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th class="py-3 px-4">Karyawan & Akun Terdaftar</th>
                <th class="py-3 px-4">Departemen & Jabatan Perusahaan</th>
                <th class="py-3 px-4 text-center">Peran LMS (RBAC)</th>
                <th class="py-3 px-4 text-center">Integrasi ERP</th>
                <th class="py-3 px-4 text-center">Status</th>
                <th class="py-3 px-4 text-right">Tindakan Otorisasi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="u in filteredUsers"
                :key="u.id"
                :class="legalStore.state.currentUser?.id === u.id ? 'bg-indigo-50/40' : 'hover:bg-slate-50'"
                class="transition"
              >
                <!-- Pengguna info -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-indigo-100 border border-indigo-200 text-[#4338CA] font-bold text-xs flex items-center justify-center shrink-0">
                      {{ u.avatar || u.name?.slice(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-bold text-slate-900 flex items-center gap-1.5">
                        {{ u.name }}
                        <span v-if="legalStore.state.currentUser?.id === u.id" class="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 text-[10px] font-extrabold">
                          Sesi Anda
                        </span>
                      </div>
                      <div class="text-xs text-slate-500 font-mono">{{ u.email }}</div>
                      <div class="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span class="bg-slate-100 px-1.5 py-0.2 rounded text-slate-600 font-bold">{{ u.nik || u.id }}</span>
                        <span>•</span>
                        <span>{{ u.phone || '+62 21 555-0100' }}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Departemen & Jabatan -->
                <td class="py-3.5 px-4">
                  <div class="font-medium text-slate-800">{{ u.title || 'Staff Spesialis' }}</div>
                  <div class="text-xs text-slate-500">{{ u.department || 'Legal & Compliance' }}</div>
                </td>

                <!-- Role Badge -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <span
                    :class="getRoleBadgeClass(u.role)"
                    class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                  >
                    {{ u.role }}
                  </span>
                </td>

                <!-- Integrasi ERP Badge -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] inline-flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                    Workday Synced
                  </span>
                </td>

                <!-- Status Pill -->
                <td class="py-3.5 px-4 text-center whitespace-nowrap">
                  <span
                    :class="u.active !== false ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]' : 'bg-slate-100 text-slate-500 border-slate-200'"
                    class="px-2.5 py-0.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="u.active !== false ? 'bg-[#10B981]' : 'bg-slate-400'"></span>
                    {{ u.active !== false ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="py-3.5 px-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="legalStore.state.currentUser?.id !== u.id"
                      @click="legalStore.switchToUser(u.id)"
                      class="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#4338CA] text-xs font-bold transition cursor-pointer border border-indigo-200"
                      title="Ganti login simulasi ke pengguna ini"
                    >
                      Beralih ke Akun Ini
                    </button>
                    <span v-else class="text-xs font-bold text-[#4338CA] flex items-center gap-1 mr-1">
                      ✓ Sedang Aktif
                    </span>

                    <!-- Edit button -->
                    <button
                      @click="openEditUserModal(u)"
                      class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="Edit Peran Pengguna"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    <!-- Toggle Active button -->
                    <button
                      @click="legalStore.toggleUserActive(u.id)"
                      :class="u.active !== false ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'"
                      class="p-1.5 rounded-lg transition cursor-pointer"
                      :title="u.active !== false ? 'Nonaktifkan Akun' : 'Aktifkan Akun'"
                    >
                      <svg v-if="u.active !== false" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 3: ALUR PERSETUJUAN (APPROVAL FLOW ENGINE)                            -->
    <!-- ========================================================================= -->
    <div v-else-if="activeTab === 'flows'" class="space-y-6">
      <!-- Info banner -->
      <div class="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-[#92400E] flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">Alur Persetujuan Multi-Jenjang (Maker → Checker → Approver)</h3>
            <p class="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
              Setiap jenis perikatan dan transaksi hukum memiliki aturan hierarki otorisasi. Dokumen dengan nilai melebihi ambang batas (*Threshold Rp*) secara otomatis dieskalasi ke Direksi/BOD dengan Service Level Agreement (SLA) ketat.
            </p>
          </div>
        </div>
      </div>

      <!-- Flow Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="flow in approvalFlows"
          :key="flow.id"
          class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition"
        >
          <div>
            <!-- Card Header -->
            <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {{ flow.id }}
                  </span>
                  <span
                    :class="flow.active ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-slate-100 text-slate-500'"
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  >
                    {{ flow.active ? 'Alur Aktif' : 'Nonaktif' }}
                  </span>
                </div>
                <h3 class="font-extrabold text-slate-900 text-base mt-1.5">{{ flow.title }}</h3>
                <p class="text-xs text-slate-500 mt-0.5">{{ flow.description }}</p>
              </div>

              <div class="text-right shrink-0">
                <span class="inline-block px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#4338CA] text-xs font-bold">
                  SLA: {{ flow.sla }}
                </span>
              </div>
            </div>

            <!-- Escalation Threshold Badge -->
            <div class="mt-3.5 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between text-xs">
              <span class="text-slate-600 font-medium">Ambang Eskalasi Nilai:</span>
              <span class="font-extrabold text-[#92400E]">{{ flow.threshold }}</span>
            </div>

            <!-- Visual Stages: Maker -> Checker -> Approver -->
            <div class="mt-4 space-y-2">
              <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tahapan Otorisasi Berjenjang</div>
              
              <div class="space-y-2">
                <!-- Step 1: Maker -->
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center">1</span>
                    <div>
                      <div class="text-xs font-bold text-slate-800">Maker (Inisiator)</div>
                      <div class="text-[11px] text-slate-500">{{ flow.makerRole }}</div>
                    </div>
                  </div>
                  <span class="text-[10px] font-semibold text-slate-500">Draft & Review Awal</span>
                </div>

                <!-- Down arrow -->
                <div class="flex justify-center text-slate-300 -my-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                <!-- Step 2: Checker -->
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 font-extrabold text-xs flex items-center justify-center">2</span>
                    <div>
                      <div class="text-xs font-bold text-slate-800">Checker (Verifikator)</div>
                      <div class="text-[11px] text-slate-500">{{ flow.checkerRole }}</div>
                    </div>
                  </div>
                  <span class="text-[10px] font-semibold text-indigo-600">Kepatuhan Hukum</span>
                </div>

                <!-- Down arrow -->
                <div class="flex justify-center text-slate-300 -my-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                <!-- Step 3: Approver -->
                <div class="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-[#DCFCE7] text-[#166534] font-extrabold text-xs flex items-center justify-center">3</span>
                    <div>
                      <div class="text-xs font-bold text-[#166534]">Approver (Pemberi Persetujuan Final)</div>
                      <div class="text-[11px] text-slate-600">{{ flow.approverRole }}</div>
                    </div>
                  </div>
                  <span class="text-[10px] font-extrabold text-emerald-800">Otorisasi Eksekutif</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              @click="legalStore.toggleApprovalFlowStatus(flow.id)"
              class="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              {{ flow.active ? 'Nonaktifkan Alur' : 'Aktifkan Alur' }}
            </button>

            <button
              @click="openEditFlowModal(flow)"
              class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#4338CA] text-xs font-bold transition cursor-pointer border border-indigo-200 flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Konfigurasi Parameter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 4: INTEGRASI ERP & EKSTERNAL                                          -->
    <!-- ========================================================================= -->
    <div v-else-if="activeTab === 'integrasi'" class="space-y-6">
      <!-- Info banner -->
      <div class="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-100 text-[#4338CA] flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">Hub Konektivitas Eksternal & Bridge Enterprise</h3>
            <p class="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
              Integrasi langsung menghubungkan modul hukum dengan database Master ERP Keuangan, Pengadaan SCM Tender, Master Data Karyawan HRIS, dan Penyimpanan Cloud Terenkripsi.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-bold text-emerald-700">Gateway API Online</span>
        </div>
      </div>

      <!-- ERP Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="erp in erpIntegrations"
          :key="erp.code"
          class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition"
        >
          <div>
            <!-- Header card -->
            <div class="flex items-start justify-between gap-3">
              <div class="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                {{ erp.icon }}
              </div>
              <span
                :class="erp.status === 'Connected' ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]' : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'"
                class="px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="erp.status === 'Connected' ? 'bg-[#10B981]' : 'bg-amber-500'"></span>
                {{ erp.status }}
              </span>
            </div>

            <h3 class="font-extrabold text-slate-900 text-base mt-3">{{ erp.name }}</h3>
            <p class="text-xs text-slate-500 mt-0.5">{{ erp.description }}</p>

            <!-- Metadata info -->
            <div class="mt-4 space-y-2 text-xs">
              <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span class="text-slate-400">Protokol:</span>
                <span class="font-mono font-bold text-slate-700">{{ erp.protocol }}</span>
              </div>
              <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span class="text-slate-400">Sinkronisasi Terakhir:</span>
                <span class="font-medium text-slate-600">{{ erp.lastSync }}</span>
              </div>
            </div>
          </div>

          <!-- Test ping button -->
          <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <span class="text-[11px] font-mono text-slate-400">{{ erp.code }}</span>

            <button
              @click="legalStore.testErpConnection(erp.code)"
              :disabled="erp.testing"
              class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#4338CA] text-xs font-bold transition cursor-pointer border border-indigo-200 flex items-center gap-1.5 disabled:opacity-50"
            >
              <svg v-if="erp.testing" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {{ erp.testing ? 'Menguji...' : 'Uji Koneksi (Ping)' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 1: TAMBAH PENGGUNA DARI DIREKTORI ERP (WORKDAY HRIS)                -->
    <!-- ========================================================================= -->
    <div
      v-if="isUserModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
    >
      <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        <!-- Modal Header -->
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-extrabold text-slate-900 text-base">
                  {{ isEditingUser ? 'Edit Hak Akses Pengguna LMS' : 'Tambah Pengguna dari Direktori ERP' }}
                </h3>
                <span class="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
                  Workday HRIS
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                {{ isEditingUser ? 'Perbarui peran dan status akun pengguna terdaftar' : 'Pilih karyawan dari master data perseroan untuk diberikan hak otorisasi' }}
              </p>
            </div>
          </div>
          <button
            @click="isUserModalOpen = false"
            class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="saveUser" class="p-5 space-y-5">
          <!-- SECTION A: PEMILIHAN KARYAWAN ERP (HANYA MUNCUL SAAT TAMBAH BARU) -->
          <div v-if="!isEditingUser" class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-700">
                1. Pilih Karyawan dari Direktori Master ERP (HRIS)
              </label>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  @click="erpFilterMode = 'all'"
                  :class="erpFilterMode === 'all' ? 'bg-indigo-100 text-[#4338CA] font-bold' : 'text-slate-500 hover:bg-slate-100'"
                  class="px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer"
                >
                  Semua ({{ availableErpEmployees.length }})
                </button>
                <button
                  type="button"
                  @click="erpFilterMode = 'unregistered'"
                  :class="erpFilterMode === 'unregistered' ? 'bg-emerald-100 text-[#166534] font-bold' : 'text-slate-500 hover:bg-slate-100'"
                  class="px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer"
                >
                  Belum Punya Akses ({{ unregisteredErpEmployeesCount }})
                </button>
              </div>
            </div>

            <!-- Search box for ERP Employees -->
            <div class="relative">
              <input
                v-model="erpSearchQuery"
                type="text"
                placeholder="Cari nama karyawan, NIK (EMP-...), jabatan, atau divisi..."
                class="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Scrollable ERP Employee List -->
            <div class="border border-slate-200 rounded-xl max-h-52 overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
              <div
                v-for="emp in displayedErpEmployees"
                :key="emp.nik"
                @click="selectErpEmployee(emp)"
                :class="selectedErpEmployee?.nik === emp.nik ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-white'"
                class="p-3 transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-indigo-100 text-[#4338CA] font-bold text-xs flex items-center justify-center shrink-0">
                    {{ emp.name?.slice(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {{ emp.name }}
                      <span class="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                        {{ emp.nik }}
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-500">{{ emp.title }} • {{ emp.department }}</div>
                  </div>
                </div>

                <div class="text-right shrink-0">
                  <span
                    v-if="emp.isRegisteredInLms"
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700"
                  >
                    Sudah di LMS ({{ emp.currentLmsRole }})
                  </span>
                  <span
                    v-else
                    :class="selectedErpEmployee?.nik === emp.nik ? 'bg-[#4338CA] text-white' : 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'"
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1"
                  >
                    {{ selectedErpEmployee?.nik === emp.nik ? '✓ Terpilih' : '+ Pilih' }}
                  </span>
                </div>
              </div>

              <div v-if="displayedErpEmployees.length === 0" class="p-6 text-center text-xs text-slate-400">
                Tidak ada karyawan yang cocok dengan pencarian di direktori ERP.
              </div>
            </div>
          </div>

          <!-- SECTION B: DETAIL TERVERIFIKASI ERP (READ-ONLY PROFILE) -->
          <div v-if="selectedErpEmployee || isEditingUser" class="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
            <div class="flex items-center justify-between border-b border-indigo-100/70 pb-2">
              <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Profil Terverifikasi dari ERP (Workday HRIS)
              </span>
              <span class="text-[10px] font-mono text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                NIK: {{ userForm.nik || 'EMP-XXXX' }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span class="text-slate-400 block text-[11px]">Nama Lengkap Pegawai:</span>
                <span class="font-bold text-slate-900">{{ userForm.name }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Email Resmi Perusahaan:</span>
                <span class="font-mono text-slate-700 font-semibold">{{ userForm.email }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Departemen / Divisi:</span>
                <span class="font-medium text-slate-800">{{ userForm.department }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Jabatan Struktural:</span>
                <span class="font-medium text-slate-800">{{ userForm.title }}</span>
              </div>
            </div>
            <div class="text-[10px] text-slate-500 italic bg-white/70 p-2 rounded-lg border border-indigo-100/50">
              ℹ Data identitas di atas ditarik langsung dari integrasi ERP HRIS untuk mencegah duplikasi atau data fiktif.
            </div>
          </div>

          <!-- SECTION C: KONFIGURASI HAK AKSES SISTEM HUKUM (LMS) -->
          <div class="space-y-4 pt-1">
            <label class="block text-xs font-bold text-slate-700">
              {{ isEditingUser ? 'Konfigurasi Hak Akses LMS' : '2. Konfigurasi Hak Akses Sistem Hukum (LMS)' }}
            </label>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Peran (Role RBAC LMS)</label>
                <select
                  v-model="userForm.role"
                  required
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-semibold"
                >
                  <option v-for="(val, rk) in rolesMatrix" :key="rk" :value="rk">{{ rk }}</option>
                </select>
                <p class="text-[10px] text-slate-500 mt-1">Menentukan kapabilitas operasional dan alur persetujuan</p>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Nomor Kontak / WhatsApp</label>
                <input
                  v-model="userForm.phone"
                  type="text"
                  placeholder="+62 811..."
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="userActiveCheck"
                v-model="userForm.active"
                class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label for="userActiveCheck" class="text-xs font-medium text-slate-700 cursor-pointer">
                Akun aktif dan diizinkan login ke dalam sistem hukum (LMS)
              </label>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="isUserModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="!isEditingUser && !selectedErpEmployee"
              class="px-5 py-2.5 rounded-xl bg-[#4338CA] hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ isEditingUser ? 'Simpan Perubahan' : 'Berikan Akses LMS & Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 2: TAMBAH PERAN KUSTOM                                              -->
    <!-- ========================================================================= -->
    <div
      v-if="isRoleModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 class="font-extrabold text-slate-900 text-base">Tambah Peran Kustom Baru</h3>
            <p class="text-xs text-slate-500 mt-0.5">Definisikan peran baru untuk alur bisnis spesifik</p>
          </div>
          <button
            @click="isRoleModalOpen = false"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="saveCustomRole" class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nama / Kode Peran (Uppercase)</label>
            <input
              v-model="roleForm.name"
              type="text"
              required
              placeholder="Contoh: AUDITOR EKSTERNAL"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-300 font-mono"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Deskripsi Tanggung Jawab</label>
            <textarea
              v-model="roleForm.description"
              rows="2"
              placeholder="Deskripsi fungsi dan ruang lingkup peran operasional ini..."
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Kloning Izin Awal Dari Peran Eksisting</label>
            <select
              v-model="roleForm.cloneFromRole"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Izin Dasar Minimal</option>
              <option v-for="(val, rk) in rolesMatrix" :key="rk" :value="rk">{{ rk }}</option>
            </select>
            <p class="text-[11px] text-slate-500 mt-1">Anda dapat menyesuaikan izin kapabilitas secara individual di matriks setelah peran dibuat.</p>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="isRoleModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-xl bg-[#4338CA] hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Buat Peran
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 3: EDIT PARAMETER ALUR PERSETUJUAN                                  -->
    <!-- ========================================================================= -->
    <div
      v-if="isFlowModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 class="font-extrabold text-slate-900 text-base">Konfigurasi Alur Persetujuan</h3>
            <p class="text-xs text-slate-500 mt-0.5">{{ flowForm.id }} - {{ flowForm.title }}</p>
          </div>
          <button
            @click="isFlowModalOpen = false"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="saveFlow" class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Judul Alur Persetujuan</label>
            <input
              v-model="flowForm.title"
              type="text"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">SLA Waktu Respon</label>
              <input
                v-model="flowForm.sla"
                type="text"
                required
                placeholder="24 Jam / 2 Hari Kerja"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Ambang Batas Nilai (Rp)</label>
              <input
                v-model="flowForm.threshold"
                type="text"
                required
                placeholder="> Rp 10.000.000.000"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div class="space-y-3 pt-2">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Peran Maker (Tahap 1)</label>
              <input
                v-model="flowForm.makerRole"
                type="text"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Peran Checker (Tahap 2)</label>
              <input
                v-model="flowForm.checkerRole"
                type="text"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Peran Approver (Tahap 3)</label>
              <input
                v-model="flowForm.approverRole"
                type="text"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="isFlowModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-xl bg-[#4338CA] hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Simpan Konfigurasi
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { legalStore } from '../stores/legalStore';

// Active Sub-tab ('roles' | 'users' | 'flows' | 'integrasi')
const activeTab = ref('roles');

// Datasets from store
const users = computed(() => legalStore.state.users || []);
const rolesMatrix = computed(() => legalStore.state.rolesMatrix || {});
const approvalFlows = computed(() => legalStore.state.approvalFlows || []);
const erpIntegrations = computed(() => legalStore.state.erpIntegrations || []);
const erpEmployees = computed(() => legalStore.state.erpEmployees || []);
const capabilityList = computed(() => legalStore.state.capabilityList || []);

// Capability groups for clean presentation in interactive table
const capabilitiesGroup1 = computed(() =>
  capabilityList.value.filter(c =>
    ['can_create_request', 'can_review_contract', 'can_approve_contract', 'can_sign_contract', 'can_manage_tender', 'can_approve_tender_bid', 'can_view_tender_bonds'].includes(c.key)
  )
);

const capabilitiesGroup2 = computed(() =>
  capabilityList.value.filter(c =>
    ['can_manage_disputes', 'can_manage_compliance', 'can_access_confidential_docs'].includes(c.key)
  )
);

const capabilitiesGroup3 = computed(() =>
  capabilityList.value.filter(c =>
    ['can_export_reports', 'can_manage_users', 'can_manage_settings'].includes(c.key)
  )
);

// User filtering
const userSearchQuery = ref('');
const userRoleFilter = ref('');
const userStatusFilter = ref('');

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const q = userSearchQuery.value.toLowerCase().trim();
    const matchQ = !q ||
      u.name?.toLowerCase().includes(q) ||
      u.nik?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q) ||
      u.title?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q);

    const matchRole = !userRoleFilter.value || u.role === userRoleFilter.value;
    const matchStatus = !userStatusFilter.value ||
      (userStatusFilter.value === 'active' && u.active !== false) ||
      (userStatusFilter.value === 'inactive' && u.active === false);

    return matchQ && matchRole && matchStatus;
  });
});

// ERP Directory Enrichment & Filtering for Add User Modal
const erpSearchQuery = ref('');
const erpFilterMode = ref('all'); // 'all' | 'unregistered'
const selectedErpEmployee = ref(null);

const availableErpEmployees = computed(() => {
  return erpEmployees.value.map(emp => {
    const existing = users.value.find(u =>
      (emp.email && u.email?.toLowerCase() === emp.email.toLowerCase()) ||
      (emp.nik && u.nik === emp.nik)
    );
    return {
      ...emp,
      isRegisteredInLms: !!existing,
      currentLmsRole: existing ? existing.role : null,
      lmsUserId: existing ? existing.id : null
    };
  });
});

const unregisteredErpEmployeesCount = computed(() => {
  return availableErpEmployees.value.filter(e => !e.isRegisteredInLms).length;
});

const displayedErpEmployees = computed(() => {
  const q = erpSearchQuery.value.toLowerCase().trim();
  return availableErpEmployees.value.filter(emp => {
    if (erpFilterMode.value === 'unregistered' && emp.isRegisteredInLms) {
      return false;
    }
    if (!q) return true;
    return emp.name?.toLowerCase().includes(q) ||
           emp.nik?.toLowerCase().includes(q) ||
           emp.email?.toLowerCase().includes(q) ||
           emp.department?.toLowerCase().includes(q) ||
           emp.title?.toLowerCase().includes(q);
  });
});

// Modals State
const isUserModalOpen = ref(false);
const isEditingUser = ref(false);
const userForm = ref({
  id: '',
  nik: '',
  name: '',
  email: '',
  department: '',
  title: '',
  role: 'LEGAL STAFF',
  phone: '',
  workLocation: '',
  active: true
});

const isRoleModalOpen = ref(false);
const roleForm = ref({
  name: '',
  description: '',
  cloneFromRole: 'LEGAL STAFF'
});

const isFlowModalOpen = ref(false);
const flowForm = ref({
  id: '',
  title: '',
  sla: '',
  threshold: '',
  makerRole: '',
  checkerRole: '',
  approverRole: ''
});

// User Modal Handlers (ERP Integrated)
function openAddUserModal() {
  isEditingUser.value = false;
  erpSearchQuery.value = '';
  erpFilterMode.value = 'all';

  // Automatically select the first unregistered employee if available
  const firstUnregistered = availableErpEmployees.value.find(e => !e.isRegisteredInLms) || availableErpEmployees.value[0];
  if (firstUnregistered) {
    selectErpEmployee(firstUnregistered);
  } else {
    selectedErpEmployee.value = null;
    userForm.value = {
      id: '',
      nik: '',
      name: '',
      email: '',
      department: '',
      title: '',
      role: 'LEGAL STAFF',
      phone: '',
      workLocation: '',
      active: true
    };
  }
  isUserModalOpen.value = true;
}

function selectErpEmployee(emp) {
  selectedErpEmployee.value = emp;
  userForm.value = {
    id: emp.lmsUserId || '',
    nik: emp.nik,
    name: emp.name,
    email: emp.email,
    department: emp.department,
    title: emp.title,
    phone: emp.phone || '+62 21 555-0100',
    workLocation: emp.workLocation || 'Head Office Jakarta',
    role: emp.currentLmsRole || emp.defaultRole || 'REQUESTOR',
    active: true
  };
}

function openEditUserModal(u) {
  isEditingUser.value = true;
  selectedErpEmployee.value = null;
  userForm.value = {
    id: u.id,
    nik: u.nik || u.id,
    name: u.name,
    email: u.email,
    department: u.department || 'Legal & Compliance',
    title: u.title || '',
    role: u.role || 'LEGAL STAFF',
    phone: u.phone || '',
    workLocation: u.workLocation || 'Head Office Jakarta',
    active: u.active !== false
  };
  isUserModalOpen.value = true;
}

function saveUser() {
  if (isEditingUser.value) {
    legalStore.updateUser(userForm.value.id, {
      name: userForm.value.name,
      email: userForm.value.email,
      department: userForm.value.department,
      title: userForm.value.title,
      role: userForm.value.role,
      phone: userForm.value.phone,
      nik: userForm.value.nik,
      workLocation: userForm.value.workLocation,
      active: userForm.value.active
    });
  } else {
    legalStore.addUser({
      nik: userForm.value.nik,
      name: userForm.value.name,
      email: userForm.value.email,
      department: userForm.value.department,
      title: userForm.value.title,
      role: userForm.value.role,
      phone: userForm.value.phone,
      workLocation: userForm.value.workLocation,
      active: userForm.value.active
    });
  }
  isUserModalOpen.value = false;
}

// Role Modal Handlers
function openAddRoleModal() {
  roleForm.value = {
    name: '',
    description: '',
    cloneFromRole: 'LEGAL STAFF'
  };
  isRoleModalOpen.value = true;
}

function saveCustomRole() {
  if (!roleForm.value.name.trim()) return;
  const success = legalStore.addCustomRole(roleForm.value);
  if (success) {
    isRoleModalOpen.value = false;
  }
}

function confirmDeleteRole(roleKey) {
  if (confirm(`Yakin ingin menghapus peran kustom "${roleKey}" dari matriks sistem?`)) {
    legalStore.deleteCustomRole(roleKey);
  }
}

// Flow Modal Handlers
function openEditFlowModal(flow) {
  flowForm.value = {
    id: flow.id,
    title: flow.title,
    sla: flow.sla,
    threshold: flow.threshold,
    makerRole: flow.makerRole,
    checkerRole: flow.checkerRole,
    approverRole: flow.approverRole
  };
  isFlowModalOpen.value = true;
}

function saveFlow() {
  legalStore.updateApprovalFlow(flowForm.value.id, {
    title: flowForm.value.title,
    sla: flowForm.value.sla,
    threshold: flowForm.value.threshold,
    makerRole: flowForm.value.makerRole,
    checkerRole: flowForm.value.checkerRole,
    approverRole: flowForm.value.approverRole
  });
  isFlowModalOpen.value = false;
}

// Helpers
function getRoleBadgeClass(role) {
  switch (role) {
    case 'ADMIN': return 'bg-purple-100 text-purple-800 border border-purple-200';
    case 'LEGAL MANAGER': return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'LEGAL COUNSEL': return 'bg-indigo-100 text-[#4338CA] border border-indigo-200';
    case 'LEGAL STAFF': return 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
    case 'REQUESTOR': return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    case 'MANAGEMENT': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    default: return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}

function resetToDefault() {
  if (confirm('Kembalikan semua data simulasi ke kondisi awal bawaan (default)?')) {
    legalStore.resetToDefault();
  }
}
</script>
