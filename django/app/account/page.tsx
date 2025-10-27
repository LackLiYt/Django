import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AccountPage } from '@/components/account-page'

export default async function AccountPageRoute() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <AccountPage user={data.user} />
}
