import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileSearch,
    FileDown,
    LayoutGrid,
    ShieldCheck,
    ArrowUpRight,
    FileText,
    Search,
    CheckCircle2,
    Download,
    Layers,
    Sparkles,
    RefreshCw,
    Scan
} from "lucide-react";
import { cn } from "../lib/utils";

// --- Base Bento Card ---
interface BentoCardProps {
    children?: React.ReactNode;
    className?: string;
    title: string;
    description: string;
    icon: React.ElementType;
}
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
const BentoCard: React.FC<BentoCardProps> = ({ children, className, title, description, icon: Icon }) => {
    return (
        <motion.div
            whileHover="hover"
            initial="initial"
            className={cn(
                "group relative flex flex-col justify-between overflow-hidden bg-neutral-950 border border-neutral-800 p-6 rounded-3xl",
                "hover:border-neutral-600 transition-colors duration-500",
                className
            )}
        >
            {/* Illustration Area */}
            <div className="relative h-55 w-full mb-4 overflow-hidden rounded-2xl bg-neutral-900/50 border border-neutral-800/50">
                {children}
            </div>

            {/* Content */}
            <div className="z-10 relative">
                <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-sm border border-white/10">
                        <Icon size={16} />
                    </div>
                    <h3 className="font-bold text-white text-lg tracking-tight">{title}</h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
            </div>

            {/* Hover Arrow */}
            <motion.div
                variants={{
                    initial: { opacity: 0, x: -10, y: 10 },
                    hover: { opacity: 1, x: 0, y: 0 },
                }}
                className="absolute top-6 right-6 text-neutral-500 group-hover:text-white transition-colors"
            >
                <ArrowUpRight size={20} />
            </motion.div>
        </motion.div>
    );
};

// --- 1. Auto Research Composer ---
const ResearchComposerIllustration = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full p-4">
                {/* Central Document */}
                <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl z-10 p-3"
                    variants={{ hover: { scale: 1.05, rotate: -2 } }}
                >
                    <div className="space-y-2">
                        <div className="h-1.5 w-3/4 bg-neutral-600 rounded-full" />
                        <div className="h-1.5 w-full bg-neutral-700 rounded-full" />
                        <div className="h-1.5 w-5/6 bg-neutral-700 rounded-full" />
                        <div className="h-1.5 w-full bg-neutral-700 rounded-full" />
                        <div className="h-1.5 w-1/2 bg-neutral-600 rounded-full" />
                    </div>

                    {/* AI Writing Effect */}
                    <motion.div
                        className="absolute bottom-4 left-3 right-3 h-1.5 bg-blue-500/50 rounded-full overflow-hidden"
                        variants={{ hover: { opacity: 1 } }}
                        initial={{ opacity: 0 }}
                    >
                        <motion.div
                            className="h-full bg-blue-400"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>
                </motion.div>

                {/* Floating Data Nodes */}
                {[
                    { icon: Search, color: "text-blue-400", x: -150, y: -40, delay: 0 },
                    { icon: Sparkles, color: "text-purple-400", x: 160, y: -20, delay: 0.2 },
                    { icon: FileText, color: "text-green-400", x: -150, y: 50, delay: 0.4 },
                    { icon: RefreshCw, color: "text-orange-400", x: 170, y: 40, delay: 0.6 },
                ].map((node, i) => (
                    <motion.div
                        key={i}
                        className={cn("absolute left-1/2 top-1/2 p-2 rounded-full bg-neutral-900 border border-neutral-700 shadow-lg", node.color)}
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        variants={{
                            hover: {
                                x: node.x,
                                y: node.y,
                                opacity: 1,
                                transition: { delay: node.delay, type: "spring", stiffness: 100 }
                            }
                        }}
                    >
                        <node.icon size={14} />
                        {/* Connection Line */}
                        <svg className="absolute top-1/2 left-1/2 -z-10 overflow-visible">
                            <motion.line
                                x1="0" y1="0"
                                x2={-node.x} y2={-node.y}
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                initial={{ pathLength: 0, opacity: 0 }}
                                variants={{ hover: { pathLength: 1, opacity: 0.2 } }}
                            />
                        </svg>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// --- 2. Export PDF/DOCX ---
const ExportIllustration = () => {
    const [isExporting, setIsExporting] = useState(false);

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/30">
            <div className="relative flex flex-col items-center gap-4">
                {/* File Icon */}
                <motion.div
                    className="relative w-20 h-24 bg-white rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    variants={{
                        hover: { y: -10, scale: 1.1 }
                    }}
                >
                    <div className="absolute top-0 right-0 w-6 h-6 bg-neutral-200 rounded-bl-lg" />
                    <FileDown className="text-neutral-900" size={32} />

                    {/* Format Badges */}
                    <motion.div
                        className="absolute -bottom-2 -right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg"
                        variants={{ hover: { x: 5, opacity: 1 } }}
                        initial={{ opacity: 0 }}
                    >
                        PDF
                    </motion.div>
                    <motion.div
                        className="absolute -bottom-2 -left-4 bg-blue-400 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg"
                        variants={{ hover: { x: -5, opacity: 1 } }}
                        initial={{ opacity: 0 }}
                    >
                        DOCX
                    </motion.div>
                </motion.div>

                {/* Progress Bar */}
                <div className="w-40 h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                    <motion.div
                        className="h-full bg-blue-500"
                        variants={{
                            hover: { width: "100%", transition: { duration: 2, ease: "easeInOut" } }
                        }}
                        initial={{ width: "0%" }}
                    />
                </div>

                {/* Success Check */}
                <motion.div
                    className="absolute -top-4 -right-4 text-primary"
                    variants={{
                        hover: { scale: [0, 1.2, 1], opacity: 1, transition: { delay: 1.8 } }
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                >
                    <CheckCircle2 size={24} fill="currentColor" className="text-black" />
                </motion.div>
            </div>
        </div>
    );
};

// --- 3. Structured Sections ---
const StructuredSectionsIllustration = () => {
    return (
        <div className="absolute inset-0 p-6 flex flex-col gap-3">
            {[
                { width: "w-full", color: "bg-neutral-800", delay: 0 },
                { width: "w-3/4", color: "bg-blue-500/20", delay: 0.1, border: "border-blue-500/50" },
                { width: "w-full", color: "bg-neutral-800", delay: 0.2 },
                { width: "w-5/6", color: "bg-purple-500/20", delay: 0.3, border: "border-purple-500/50" },
            ].map((section, i) => (
                <motion.div
                    key={i}
                    className={cn(
                        "h-8 rounded-lg border border-neutral-700 flex items-center px-3 gap-2",
                        section.color,
                        section.border
                    )}
                    initial={{ x: -20, opacity: 0 }}
                    variants={{
                        hover: {
                            x: 0,
                            opacity: 1,
                            transition: { delay: section.delay, type: "spring" }
                        }
                    }}
                >
                    <div className="w-2 h-2 rounded-full bg-neutral-600" />
                    <div className={cn("h-1.5 bg-neutral-600/50 rounded-full", section.width)} />

                    {/* Drag Handle Effect */}
                    <div className="ml-auto flex flex-col gap-0.5 opacity-30">
                        <div className="w-3 h-0.5 bg-white" />
                        <div className="w-3 h-0.5 bg-white" />
                    </div>
                </motion.div>
            ))}

            {/* Floating Layout Icon */}
            <motion.div
                className="absolute bottom-4 right-4 p-3 bg-white text-black rounded-xl shadow-2xl"
                variants={{
                    hover: {
                        scale: 1.1,
                        rotate: [0, -10, 10, 0],
                        transition: { delay: 0.5 }
                    }
                }}
            >
                <Layers size={20} />
            </motion.div>
        </div>
    );
};

// --- 4. Plagiarism Remover ---
const PlagiarismIllustration = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="relative w-full h-full bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden p-4">
                {/* Text Content */}
                <div className="space-y-3">
                    {[
                        { text: "Original research indicates that...", color: "text-neutral-400" },
                        { text: "This specific phrase is copied.", color: "text-red-400", highlight: true },
                        { text: "Further analysis shows significant...", color: "text-neutral-400" },
                        { text: "Another duplicate found here.", color: "text-red-400", highlight: true },
                    ].map((line, i) => (
                        <div key={i} className="relative">
                            <motion.p
                                className={cn("text-[10px] font-mono", line.color)}
                                variants={{
                                    hover: line.highlight ? { color: "#4ade80", transition: { delay: 1 } } : {}
                                }}
                            >
                                {line.text}
                            </motion.p>
                            {line.highlight && (
                                <motion.div
                                    className="absolute inset-0 bg-red-500/10 rounded"
                                    variants={{
                                        hover: { opacity: 0, transition: { delay: 1 } }
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Scanning Beam */}
                <motion.div
                    className="absolute inset-x-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20"
                    variants={{
                        hover: {
                            top: ["0%", "100%", "0%"],
                            transition: { duration: 2, repeat: Infinity, ease: "linear" }
                        }
                    }}
                    initial={{ top: "0%" }}
                />

                {/* Scanner Icon */}
                <motion.div
                    className="absolute top-2 right-2 text-blue-400"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Scan size={16} />
                </motion.div>
            </div>
        </div>
    );
};

// --- Main Grid ---
export default function IllustratedBento() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
                    Powerful Research
                    <span className="relative inline-block px-4 py-2 text-3xl md:text-5xl border border-white/20 font-bold text-primary uppercase bg-primary/10">
                        <PlusIcon className="absolute -top-3 -left-3 size-6 text-white/50" />
                        <PlusIcon className="absolute -top-3 -right-3 size-6 text-white/50" />
                        <PlusIcon className="absolute -bottom-3 -left-3 size-6 text-white/50" />
                        <PlusIcon className="absolute -bottom-3 -right-3 size-6 text-white/50" />
                        Toolkit
                    </span>
                </h2>
                <p className="text-neutral-400 max-w-2xl mx-auto">
                    Experience high-fidelity tools designed to streamline your academic and professional writing workflow with intelligent automation.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[400px]">
                {/* Auto Research Composer */}
                <BentoCard
                    title="Auto Research Composer"
                    description="Synthesize complex data into structured research papers automatically using advanced AI models."
                    icon={FileSearch}
                    className="md:col-span-7"
                >
                    <ResearchComposerIllustration />
                </BentoCard>

                {/* Export PDF/DOCX */}
                <BentoCard
                    title="Export PDF/DOCX"
                    description="Seamlessly export your research in professional formats with one click, maintaining all citations and styles."
                    icon={FileDown}
                    className="md:col-span-5"
                >
                    <ExportIllustration />
                </BentoCard>

                {/* Structured Sections */}
                <BentoCard
                    title="Structured Sections"
                    description="Organize your thoughts into logical, coherent sections that improve readability and flow."
                    icon={LayoutGrid}
                    className="md:col-span-5"
                >
                    <StructuredSectionsIllustration />
                </BentoCard>

                {/* Plagiarism Remover */}
                <BentoCard
                    title="Plagiarism Remover"
                    description="Ensure original content with our intelligent scanning and rewriting engine that maintains your unique voice."
                    icon={ShieldCheck}
                    className="md:col-span-7"
                >
                    <PlagiarismIllustration />
                </BentoCard>
            </div>
        </div>
    );
}
