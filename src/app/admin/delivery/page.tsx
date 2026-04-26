import type { Metadata } from 'next';
import { DeliveryClient } from './DeliveryClient';
export const metadata: Metadata = { title: 'Delivery Men' };
export default function DeliveryPage() { return <DeliveryClient />; }
