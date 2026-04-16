import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DocumentOutline, Topic } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  RefreshCw,
  Check,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateSectionContent, generateFullPaperContent } from "@/lib/actions/content";
import { toast } from "sonner";

/** Safely converts any content value to a displayable string */
const normalizeContent = (content: unknown): string | null => {
  if (content === null || content === undefined) return null;
  if (typeof content === "string") return content.trim() || null;
  if (Array.isArray(content)) {
    const joined = content
      .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
      .join("\n\n")
      .trim();
    return joined || null;
  }
  if (typeof content === "object") {
    // Handle { text: "..." } or { content: "..." } shapes
    const obj = content as Record<string, unknown>;
    const text = obj.text ?? obj.content ?? obj.body ?? obj.value;
    if (typeof text === "string") return text.trim() || null;
    return JSON.stringify(content);
  }
  return String(content).trim() || null;
};

interface ContentGeneratorProps {
  outline: DocumentOutline;
  topicInfo: Topic;
  onOutlineUpdate: (outline: DocumentOutline) => void;
  onProgressUpdate?: (progress: number) => void;
  onBack: () => void;
  onNext: () => void;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  outline,
  topicInfo,
  onOutlineUpdate,
  onProgressUpdate,
  onBack,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [localOutline, setLocalOutline] = useState<DocumentOutline>(outline);
  const [generatingMap, setGeneratingMap] = useState<Record<string, boolean>>({});
  const [progressPercentage, setProgressPercentage] = useState(0);

  // ✅ SECTION-BASED PROGRESS
  const selectedSections = useMemo(() =>
    outline.sections.filter((s) => s.isSelected),
    [outline.sections]);

  const totalSections = selectedSections.length;

  const sectionsWithContent = outline.sections.filter(
    (s) => s.content && s.content.length > 0
  ).length;

  useEffect(() => {
    if (!activeTab && selectedSections.length > 0) {
      setActiveTab(selectedSections[0].id);
    }

    setLocalOutline(outline);

    if (totalSections > 0) {
      const progress = Math.round((sectionsWithContent / totalSections) * 100);
      setProgressPercentage(progress);
      onProgressUpdate?.(progress);
    }
  }, [outline, activeTab, totalSections, sectionsWithContent, onProgressUpdate, selectedSections]);

  // ⚠️ OPTIONAL: regenerate full section (not subtopic anymore)
  const generateSingleSection = async (sectionId: string) => {
    const section = localOutline.sections.find((s) => s.id === sectionId);
    if (!section) return;

    setGeneratingMap((prev) => ({ ...prev, [sectionId]: true }));

    try {
      const content = await generateSectionContent(
        localOutline.mainTopic,
        section.title,
        section.subtopics.map((st) => st.title),
        topicInfo.academicLevel || "undergraduate"
      );

      const updatedOutline = {
        ...localOutline,
        sections: localOutline.sections.map((s) =>
          s.id === sectionId ? { ...s, content } : s
        ),
      };

      setLocalOutline(updatedOutline);
      onOutlineUpdate(updatedOutline);

      toast.success(`Generated: "${section.title}"`);
    } catch {
      toast.error("Failed to generate content.");
    } finally {
      setGeneratingMap((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  // 🚀 MAIN GENERATE ALL
  const generateAllContent = async () => {
    setGeneratingMap({ all: true });
    setProgressPercentage(10);

    try {
      const activeSections = localOutline.sections
        .filter((s) => s.isSelected)
        .map((s) => ({
          id: s.id,
          title: s.title,
          subtopics: s.subtopics
            .filter((st) => st.isSelected)
            .map((st) => st.title),
        }));

      const contentMapping = await generateFullPaperContent(
        localOutline.mainTopic,
        activeSections,
        topicInfo.academicLevel || "undergraduate"
      );

      const updatedOutline = {
        ...localOutline,
        sections: localOutline.sections.map((s) => ({
          ...s,
          content: contentMapping[s.id] || s.content,
        })),
      };

      setLocalOutline(updatedOutline);
      onOutlineUpdate(updatedOutline);

      setProgressPercentage(100);
      onProgressUpdate?.(100);

      toast.success("All content generated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate content.");
    } finally {
      setGeneratingMap({});
    }
  };

  const isGenerating = Object.values(generatingMap).some(Boolean);
  const allContentGenerated =
    sectionsWithContent === totalSections && totalSections > 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Generate Content
          </h1>
          <p className="text-sm text-white/40">
            {allContentGenerated
              ? "All content has been generated"
              : "Generate AI content for each section"}
          </p>
        </div>

        <Button
          onClick={generateAllContent}
          disabled={isGenerating || allContentGenerated}
          className={cn(
            "shrink-0 rounded-xl gap-2 font-medium",
            allContentGenerated
              ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20"
              : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="size-4 animate-spin" /> Generating...
            </>
          ) : allContentGenerated ? (
            <>
              <Check className="size-4" /> Complete
            </>
          ) : (
            <>
              <Zap className="size-4" /> Generate All
            </>
          )}
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/30 font-mono">
            {sectionsWithContent}/{totalSections} sections
          </span>
          <span className="text-xs text-white/30 font-mono">
            {progressPercentage}%
          </span>
        </div>

        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-white/5 overflow-x-auto no-scrollbar">
            <TabsList className="flex h-auto p-0 bg-transparent w-max min-w-full">
              {selectedSections.map((section, i) => {
                const hasContent = section.content;
                return (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className={cn(
                      "px-5 py-3 text-sm",
                      hasContent
                        ? "text-emerald-400"
                        : "text-white/30"
                    )}
                  >
                    {i + 1}. {section.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Content */}
          {selectedSections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="p-6">
              <div className="space-y-4">
                {/* Section Title */}
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">
                    {section.title}
                  </h2>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateSingleSection(section.id)}
                    disabled={isGenerating}
                  >
                    {generatingMap[section.id] ? (
                      <RefreshCw className="size-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="size-4 mr-1" />
                        Regenerate
                      </>
                    )}
                  </Button>
                </div>

                {/* Section Content */}
                <div className="text-white/70 leading-relaxed space-y-3">
                  {(() => {
                    const text = normalizeContent(section.content);
                    if (!text) {
                      return (
                        <div className="text-white/30 text-sm flex items-center gap-2">
                          <FileText className="size-4" />
                          No content yet
                        </div>
                      );
                    }
                    return text.split("\n\n").map((p, i) => (
                      <p key={i}>{p}</p>
                    ));
                  })()}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-8">
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>

        <Button
          onClick={onNext}
          disabled={!allContentGenerated}
        >
          Next <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContentGenerator;