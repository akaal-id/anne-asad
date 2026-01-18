import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');

  // Simple check - in real app verify token
  const isAuthenticated = !!token;

  // We can't redirect from layout easily if we want to allow the login page itself to be rendered within the same layout structure if shared,
  // but usually login page should be outside or handled.
  // However, here we are inside /admin. 
  // If we are at /admin/login, we shouldn't redirect.
  // But layout wraps everything.
  
  // So, standard practice: Middleware is better. 
  // For now, I'll rely on page level checks or just let the login page handle itself.
  // Actually, let's create a middleware.ts in root.
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-navy-deep">
      {children}
    </div>
  );
}
