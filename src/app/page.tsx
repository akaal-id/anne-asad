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
      // 1. Try to fetch by slug from DB
      const invitation = await db.invitations.getBySlug(paramU);
      
      if (invitation) {
          guestName = invitation.guestName;
      } else {
          // 2. Fallback: treat param as name directly (legacy behavior)
          guestName = decodeURIComponent(paramU);
      }
  }

  return <HomeClient guestName={guestName} />;
}
