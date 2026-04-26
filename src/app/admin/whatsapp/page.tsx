import { WhatsAppClient } from './WhatsAppClient';

export const metadata = {
  title: 'WhatsApp Ordering',
};

export const dynamic = 'force-dynamic';

export default function WhatsAppPage() {
  return <WhatsAppClient />;
}
