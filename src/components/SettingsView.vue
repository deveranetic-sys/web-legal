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
    <SettingsRolesTab
      v-if="activeTab === 'roles'"
      :roles-matrix="rolesMatrix"
      @open-add-role-modal="isRoleModalOpen = true"
    />

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
    <SettingsFlowsTab
      v-else-if="activeTab === 'flows'"
      @open-edit-flow-modal="openEditFlowModal"
    />

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
    <!-- MODAL 1: PENGGUNA -->
    <!-- ========================================================================= -->
    <SettingsUserModal
      :is-open="isUserModalOpen"
      :is-editing="isEditingUser"
      :initial-user="editingUserObj"
      @close="isUserModalOpen = false"
    />

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

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SettingsRoleModal from './Settings/SettingsRoleModal.vue';
import SettingsFlowModal from './Settings/SettingsFlowModal.vue';
import SettingsUserModal from './Settings/SettingsUserModal.vue';
import SettingsFlowsTab from './Settings/Tabs/SettingsFlowsTab.vue';
import SettingsIntegrasiTab from './Settings/Tabs/SettingsIntegrasiTab.vue';
import SettingsRolesTab from './Settings/Tabs/SettingsRolesTab.vue';
import SettingsUsersTab from './Settings/Tabs/SettingsUsersTab.vue';
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

const isUserModalOpen = ref(false);
const isEditingUser = ref(false);
const isRoleModalOpen = ref(false);
const isFlowModalOpen = ref(false);
const editingUserObj = ref(null);

function openAddUserModal() {
  isEditingUser.value = false;
  editingUserObj.value = null;
  isUserModalOpen.value = true;
}

function openEditUserModal(u) {
  isEditingUser.value = true;
  editingUserObj.value = u;
  isUserModalOpen.value = true;
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

// Flow Modal Handlers
const editingFlowObj = ref(null);

function openEditFlowModal(flow) {
  editingFlowObj.value = flow;
  isFlowModalOpen.value = true;
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
