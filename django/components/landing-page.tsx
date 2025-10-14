"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Brain, Zap, Shield, Users, BarChart3, ArrowRight, CheckCircle, Star, Quote } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export function LandingPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  const sections = [
    {
      id: 'hero',
      title: 'Precision AI Search for your team',
      subtitle: 'Powered by world-class enterprise search that serves up immediate access to all of the institutional knowledge in your organization, enabling you to build entire AI applications, encapsulate multi-step workflows, and implement LLM agents.',
      cta: 'Get Started',
      stats: [
        { value: '+65', label: 'Hours saved per user per year' },
        { value: '+85%', label: 'Adoption in under two months' },
        { value: '+23', label: 'Queries per user per day' },
        { value: '4x', label: 'ROI in the first year' }
      ]
    },
    {
      id: 'problem',
      title: 'Your collective knowledge is your unique asset',
      subtitle: 'But it\'s scattered and inaccessible',
      description: 'Knowledge is scattered across multiple platforms and systems, making it difficult to access and utilize effectively.',
      platforms: ['SharePoint', 'OneDrive', 'DMS', 'Email', 'Intranet', 'HighQ']
    },
    {
      id: 'solution',
      title: 'Search the way you think to unlock everything',
      subtitle: 'Empower your team with real insights in seconds—not hours. Our Knowledge Search indexes and understands your data, wherever it lives, providing seamless access to your knowledge from a single place.',
      features: [
        {
          title: 'Negotiation Intelligence',
          description: 'Search to uncover whether opposing counsel ever agreed to a point in a past negotiation.',
          icon: <Brain className="h-6 w-6" />
        },
        {
          title: 'Multi-Document Chat',
          description: 'Ask questions about a client-matter file folder, or any set of documents, for quick insights and review.',
          icon: <Search className="h-6 w-6" />
        },
        {
          title: 'Matter & Client Overview',
          description: 'Creates an overview and timeline of all the events pertaining to documents of a selected matter, client or folder.',
          icon: <BarChart3 className="h-6 w-6" />
        }
      ]
    },
    {
      id: 'workflows',
      title: 'Build, deploy and orchestrate AI agents powered by your data',
      subtitle: 'Empower your AI apps and agents with AI Workflows that work like you do and know what your firm knows.',
      description: 'DeepJudge AI Workflows enable building, deploying, orchestrating, and governing AI agents to drive real ROI. Our LLM-agnostic agentic reasoning executes complex, multi-step tasks—retrieving data from multiple sources and taking actions to get work done with transparency and precision.'
    },
    {
      id: 'testimonials',
      title: 'Trusted by thousands of exceptional professionals at the world\'s top firms',
      testimonials: [
        {
          quote: "The adoption rate has been remarkable, with more than 80% of our legal professionals incorporating it into their workflow and a level of engagement that is unparalleled compared with other legal tech tools at the firm.",
          author: "David Oser",
          role: "Partner in M&A at Homburger",
          avatar: "/api/placeholder/40/40"
        },
        {
          quote: "The output from DeepJudge's search function can then seamlessly connect with a generative AI-based workflow to help our people to efficiently deliver high-quality, consistent value for our clients.",
          author: "Fedor Poskriakov",
          role: "Deputy Managing Partner at Lenz & Staehelin",
          avatar: "/api/placeholder/40/40"
        },
        {
          quote: "Instead of hunting for documents to upload to an AI platform, everything you need is already there. Fast, efficient, and compliant access to the right information is the foundation for AI applications that help us do more with our knowledge base.",
          author: "Joe Green",
          role: "Chief Innovation Officer at Gunderson Dettmer",
          avatar: "/api/placeholder/40/40"
        }
      ]
    },
    {
      id: 'cta',
      title: 'Beyond search, understanding.',
      subtitle: 'Ready to unlock your organization\'s full potential?',
      cta: 'Book a Demo',
      secondaryCta: 'Explore the Product'
    }
  ]

  useEffect(() => {
    setIsVisible(true)
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const sectionIndex = Math.floor(scrollPosition / windowHeight)
      setCurrentSection(Math.min(sectionIndex, sections.length - 1))
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const direction = e.deltaY > 0 ? 1 : -1
      const newSection = Math.max(0, Math.min(sections.length - 1, currentSection + direction))
      scrollToSection(newSection)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [currentSection, sections.length])

  const scrollToSection = (index: number) => {
    const targetElement = sectionRefs.current[index]
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative">
      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-2">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === index 
                ? 'bg-primary scale-125' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section 
        ref={(el) => { sectionRefs.current[0] = el as HTMLDivElement }}
        className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-8 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold text-foreground leading-tight">
              {sections[0].title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {sections[0].subtitle}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 my-12">
            {sections[0]?.stats?.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-300">
              {sections[0].cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-300">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section 
        ref={(el) => { sectionRefs.current[1] = el as HTMLDivElement }}
        className="min-h-screen flex items-center justify-center bg-muted/30 px-8"
      >
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-bold text-foreground">
              {sections[1].title}
            </h2>
            <p className="text-2xl md:text-3xl text-muted-foreground">
              {sections[1].subtitle}
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {sections[1].description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sections[1]?.platforms?.map((platform, index) => (
              <Card 
                key={index} 
                className="p-6 text-center card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="text-sm font-medium">{platform}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section 
        ref={(el) => { sectionRefs.current[2] = el as HTMLDivElement }}
        className="min-h-screen flex items-center justify-center bg-background px-8"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-bold text-foreground">
              {sections[2].title}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
              {sections[2].subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sections[2]?.features?.map((feature, index) => (
              <Card 
                key={index} 
                className="p-8 card-hover group animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader className="p-0 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflows Section */}
      <section 
        ref={(el) => { sectionRefs.current[3] = el as HTMLDivElement }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-muted/20 px-8"
      >
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-bold text-foreground">
              {sections[3].title}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
              {sections[3].subtitle}
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {sections[3].description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 text-left">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Automate mission-critical workflows</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-base">
                  DeepJudge AI Workflows enable building, deploying, orchestrating, and governing AI agents to drive real ROI.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8 text-left">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Transparency and precision</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-base">
                  Our LLM-agnostic agentic reasoning executes complex, multi-step tasks with complete transparency.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={(el) => { sectionRefs.current[4] = el as HTMLDivElement }}
        className="min-h-screen flex items-center justify-center bg-muted/30 px-8"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-bold text-foreground">
              {sections[4].title}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sections[4]?.testimonials?.map((testimonial, index) => (
              <Card 
                key={index} 
                className="p-8 card-hover group animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-0">
                  <div className="flex items-start gap-4 mb-6">
                    <Quote className="h-6 w-6 text-primary/60 flex-shrink-0 mt-1 group-hover:text-primary transition-colors duration-300" />
                    <p className="text-base leading-relaxed italic">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 group-hover:scale-110 transition-transform duration-300">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors duration-300">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={(el) => { sectionRefs.current[5] = el as HTMLDivElement }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-8"
      >
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-bold">
              {sections[5].title}
            </h2>
            <p className="text-xl md:text-2xl opacity-90">
              {sections[5].subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              {sections[5].cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              {sections[5].secondaryCta}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
