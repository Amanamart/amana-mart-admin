import type { Metadata } from 'next';
import { BusinessSettingsClient } from './BusinessSettingsClient';
export const metadata: Metadata = { title: 'Business Settings' };
export default function BusinessSettingsPage() { return <BusinessSettingsClient />; }
