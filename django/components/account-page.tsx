"use client"

import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { 
  Home, 
  User as UserIcon, 
  ShoppingCart, 
  Bookmark, 
  HelpCircle, 
  Settings, 
  Edit3, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  X,
  Loader2
} from "lucide-react"

interface AccountPageProps {
  user: User
}

export function AccountPage({ user }: AccountPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [showKycAlert, setShowKycAlert] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const supabase = createClient()
  
  useEffect(() => {
    // Initialize form with user data
    if (user) {
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || ''
      const nameParts = fullName.split(' ')
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      })
    }
  }, [user])

  const sidebarItems = [
    { icon: Home, label: "Process a new file", href: "/private1" },
    { icon: UserIcon, label: "My Account", href: "/account", active: true },
    { icon: ShoppingCart, label: "Plans", href: "/plans" },
  ]
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleUpdateProfile = async () => {
    setIsLoading(true)
    setMessage(null)
    
    try {
      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: `${formData.firstName} ${formData.lastName}`.trim()
        }
      })
      
      if (metadataError) throw metadataError
      
      // Update email if changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        })
        
        if (emailError) throw emailError
        setMessage({ type: 'success', text: 'Email update confirmation sent to your new email address.' })
      }
      
      // Update password if provided
      if (formData.password && formData.password === formData.confirmPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.password
        })
        
        if (passwordError) throw passwordError
        setMessage({ type: 'success', text: 'Password updated successfully.' })
      } else if (formData.password && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      
      if (!formData.password) {
        setMessage({ type: 'success', text: 'Profile updated successfully.' })
      }
      
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-muted/30">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton 
                        className={item.active ? "bg-primary text-primary-foreground" : ""}
                        asChild
                      >
                        <a href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url || "/api/placeholder/32/32"} />
                  <AvatarFallback>
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">
                    {formData.firstName} {formData.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">{formData.email}</div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6">
            <Card className="max-w-6xl mx-auto">
              <CardContent className="p-8">
                {/* Breadcrumbs */}
                <Breadcrumb className="mb-6">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">
                        <Home className="h-4 w-4" />
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/profile">Profile</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>My Account</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                {/* Page Title */}
                <h1 className="text-3xl font-bold mb-8">My Account</h1>

                {/* Profile Section */}
                <div className="flex items-center gap-6 mb-8">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.user_metadata?.avatar_url || "/api/placeholder/80/80"} />
                    <AvatarFallback>
                      {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {formData.firstName} {formData.lastName}
                    </h2>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit display image
                    </Button>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue="No.35 Heavens colony" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="Chennai" />
                    </div>

                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input placeholder="Day" defaultValue="25" />
                        <Input placeholder="Month" defaultValue="03" />
                        <Input placeholder="Year" defaultValue="1993" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select defaultValue="male">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investorType">Investor type</Label>
                      <Select defaultValue="resident">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="resident">Resident Indian Citizen</SelectItem>
                          <SelectItem value="nri">Non-Resident Indian</SelectItem>
                          <SelectItem value="foreign">Foreign National</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contacts</Label>
                      <Input id="phone" defaultValue="+91 98664 *****" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail Id</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input 
                          id="confirmPassword" 
                          type={showRePassword ? "text" : "password"} 
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowRePassword(!showRePassword)}
                        >
                          {showRePassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KYC Alert */}
                {showKycAlert && (
                  <Alert className="mt-8 border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      Register your KYC details here
                    </AlertDescription>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-6 w-6 p-0"
                      onClick={() => setShowKycAlert(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </Alert>
                )}

                {/* Message Display */}
                {message && (
                  <Alert className={message.type === 'error' ? 'mt-8 border-red-200 bg-red-50' : 'mt-8 border-green-200 bg-green-50'}>
                    <AlertTriangle className={message.type === 'error' ? 'h-4 w-4 text-red-600' : 'h-4 w-4 text-green-600'} />
                    <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                      {message.text}
                    </AlertDescription>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-6 w-6 p-0"
                      onClick={() => setMessage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFormData({
                        firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
                        lastName: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
                        email: user.email || '',
                        password: '',
                        confirmPassword: ''
                      })
                      setMessage(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
