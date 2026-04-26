import type { Metadata } from 'next';
import { StoresClient } from './StoresClient';
export const metadata: Metadata = { title: 'Stores' };
export default function StoresPage() { return <StoresClient />; }
