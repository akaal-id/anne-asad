import { HomeClient } from "@/components/HomeClient";

// Server Component
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await the searchParams promise (Next.js 15 requirement)
  const params = await searchParams;
  const guestName = typeof params.u === 'string' ? params.u : "Bapak/Ibu/Saudara/i";

  return <HomeClient guestName={decodeURIComponent(guestName)} />;
}
