import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Trash2,
  MoveUp,
  MoveDown,
  Save,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { DocumentOutline, Section } from "@/lib/types";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "framer-motion";

interface OutlineGeneratorProps {
  outline: DocumentOutline;
  onOutlineUpdate: (outline: DocumentOutline) => void;
  onBack: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

const OutlineGenerator: React.FC<OutlineGeneratorProps> = ({
  outline,
  onOutlineUpdate,
  onBack,
  onNext,
  isLoading = false,
}) => {
  const [localOutline, setLocalOutline] = useState<DocumentOutline>(outline);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingSubtopic, setEditingSubtopic] = useState<{ sectionId: string; subtopicId: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  // ✅ Sync outline safely
  useEffect(() => {
    setLocalOutline(outline);

    const expanded: Record<string, boolean> = {};
    outline.sections.forEach((s) => (expanded[s.id] = true));
    setExpandedSections(expanded);
  }, [outline]);

  const update = (updated: DocumentOutline) => {
    setLocalOutline(updated);
    onOutlineUpdate(updated);
  };

  // ─── TOGGLES ─────────────────────────────────

  const toggleSection = (sectionId: string) => {
    const sections = localOutline.sections.map((s) => {
      if (s.id !== sectionId) return s;

      const isSelected = !s.isSelected;

      return {
        ...s,
        isSelected,
        subtopics: s.subtopics.map((st) => ({
          ...st,
          isSelected: isSelected ? st.isSelected : false,
        })),
      };
    });

    update({ ...localOutline, sections });
  };

  const toggleSubtopic = (sectionId: string, subtopicId: string) => {
    const sections = localOutline.sections.map((s) => {
      if (s.id !== sectionId) return s;

      const subtopics = s.subtopics.map((st) =>
        st.id === subtopicId ? { ...st, isSelected: !st.isSelected } : st
      );

      return {
        ...s,
        isSelected: subtopics.some((st) => st.isSelected),
        subtopics,
      };
    });

    update({ ...localOutline, sections });
  };

  const toggleExpansion = (sectionId: string) =>
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));

  // ─── ADD ─────────────────────────────────

  const addSection = () => {
    const newSection: Section = {
      id: nanoid(5),
      title: "New Section",
      isSelected: true,
      subtopics: [
        {
          id: nanoid(5),
          title: "New Subtopic",
          isSelected: true,
          content: "",
        },
      ],
    };

    update({
      ...localOutline,
      sections: [...localOutline.sections, newSection],
    });

    setExpandedSections((prev) => ({
      ...prev,
      [newSection.id]: true,
    }));
  };

  const addSubtopic = (sectionId: string) => {
    const sections = localOutline.sections.map((s) =>
      s.id === sectionId
        ? {
          ...s,
          subtopics: [
            ...s.subtopics,
            {
              id: nanoid(5),
              title: "New Subtopic",
              isSelected: true,
              content: "",
            },
          ],
        }
        : s
    );

    update({ ...localOutline, sections });
  };

  // ─── EDIT ─────────────────────────────────

  const saveSection = () => {
    if (!editingSection) return;

    const sections = localOutline.sections.map((s) =>
      s.id === editingSection ? { ...s, title: editValue } : s
    );

    update({ ...localOutline, sections });
    setEditingSection(null);
  };

  const saveSubtopic = () => {
    if (!editingSubtopic) return;

    const sections = localOutline.sections.map((s) =>
      s.id === editingSubtopic.sectionId
        ? {
          ...s,
          subtopics: s.subtopics.map((st) =>
            st.id === editingSubtopic.subtopicId
              ? { ...st, title: editValue }
              : st
          ),
        }
        : s
    );

    update({ ...localOutline, sections });
    setEditingSubtopic(null);
  };

  // ─── DELETE ─────────────────────────────────

  const deleteSection = (sectionId: string) => {
    update({
      ...localOutline,
      sections: localOutline.sections.filter((s) => s.id !== sectionId),
    });
  };

  const deleteSubtopic = (sectionId: string, subtopicId: string) => {
    const sections = localOutline.sections.map((s) => {
      if (s.id !== sectionId || s.subtopics.length <= 1) return s;

      const subtopics = s.subtopics.filter((st) => st.id !== subtopicId);

      return {
        ...s,
        isSelected: subtopics.some((st) => st.isSelected),
        subtopics,
      };
    });

    update({ ...localOutline, sections });
  };

  // ─── MOVE ─────────────────────────────────

  const moveSection = (sectionId: string, dir: number) => {
    const i = localOutline.sections.findIndex((s) => s.id === sectionId);
    if (i < 0 || i + dir < 0 || i + dir >= localOutline.sections.length) return;

    const sections = [...localOutline.sections];
    [sections[i], sections[i + dir]] = [sections[i + dir], sections[i]];

    update({ ...localOutline, sections });
  };

  const moveSubtopic = (sectionId: string, subtopicId: string, dir: number) => {
    const sections = localOutline.sections.map((s) => {
      if (s.id !== sectionId) return s;

      const i = s.subtopics.findIndex((st) => st.id === subtopicId);
      if (i < 0 || i + dir < 0 || i + dir >= s.subtopics.length) return s;

      const subtopics = [...s.subtopics];
      [subtopics[i], subtopics[i + dir]] = [subtopics[i + dir], subtopics[i]];

      return { ...s, subtopics };
    });

    update({ ...localOutline, sections });
  };

  const anySectionSelected = localOutline.sections.some((s) => s.isSelected);

  // ─── UI ─────────────────────────────────

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Research Outline
          </h1>
          <p className="text-sm text-white/40">
            Review and customize your AI-generated document structure
          </p>
        </div>
      </div>

      {/* Topic */}
      <div className="mb-6 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg inline-flex items-center gap-2">
        <span className="text-sm font-medium text-primary">
          {localOutline.mainTopic}
        </span>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        <AnimatePresence>
          {localOutline.sections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-white/10 bg-white/[0.03]"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <button onClick={() => toggleSection(section.id)}>
                  <Check className={section.isSelected ? "text-primary" : "text-white/30"} />
                </button>

                <span className="flex-1 text-sm font-semibold text-white">
                  {i + 1}. {section.title}
                </span>

                <button onClick={() => toggleExpansion(section.id)}>
                  {expandedSections[section.id] ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {/* Subtopics */}
              {expandedSections[section.id] && (
                <div className="px-4 pb-3">
                  {section.subtopics.map((st, j) => (
                    <div key={st.id} className="text-sm text-white/60 py-1">
                      {i + 1}.{j + 1} {st.title}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button onClick={onBack}>
          <ArrowLeft /> Back
        </Button>

        <Button onClick={onNext} disabled={!anySectionSelected}>
          Continue <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default OutlineGenerator;