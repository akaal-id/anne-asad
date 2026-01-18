import { db, Wish, RsvpData, Invitation } from '@/lib/db';
import { AdminDashboardClient } from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const wishes = db.wishes.getAll();
  const rsvps = db.rsvp.getAll();
  const invitations = db.invitations.getAll();

  return (
    <AdminDashboardClient 
      initialWishes={wishes} 
      initialRsvps={rsvps} 
      initialInvitations={invitations} 
    />
  );
}
