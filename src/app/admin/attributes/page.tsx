import type { Metadata } from 'next';
import { AttributesClient } from './AttributesClient';
export const metadata: Metadata = { title: 'Attributes' };
export default function AttributesPage() { return <AttributesClient />; }
