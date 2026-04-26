import type { Metadata } from 'next';
import { POSClient } from './POSClient';
export const metadata: Metadata = { title: 'Point of Sale' };
export default function POSPage() { return <POSClient />; }
