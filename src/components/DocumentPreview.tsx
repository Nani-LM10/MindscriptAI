import React from "react";
import { Button } from "@/components/ui/button";
import { exportDocument } from "@/lib/utils";
import { ArrowLeft, FileText, FileBox, Download, BookOpen, Calendar, User, Building } from "lucide-react";
import { DocumentOutline, Topic } from "@/lib/types";

interface DocumentPreviewProps {
  outline: DocumentOutline;
  topicInfo: Topic;
  onBack: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  outline,
  topicInfo,
  onBack,
}) => {
  const handleExport = (format: "DOCX" | "PDF") => {
    exportDocument(outline, format, topicInfo);
  };

  const selectedSections = outline.sections
    .filter((s) => s.isSelected)
    .map((s) => ({ ...s, subtopics: s.subtopics.filter((st) => st.isSelected) }));

  const totalWords = selectedSections
    .flatMap((s) => s.subtopics)
    .reduce((acc, st) => acc + st.content.split(" ").length, 0);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Document Preview</h1>
          <p className="text-sm text-white/40">Your research paper is ready to export</p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => handleExport("PDF")}
            className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white rounded-xl gap-2 text-sm"
          >
            <FileBox className="size-4" />
            PDF
          </Button>
          <Button
            onClick={() => handleExport("DOCX")}
            className="bg-primary text-white hover:bg-primary/90 rounded-xl gap-2 text-sm"
          >
            <Download className="size-4" />
            Download DOCX
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Sections", value: selectedSections.length },
          { label: "Subtopics", value: selectedSections.flatMap((s) => s.subtopics).length },
          { label: "Est. Words", value: totalWords.toLocaleString() },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Paper Preview */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        {/* Paper Header Bar */}
        <div className="border-b border-white/5 px-6 py-3 flex items-center gap-2">
          <BookOpen className="size-4 text-white/20" />
          <span className="text-xs text-white/30 font-mono">{outline.mainTopic}.pdf</span>
        </div>

        {/* Scrollable Content - Styled as white paper */}
        <div className="overflow-y-auto max-h-[550px]">
          <div className="mx-6 my-6 bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden">
            {/* Cover Page */}
            <div className="px-12 py-16 text-center border-b border-gray-100">
              <div className="w-12 h-0.5 bg-gray-300 mx-auto mb-8" />
              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{outline.mainTopic}</h1>
              {topicInfo?.academicLevel && (
                <p className="text-sm text-gray-500 mb-8">{topicInfo.academicLevel} Level Research Paper</p>
              )}
              <div className="w-12 h-0.5 bg-gray-200 mx-auto mb-10" />
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <User className="size-3.5" />
                  <span>Student Name</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Building className="size-3.5" />
                  <span>University Name</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="size-3.5" />
                  <span>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="px-12 py-10 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs text-gray-400">Table of Contents</h2>
              <div className="space-y-3">
                {selectedSections.map((section, si) => (
                  <div key={section.id}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-gray-700">{si + 1}. {section.title}</span>
                      <span className="text-gray-300 text-xs">{si + 3}</span>
                    </div>
                    {section.subtopics.map((st, sti) => (
                      <div key={st.id} className="flex items-center justify-between pl-5 mt-1">
                        <span className="text-xs text-gray-400">{si + 1}.{sti + 1} {st.title}</span>
                        <span className="text-gray-300 text-xs">{si + 3}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Content Sections */}
            <div className="px-12 py-10 space-y-10">
              {selectedSections.map((section, si) => (
                <div key={section.id}>
                  <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                    {si + 1}. {section.title}
                  </h2>
                  <div className="space-y-8">
                    {section.content ? (
                      <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                        {section.content.split("\n\n").map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                    ) : (
                      section.subtopics.map((subtopic, sti) => (
                        <div key={subtopic.id}>
                          <h3 className="text-base font-semibold text-gray-800 mb-3">
                            {si + 1}.{sti + 1} {subtopic.title}
                          </h3>
                          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                            {subtopic.content.split("\n\n").map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/5">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-white/40 hover:text-white hover:bg-white/5 gap-2 rounded-xl"
        >
          <ArrowLeft className="size-4" /> Back to Content
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport("PDF")}
            className="bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white rounded-xl gap-2"
          >
            <FileBox className="size-4" /> Download PDF
          </Button>
          <Button
            onClick={() => handleExport("DOCX")}
            className="bg-primary text-white hover:bg-primary/90 rounded-xl gap-2"
          >
            <FileText className="size-4" /> Download DOCX
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
