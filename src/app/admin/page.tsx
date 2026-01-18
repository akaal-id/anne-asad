import { db, Wish, RsvpData, Invitation } from '@/lib/db';
import { AdminDashboardClient } from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const wishes = await db.wishes.getAll();
  const rsvps = await db.rsvp.getAll();
  const invitations = await db.invitations.getAll();

  return (
    <AdminDashboardClient 
      initialWishes={wishes} 
      initialRsvps={rsvps} 
      initialInvitations={invitations} 
    />
  );
}
