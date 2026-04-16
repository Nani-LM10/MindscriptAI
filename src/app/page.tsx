"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import IllustratedBento from '@/components/IllustratedBento';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  FileText,
  Sparkles,
  Brain,
  Zap,
  Clock,
  FileDown,
} from "lucide-react";
import { motion as m } from "motion/react";
import Image from "next/image";
import Aurora from "@/components/Aurora";
import { cn } from "@/lib/utils";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import { GridBackground } from "@/components/ui/background";
import { HoverBorderGradient } from "@/components/ui/HoverButton";

const inter = Inter({
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const PlusIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

// Features section data
const features = [
  {
    icon: Brain,
    title: "AI-Powered Research",
    description:
      "Leverage advanced AI to generate comprehensive research documents",
    content:
      "Our platform uses cutting-edge AI to analyze topics and generate well-structured research papers with proper citations and formatting.",
  },
  {
    icon: Sparkles,
    title: "Customizable Outlines",
    description:
      "Create and edit document outlines to match your specific needs",
    content:
      "Easily customize generated outlines by adding, removing, or rearranging sections and subtopics to perfectly fit your research requirements.",
  },
  {
    icon: FileText,
    title: "Export Options",
    description: "Download your research in multiple formats",
    content:
      "Export your completed research documents in various formats including PDF and DOCX, ready for submission or further editing.",
  },
];

// How It Works section data
const steps = [
  {
    number: "01",
    title: "Define Research",
    description: "Submit your topic and requirements. Our AI begins analyzing the scope.",
    icon: Brain,
  },
  {
    number: "02",
    title: "Refine Structure",
    description: "Review your generated outline. Add, remove, or edit sections with ease.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Instant Export",
    description: "Generate deep-researched content and export to PDF or DOCX formats.",
    icon: FileDown,
  },
];

// Benefits section data
const benefits = [
  {
    icon: Zap,
    title: "Save Time",
    description:
      "Generate comprehensive research documents in minutes instead of days or weeks",
  },
  {
    icon: Clock,
    title: "Always Available",
    description:
      "Access our platform 24/7 to generate research content whenever inspiration strikes",
  },
  {
    icon: FileText,
    title: "Professional Quality",
    description:
      "Generate well-structured, properly formatted documents ready for submission",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Leverage advanced AI to discover connections and insights you might have missed",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col w-full dark:bg-neutral-900">
      <Navbar />
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative w-full py-24 min-h-dvh flex flex-col items-center justify-center overflow-hidden bg-[#070707]">

        {/* Aurora Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Aurora
            colorStops={["#7cff67", "#B497CF", "#5227FF"]}
            amplitude={1}
            blend={0.5}
          />
          {/* Subtle overlay gradients to blend it better */}
          <div className="absolute inset-0 bg-transparent bg-gradient-to-b from-[#070707] via-transparent to-[#070707] opacity-60" />
          <div className="absolute inset-0 bg-transparent bg-gradient-to-r from-[#070707] via-transparent to-[#070707] opacity-40" />
        </div>

        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center pt-16">

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center max-w-5xl mx-auto space-y-"
          >
            <h1 className={cn(bricolage.className, "text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]")}>
              MindScript AI
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl font-normal leading-relaxed mt-4">
              Your All-In-One AI research agent<br className="hidden md:block" /> MindScript handles the grunt work reclaiming your time for real research.
            </p>

            <div className="pt-8">
              <Link href="/gen">
                <HoverBorderGradient
                  containerClassName="rounded-xl"
                  as="div"
                  className="text-primary flex items-center gap-2 px-8 py-4 text-lg font-semibold"
                >
                  Generate Now
                  <ArrowRight className="size-5" />
                </HoverBorderGradient>
              </Link>
            </div>
          </m.div>

          {/* Highly Micro-Interactive Bottom Component */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl mt-24 relative mx-auto group perspective-[2000px] hidden sm:block"
          >
            <m.div
              whileHover={{ rotateX: 2, rotateY: -1, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative rounded-2xl border border-border bg-[#0A0A0A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden aspect-[16/10] md:aspect-[16/9] flex flex-col will-change-transform"
            >

              {/* Fake UI Header */}
              <div className="h-14 border-b border-white/5 flex items-center px-4 bg-[#111111] shrink-0">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-border hover:bg-red-400 transition-colors cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-border hover:bg-amber-400 transition-colors cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-border hover:bg-green-400 transition-colors cursor-pointer"></div>
                </div>
                <div className="mx-auto flex items-center gap-2 px-4 py-1.5 bg-[#1A1A1A] rounded-md text-xs text-muted-foreground font-mono border border-white/5">
                  <FileText className="w-3 h-3" /> mindscript.md
                </div>
              </div>

              {/* Fake UI Body */}
              <div className="flex-1 flex overflow-hidden bg-[#0A0A0A]">
                {/* Sidebar */}
                <div className="w-64 border-r border-white/5 bg-[#0D0D0D] p-4 hidden md:flex flex-col gap-5">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Brain className="w-4 h-4" />
                    <span>MindScript</span>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 p-2 rounded-md bg-primary/10 border border-primary/20 text-primary text-sm cursor-pointer shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                      Generating abstract...
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 text-muted-foreground text-sm transition-colors cursor-pointer">
                      <div className="w-1.5 h-1.5 rounded-full bg-border"></div>
                      Literature analysis
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 text-muted-foreground text-sm transition-colors cursor-pointer">
                      <div className="w-1.5 h-1.5 rounded-full bg-border"></div>
                      Formatting tables
                    </div>
                  </div>

                  <div className="p-3 border border-white/5 bg-[#111111] rounded-lg shadow-inner">
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      &quot;Ensure the tone is academic and strictly follows APA citation guidelines.&quot;
                    </p>
                  </div>
                </div>

                {/* Editor Area (Animated) */}
                <div className="flex-1 p-8 overflow-hidden bg-[#0A0A0A] relative flex flex-col font-mono text-sm">

                  {/* Mock "typing" lines */}
                  <div className="max-w-2xl w-full flex flex-col gap-4">

                    <m.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "80%", opacity: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-6 bg-white/10 rounded-sm mb-4"
                    />

                    {/* Lines of text generating dynamically */}
                    {[...Array(5)].map((_, i) => (
                      <m.div
                        key={`line-${i}`}
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: `${85 - (i * 5 + Math.random() * 10)}%`, opacity: 1 }}
                        transition={{ duration: 2, delay: 1 + (i * 0.4), ease: "easeOut" }}
                        className="h-3 bg-white/5 rounded-sm"
                      />
                    ))}

                    {/* Mock Chart Appending */}
                    <m.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: 3.5, ease: "easeOut" }}
                      className="w-3/4 h-32 mt-4 bg-white/[0.02] border border-white/5 rounded-lg flex items-center justify-center relative overflow-hidden"
                    >
                      <Brain className="w-10 h-10 text-white/10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </m.div>

                    <m.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 4.5, duration: 0.5 }}
                      className="flex items-center gap-2 mt-4"
                    >
                      <div className="w-2 h-4 bg-primary animate-pulse" /> {/* Cursor */}
                      <span className="text-xs text-primary/70 font-sans">AI is writing...</span>
                    </m.div>

                  </div>

                  {/* Floating Context Panel (Micro-Interaction) */}
                  <m.div
                    className="absolute bottom-6 right-6 p-4 rounded-xl border border-white/10 bg-[#1A1A1A] shadow-2xl flex flex-col gap-2 max-w-[250px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={{ y: 20 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-white">Suggestion Applied</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Rewrote the introduction to better align with the primary research objective. Improved flow and syntax.
                    </p>
                  </m.div>
                </div>
              </div>
            </m.div>
          </m.div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full bg-black/80 relative overflow-hidden">
        <GridBackground />
        <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
          <IllustratedBento />
        </div>
      </section>

      {/* How It Works Section - Bento Grid Edition */}
      <section id="about" className="w-full py-20 bg-[#050505] relative overflow-hidden">
        <GridBackground />
        <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >

              <span className="relative inline-block px-4 py-2 text-3xl md:text-5xl border border-white/15 font-bold text-primary uppercase bg-primary/10">
                <PlusIcon className="absolute -top-3 -left-3 size-6 text-white/50" />
                <PlusIcon className="absolute -top-3 -right-3 size-6 text-white/50" />
                <PlusIcon className="absolute -bottom-3 -left-3 size-6 text-white/50" />
                <PlusIcon className="absolute -bottom-3 -right-3 size-6 text-white/50" />
                Workflow
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
                Simplicity in every step
              </h2>
            </m.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-full md:h-[600px]">
            {/* Step 1: Large Bento Card */}
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl border border-white/15 bg-[#0A0A0A] p-10 flex flex-col justify-between hover:border-primary/30 transition-colors duration-500 bg-black/80"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  <Brain className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">01. Define Research</h3>
                <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
                  Start by providing your core topic. Our AI engine instantly begins scanning academic databases to map out the scope and depth of your subject.
                </p>
              </div>

              {/* Decorative Visualization for Step 1 */}
              <div className="mt-12 relative h-40 w-full bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden p-4 font-mono text-[10px] text-primary/40 leading-tight">
                <div className="space-y-1">
                  <p className=""> &gt; Initializing MindScript core...</p>
                  <p className="text-white/20"> &gt; Analyzing topic semantic relationships...</p>
                  <p className=""> &gt; Fetching primary sources [2,492 matches]</p>
                  <p className="text-white/20"> &gt; Synthesizing high-level structure...</p>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse delay-75" />
                    <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse delay-150" />
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-0 pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
            </m.div>

            {/* Step 2: Top Right Bento Card */}
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-3xl border border-white/20 bg-[#0A0A0A] p-8 hover:border-primary/30 transition-colors duration-500 bg-black/80"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">02. Structure</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Review the layout. Drag, drop, and refine the outline to perfectly suit your narrative.
                </p>
              </div>

              {/* Decorative Visualization for Step 2 */}
              <div className="absolute bottom-6 right-6 w-24 h-24 opacity-40 group-hover:opacity-60 transition-opacity duration-500 rotate-12">
                <div className="w-full h-2 bg-primary/30 rounded-full mb-2" />
                <div className="w-3/4 h-2 bg-primary/30 rounded-full mb-2" />
                <div className="w-1/2 h-2 bg-primary/30 rounded-full" />
              </div>
            </m.div>

            {/* Step 3: Bottom Right Bento Card */}
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-3xl border border-white/15 bg-black/80 p-8 flex flex-col justify-between hover:border-primary/50 transition-colors duration-500"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(54,161,139,0.4)]">
                  <FileDown className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">03. Export</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Generate the full text and download in PDF or Word format instantly.
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-primary font-bold text-xs uppercase group-hover:gap-3 transition-all">
                Get Started <ArrowRight className="w-3 h-3" />
              </div>
            </m.div>
          </div>
        </div>
      </section>
    </div >
  );
};

export default Page;
