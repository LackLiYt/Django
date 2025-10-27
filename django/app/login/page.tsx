import { GalleryVerticalEnd } from "lucide-react"
import { Suspense } from "react"

import { LoginForm } from "@/components/login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm error={await searchParams.error} message={await searchParams.message} />
        </Suspense>
      </div>
    </div>
  )
}
