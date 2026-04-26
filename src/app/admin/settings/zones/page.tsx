import type { Metadata } from 'next';
import { ZonesClient } from './ZonesClient';

export const metadata: Metadata = {
  title: 'Zone Setup',
};

export default function ZonesPage() {
  return <ZonesClient />;
}
