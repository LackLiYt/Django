import { SearchBar } from "@/components/search-bar"
import { MainHeader } from "@/components/main-header"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <MainHeader />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 pb-8 px-8">
        <div className="text-center space-y-12 w-full max-w-4xl">
          {/* Caption */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              What's on your mind today?
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover, explore, and find answers to your questions with our intelligent search platform.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center">
            <SearchBar />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-16">
            <div className="text-sm text-muted-foreground">
              Try asking: "How does AI work?" or "What's the weather like?"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
