import type { Metadata } from 'next';
import { ModuleSetupClient } from './ModuleSetupClient';

export const metadata: Metadata = {
  title: 'Module Setup',
};

export default function ModuleSetupPage() {
  return <ModuleSetupClient />;
}
