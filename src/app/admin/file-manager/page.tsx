import { MediaClient } from './MediaClient';

export const metadata = {
  title: 'Media Manager',
};

export const dynamic = 'force-dynamic';

export default function MediaPage() {
  return <MediaClient />;
}
