"use client";
import React, { useState } from "react";
import TopicForm from "@/components/TopicForm";
import OutlineGenerator from "@/components/OutlineGenerator";
import ContentGenerator from "@/components/ContentGenerator";
import DocumentPreview from "@/components/DocumentPreview";
import RotatingMessages from "@/components/rotatingmessages";
import { AnimatePresence, motion as m } from "framer-motion";
import Link from "next/link";
import {
  ClipboardList,
  Pencil,
  FileText,
  FileDown,
  Loader,
  Check,
  Brain,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentOutline, Topic } from "@/lib/types";
import { generateAIOutline } from "@/lib/actions/outline";
import { toast } from "sonner";
import Image from "next/image";
import { GridBackground } from "@/components/ui/background";
import { Bricolage_Grotesque } from "next/font/google";
import { cn } from "@/lib/utils";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
const loadingMessages = [
  "Crafting your perfect document...",
  "Gathering research materials...",
  "Organizing your content...",
  "Applying academic formatting...",
  "Almost ready to present your work...",
];

const workflow = [
  { icon: ClipboardList, label: "Research Input", description: "Define your topic" },
  { icon: Pencil, label: "Outline Builder", description: "Structure your paper" },
  { icon: FileText, label: "Content Editor", description: "Generate content" },
  { icon: FileDown, label: "Export", description: "Download your paper" },
];

const Index = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [topicInfo, setTopicInfo] = useState<Topic | null>(null);
  const [documentOutline, setDocumentOutline] =
    useState<DocumentOutline | null>(null);

  const handleTopicSubmit = async (topic: Topic) => {
    setTopicInfo(topic);
    setLoading(true);
    try {
      const outline = await generateAIOutline(
        topic.mainTopic,
        topic.academicLevel || "undergraduate",
        topic.documentLength
      );
      setDocumentOutline(outline);
      setStep(2);
      toast.success("Outline generated successfully!");
    } catch (error: any) {
      console.error("Failed to generate outline:", error);
      toast.error(`Failed to generate outline: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOutlineUpdate = (outline: DocumentOutline) => {
    setDocumentOutline(outline);
  };

  const goToStep = (newStep: number) => {
    setStep(newStep);
  };

  const handleGenerateProgress = (progress: number) => {
    console.log(`Content generation progress: ${progress}%`);
  };

  const variants = {
    enter: { opacity: 0, y: 12 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  };

  const canNavigateToStep = (targetStep: number) => {
    if (targetStep === 1) return true;
    if (targetStep === 2 && documentOutline) return true;
    if (targetStep === 3 && documentOutline && topicInfo) return true;
    if (targetStep === 4 && documentOutline && topicInfo) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex bg-[#070707] text-foreground">

      {/* ─── Sidebar (Desktop) ─── */}
      <aside className="hidden md:flex flex-col w-[280px] shrink-0 border-r border-white/5 bg-[#0A0A0A] pt-24 pb-6 px-5 sticky top-0 h-screen">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-2.5 mb-10 px-auto">
          <Image src="/icon.png" alt="Logo" width={100} height={100} className="size-10 text-primary" />
          <span className={cn(bricolage.className, "font-bold text-white tracking-tight text-2xl")}>MindScript AI</span>
        </Link>

        {/* Step List */}
        <nav className="flex flex-col gap-0 flex-1 relative mt-4">
          {workflow.map((item, index) => {
            const stepNum = index + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            const isClickable = canNavigateToStep(stepNum);
            const isLast = index === workflow.length - 1;

            return (
              <div key={stepNum} className="flex flex-col">
                <button
                  onClick={() => isClickable && goToStep(stepNum)}
                  disabled={!isClickable}
                  className={`
                    group relative flex items-start gap-4 px-2 py-4 text-left transition-all duration-300
                    ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}
                  `}
                >
                  {/* Vertical Line */}
                  {!isLast && (
                    <m.div
                      initial={false}
                      animate={{ backgroundColor: isCompleted ? "var(--primary, #36A18B)" : "rgba(255,255,255,0.1)" }}
                      className="absolute left-[21px] top-[44px] w-[2px] h-[calc(100%-24px)] transition-colors duration-500"
                    />
                  )}

                  {/* Step Indicator (Circle) */}
                  <m.div
                    initial={false}
                    animate={{
                      backgroundColor: isActive || isCompleted ? "var(--primary, #36A18B)" : "transparent",
                      borderColor: isActive || isCompleted ? "var(--primary, #36A18B)" : "rgba(255,255,255,0.1)",
                      scale: isActive ? 1.1 : 1
                    }}
                    className={`
                      relative z-10 flex items-center justify-center size-[26px] rounded-full border-2 shrink-0 transition-shadow duration-500
                      ${isActive ? "shadow-[0_0_15px_rgba(54,161,139,0.4)]" : ""}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="size-3.5 text-black font-bold" />
                    ) : (
                      <span className={`text-[11px] font-bold ${isActive ? "text-black" : "text-white/30"}`}>
                        {stepNum}
                      </span>
                    )}
                  </m.div>

                  {/* Labels */}
                  <div className="flex flex-col min-w-0 pt-0.5">
                    <m.span
                      animate={{ color: isActive || isCompleted ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.3)" }}
                      className="text-sm font-semibold transition-colors duration-300"
                    >
                      {item.label}
                    </m.span>
                    <m.span
                      animate={{
                        color: isActive ? "var(--primary, #36A18B)" : "rgba(255,255,255,0.2)",
                        opacity: isActive ? 0.8 : 0.5
                      }}
                      className="text-[11px] mt-0.5 transition-colors duration-300"
                    >
                      {item.description}
                    </m.span>
                  </div>
                </button>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <p className="text-[11px] text-white/20 px-1">
            MindScriptAI • AI Research Generator
          </p>
        </div>
      </aside>

      {/* ─── Mobile Step Indicator ─── */}
      <div className="md:hidden fixed top-20 left-0 right-0 z-40 px-4 py-3 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {workflow.map((item, index) => {
            const stepNum = index + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            const Icon = item.icon;

            return (
              <button
                key={stepNum}
                onClick={() => canNavigateToStep(stepNum) && goToStep(stepNum)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all
                  ${isActive
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : isCompleted
                      ? "bg-white/5 text-white/60"
                      : "text-white/20"
                  }
                `}
              >
                {isCompleted ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 min-h-screen flex flex-col relative overflow-hidden">
        <GridBackground className="opacity-15" />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-[#070707]/90 backdrop-blur-sm">
            <div className="relative">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                <Loader className="size-8 text-primary animate-spin" />
              </div>
            </div>
            <div className="w-72 text-center">
              <RotatingMessages
                messages={loadingMessages}
                className="text-white/60 font-medium text-sm h-6"
              />
            </div>
            <div className="w-48 h-1 bg-white/5 rounded-full mt-6 overflow-hidden">
              <m.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "5%" }}
                animate={{ width: "90%" }}
                transition={{ duration: 15, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 pt-28 md:pt-24 pb-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <m.div
                  key="topic-form"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <TopicForm onSubmit={handleTopicSubmit} />
                </m.div>
              )}

              {step === 2 && documentOutline && (
                <m.div
                  key="outline-generator"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <OutlineGenerator
                    outline={documentOutline}
                    onOutlineUpdate={handleOutlineUpdate}
                    onBack={() => goToStep(1)}
                    onNext={() => goToStep(3)}
                  />
                </m.div>
              )}

              {step === 3 && documentOutline && topicInfo && (
                <m.div
                  key="content-generator"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <ContentGenerator
                    outline={documentOutline}
                    topicInfo={topicInfo}
                    onOutlineUpdate={handleOutlineUpdate}
                    onBack={() => goToStep(2)}
                    onNext={() => goToStep(4)}
                    onProgressUpdate={handleGenerateProgress}
                  />
                </m.div>
              )}

              {step === 4 && documentOutline && topicInfo && (
                <m.div
                  key="document-preview"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <DocumentPreview
                    outline={documentOutline}
                    topicInfo={topicInfo}
                    onBack={() => goToStep(3)}
                  />
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
