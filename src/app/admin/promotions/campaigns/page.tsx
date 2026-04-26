import type { Metadata } from 'next';
import { CampaignsClient } from './CampaignsClient';
export const metadata: Metadata = { title: 'Campaigns' };
export default function CampaignsPage() { return <CampaignsClient />; }
