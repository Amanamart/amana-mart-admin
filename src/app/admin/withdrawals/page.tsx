import type { Metadata } from 'next';
import { WithdrawalsClient } from './WithdrawalsClient';
export const metadata: Metadata = { title: 'Withdrawal Requests' };
export default function WithdrawalsPage() { return <WithdrawalsClient />; }
