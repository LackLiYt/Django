// app/page.tsx (Server Component)
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import HomeClient from './HomeClient'; // your client component

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  return <HomeClient />;
}
