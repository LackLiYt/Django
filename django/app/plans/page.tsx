"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-medium">Simple, transparent pricing</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Choose your plan</h1>
            <p className="text-muted-foreground mt-2">Upgrade anytime. Cancel anytime.</p>
          </div>
          <Link href="/account" className="ml-4 whitespace-nowrap">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Free Tier */}
          <Card className="relative overflow-hidden border-primary/20 flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Free</CardTitle>
                <Badge variant="secondary">Current plan</Badge>
              </div>
              <CardDescription>Get started and try the basics.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-4xl font-bold">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
              <Separator className="my-4" />
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Upload 10 files/month</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Markdown and Text output</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Basic OCR</li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button variant="outline" className="w-full">You're on Free</Button>
            </CardFooter>
          </Card>

          {/* Pro Tier */}
          <Card className="relative overflow-hidden border-primary flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pro</CardTitle>
                <Badge>Best value</Badge>
              </div>
              <CardDescription>Everything in Free, plus more power.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-4xl font-bold">$20<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
              <Separator className="my-4" />
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Unlimited conversions</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Advanced OCR (multi-language)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Table structure + images</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Priority processing</li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full">Upgrade to Pro</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
