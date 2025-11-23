"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart2, Brain, Code, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background">

      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-8 px-4 py-24 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 backdrop-blur-sm border border-blue-500/20">
            Now in Public Beta
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-400">
            Master the Markets with <br className="hidden sm:inline" />
            <span className="text-blue-500">Agentic AI</span>
          </h1>
          <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Build, test, and deploy custom trading strategies with the power of AI.
            Real-time charts, Pine Script integration, and intelligent market insights.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-4"
        >
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25">
              Launch Platform <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="backdrop-blur-sm bg-background/50">
            View Documentation
          </Button>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 py-12 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<BarChart2 className="h-8 w-8 text-blue-400" />}
            title="Real-time Charts"
            description="Advanced TradingView charts with sub-millisecond updates and smooth rendering."
            delay={0.3}
          />
          <FeatureCard
            icon={<Code className="h-8 w-8 text-purple-400" />}
            title="Pine Script Support"
            description="Write, compile, and visualize custom indicators directly in the browser."
            delay={0.4}
          />
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-pink-400" />}
            title="AI Analysis"
            description="Get instant market insights and strategy optimization tips from our AI agent."
            delay={0.5}
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-yellow-400" />}
            title="Lightning Fast"
            description="Built on Next.js 14 for unparalleled performance and SEO optimization."
            delay={0.6}
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border-white/5 hover:border-blue-500/50 transition-colors">
        <CardHeader>
          <div className="mb-4 inline-block rounded-lg bg-white/5 p-3 w-fit">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}
