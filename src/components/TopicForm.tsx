import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRightIcon, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Topic } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface TopicFormProps {
  onSubmit: (topic: Topic) => void;
}

const TopicForm: React.FC<TopicFormProps> = ({ onSubmit }) => {
  const [mainTopic, setMainTopic] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [documentLength, setDocumentLength] = useState<number>(8);
  const [outputFormat, setOutputFormat] = useState<"DOCX" | "PDF">("DOCX");
  const [academicLevel, setAcademicLevel] = useState("Undergraduate");
  const [images, setImages] = useState<"none" | "1-per-page" | "2-per-page">("none");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [additionalPreferences, setAdditionalPreferences] = useState<string[]>([]);

  const togglePreference = (pref: string) => {
    setAdditionalPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const preferences = ["Paragraphs", "Bullet Points", "Detailed", "Concise", "Tables"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainTopic.trim()) return;

    onSubmit({
      mainTopic,
      documentLength,
      outputFormat,
      topicDescription,
      academicLevel,
      additionalPreferences,
      images,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Hero Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
          What would you like to research?
        </h1>
        <p className="text-base text-white/40 leading-relaxed">
          Enter your research topic and we&apos;ll generate a comprehensive, well-structured paper for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Topic Input — Hero-sized */}
        <div className="space-y-2">
          <Input
            id="topic"
            placeholder="e.g. The impact of artificial intelligence on modern healthcare"
            value={mainTopic}
            onChange={(e) => setMainTopic(e.target.value)}
            required
            className="w-full h-14 text-base md:text-lg bg-white/5 border-white/10 rounded-xl px-5 text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Textarea
            id="description"
            placeholder="Add more context or specific aspects you want to focus on (optional)"
            value={topicDescription}
            onChange={(e) => setTopicDescription(e.target.value)}
            rows={3}
            className="resize-none bg-white/5 border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20 min-h-[80px] transition-all"
          />
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors py-1"
        >
          {showAdvanced ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          Advanced options
        </button>

        {/* Advanced Options */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-6 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length" className="text-sm text-white/50 font-medium">
                      Document Length
                    </Label>
                    <Select
                      value={documentLength.toString()}
                      onValueChange={(value) => setDocumentLength(parseInt(value))}
                    >
                      <SelectTrigger id="length" className="w-full bg-white/5 border-white/10 rounded-xl text-white h-11 transition-all focus:border-primary/50">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">Short (1-2 pages)</SelectItem>
                        <SelectItem value="8">Medium (3-5 pages)</SelectItem>
                        <SelectItem value="10">Long (6-10 pages)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="images" className="text-sm text-white/50 font-medium">
                      Images
                    </Label>
                    <Select
                      value={images}
                      onValueChange={(val: "none" | "1-per-page" | "2-per-page") => setImages(val)}
                    >
                      <SelectTrigger id="images" className="w-full bg-white/5 border-white/10 rounded-xl text-white h-11 transition-all focus:border-primary/50">
                        <SelectValue placeholder="Select image count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Images</SelectItem>
                        <SelectItem value="1-per-page">1 per Page</SelectItem>
                        <SelectItem value="2-per-page">2 per Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level" className="text-sm text-white/50 font-medium">
                      Academic Level
                    </Label>
                    <Select value={academicLevel} onValueChange={setAcademicLevel}>
                      <SelectTrigger id="level" className="w-full bg-white/5 border-white/10 rounded-xl text-white h-11 transition-all focus:border-primary/50">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                        <SelectItem value="Doctoral">Doctoral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                </div>

                {/* Additional Preferences */}
                <div className="space-y-3">
                  <Label className="text-sm text-white/50 font-medium">
                    Additional Preferences
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {preferences.map((pref) => {
                      const isSelected = additionalPreferences.includes(pref);
                      return (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => togglePreference(pref)}
                          className={`group relative flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 ${isSelected
                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(54,161,139,0.1)]"
                            : "bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                            }`}
                        >
                          <span className="text-sm font-medium">{pref}</span>
                          <div
                            className={`size-2 rounded-full border-2 transition-all duration-300 ${isSelected
                              ? "bg-primary border-primary scale-110 shadow-[0_0_8px_rgba(54,161,139,0.5)]"
                              : "bg-transparent border-white/20"
                              }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Submit */}
        <div className="pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={!mainTopic.trim()}
            className="w-full sm:w-auto rounded-xl px-8 py-6 text-base font-semibold bg-primary text-white hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed gap-2"
          >
            <Sparkles className="size-4" />
            Generate Outline
            <ArrowRightIcon size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TopicForm;
