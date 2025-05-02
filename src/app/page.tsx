"use client"
import { authConfig } from "@/auth";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/ui/dark-mode-toggle";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import { ArrowRight, Code, Users, Zap, CheckCircle, Cpu } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  useEffect(() => {
    (async () => {
      console.log(await getSession())
    })()
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Code Together, Build Together
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Real-time collaborative coding with AI-powered assistance and instant code execution
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Real-time Collaboration */}
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
            <Users className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Real-time Collaboration</h3>
            <p className="text-gray-300">
              Code together with your team in real-time. See everyone's cursors and changes instantly with our Yjs-powered CRDT system.
            </p>
          </div>

          {/* AI Assistance */}
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
            <Cpu className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">AI-Powered Assistance</h3>
            <p className="text-gray-300">
              Get intelligent code suggestions and recommendations from Devin AI, helping you write better code faster.
            </p>
          </div>

          {/* Multi-language Support */}
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
            <Code className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Multi-language Support</h3>
            <p className="text-gray-300">
              Switch between multiple programming languages seamlessly. Python, JavaScript, and more - all with real-time execution.
            </p>
          </div>

          {/* Custom Judge */}
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
            <CheckCircle className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Custom Code Judge</h3>
            <p className="text-gray-300">
              Test your code against custom test cases with our built-in judge system. Get instant feedback on your solutions.
            </p>
          </div>

          {/* Real-time Broadcasting */}
          <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
            <Zap className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Real-time Broadcasting</h3>
            <p className="text-gray-300">
              Every code submission is instantly broadcasted to all session participants, keeping everyone in sync.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Coding Together?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community of developers and experience the future of collaborative coding.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Create Your First Session <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
