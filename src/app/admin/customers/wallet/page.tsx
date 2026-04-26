import type { Metadata } from 'next';
import { WalletClient } from './WalletClient';
export const metadata: Metadata = { title: 'Customer Wallet' };
export default function WalletPage() { return <WalletClient />; }
