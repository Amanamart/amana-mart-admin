import type { Metadata } from 'next';
import { SystemConfigClient } from './SystemConfigClient';
export const metadata: Metadata = { title: 'System Configuration' };
export default function SystemConfigPage() { return <SystemConfigClient />; }
