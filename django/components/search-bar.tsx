"use client"

import { useState } from "react"
import { Search, Plus, Mic, Volume2 } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

export function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Handle search logic here
      console.log("Searching for:", query)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch}>
        <InputGroup className="h-14 text-lg">
          <InputGroupAddon align="inline-start">
            <Plus className="h-5 w-5" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder="Enter a name or paste the link"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-lg"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-sm"
            >
              <Mic className="h-4 w-4" />
            </InputGroupButton>
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-sm"
            >
              <Volume2 className="h-4 w-4" />
            </InputGroupButton>
            <InputGroupButton
              type="submit"
              variant="ghost"
              size="icon-sm"
            >
              <Search className="h-4 w-4" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  )
}
