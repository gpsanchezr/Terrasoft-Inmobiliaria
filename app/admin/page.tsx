'use client';

import { PanelAdminPagos } from '@/components/admin-panel';

export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <PanelAdminPagos />
    </div>
  );
}
