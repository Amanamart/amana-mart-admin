import type { Metadata } from 'next';
import { LoyaltyClient } from './LoyaltyClient';
export const metadata: Metadata = { title: 'Loyalty Points' };
export default function LoyaltyPage() { return <LoyaltyClient />; }
