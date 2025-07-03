"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code, Users, Zap, CheckCircle, Cpu, Smartphone, Play } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Branding */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold bg-gradient-to-b from-blue-300 to-blue-500 text-transparent bg-clip-text">
          KaiCode
        </h1>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Code Together, Build Together
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Real-time collaborative coding with AI-powered assistance and instant code execution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Real-time Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Code together with your team in real-time. See everyone's cursors and changes instantly with our Yjs-powered CRDT system.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI-Powered Assistance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get intelligent code suggestions and recommendations from Devin AI, helping you write better code faster.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Multi-language Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Switch between multiple programming languages seamlessly. Python, JavaScript, and more - all with real-time execution.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Custom Code Judge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Test your code against custom test cases with our built-in judge system. Get instant feedback on your solutions.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Real-time Broadcasting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Every code submission is instantly broadcasted to all session participants, keeping everyone in sync.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Mobile Coding</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Code on the go! Our mobile-optimized interface lets you collaborate and code from your phone, with full access to all features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Demo Video Section */}
      <div className="container mx-auto px-4 py-20 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-lg text-muted-foreground">
              Watch how real-time collaboration transforms the coding experience
            </p>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/anc9H7Q3oN8"
                ></iframe>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Coding Together?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join our community of developers and experience the future of collaborative coding.
          </p>
          <Link href="/signup">
            <Button size="lg">
              Create Your First Session <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
