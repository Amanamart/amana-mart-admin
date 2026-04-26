import type { Metadata } from 'next';
import { RolesClient } from './RolesClient';
export const metadata: Metadata = { title: 'Employee Roles' };
export default function RolesPage() { return <RolesClient />; }
