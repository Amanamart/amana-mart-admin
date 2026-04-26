import type { Metadata } from 'next';
import { PagesSettingsClient } from './PagesSettingsClient';

export const metadata: Metadata = {
  title: 'Pages & Social Settings',
};

export default function PagesSettingsPage() {
  return <PagesSettingsClient />;
}
