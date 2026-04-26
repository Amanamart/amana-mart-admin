import type { Metadata } from 'next';
import { AdminLoginClient } from './LoginClient';

export const metadata: Metadata = { title: 'Admin Login — Amana Mart' };

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
