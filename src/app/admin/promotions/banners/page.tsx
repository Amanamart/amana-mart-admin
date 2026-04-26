import type { Metadata } from 'next';
import { BannersClient } from './BannersClient';
export const metadata: Metadata = { title: 'Banners' };
export default function BannersPage() { return <BannersClient />; }
