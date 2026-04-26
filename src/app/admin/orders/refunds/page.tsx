import type { Metadata } from 'next';
import { RefundsClient } from './RefundsClient';
export const metadata: Metadata = { title: 'Order Refunds' };
export default function RefundsPage() { return <RefundsClient />; }
