import type { Metadata } from 'next';
import { FlashSalesClient } from './FlashSalesClient';
export const metadata: Metadata = { title: 'Flash Sales' };
export default function FlashSalesPage() { return <FlashSalesClient />; }
