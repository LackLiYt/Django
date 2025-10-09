"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"

export function MainHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <header className="flex justify-end items-center w-full p-6 absolute top-0 right-0 z-50">
        <div className="flex gap-3 items-center">
          <ThemeToggle />
        </div>
      </header>
    )
  }

  return (
    <header className="flex justify-end items-center w-full p-6 absolute top-0 right-0 z-50">
      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
