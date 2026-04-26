import { MessagingClient } from './MessagingClient';

export const metadata = {
  title: 'Internal Messaging',
};

export const dynamic = 'force-dynamic';

export default function MessagingPage() {
  return <MessagingClient />;
}
