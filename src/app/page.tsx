import { HomeClient } from "@/components/HomeClient";
import { db } from "@/lib/db";

// Server Component
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await the searchParams promise (Next.js 15 requirement)
  const params = await searchParams;
  const paramU = typeof params.u === 'string' ? params.u : null;

  let guestName = "Bapak/Ibu/Saudara/i";

  if (paramU) {
      try {
          // 1. Try to fetch by slug from DB with timeout
          const invitationPromise = db.invitations.getBySlug(paramU);
          const timeoutPromise = new Promise<null>((resolve) => 
              setTimeout(() => resolve(null), 5000)
          );
          
          const invitation = await Promise.race([invitationPromise, timeoutPromise]);
          
          if (invitation) {
              guestName = invitation.guestName;
          } else {
              // 2. Fallback: treat param as name directly (legacy behavior)
              guestName = decodeURIComponent(paramU);
          }
      } catch (error) {
          // If database call fails, fallback to using param as name
          console.error('Error fetching invitation:', error);
          guestName = decodeURIComponent(paramU);
      }
  }

  return <HomeClient guestName={guestName} />;
}
