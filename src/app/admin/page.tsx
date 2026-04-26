import type { Metadata } from 'next';
import { AdminDashboardClient } from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return <AdminDashboardClient />;
}
