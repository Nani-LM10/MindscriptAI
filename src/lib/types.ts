export interface Topic {
  mainTopic: string;
  documentLength: number;
  outputFormat: "DOCX" | "PDF";
  topicDescription?: string;
  citationFormat?: string;
  academicLevel?: string;
  additionalPreferences?: string[];
  images?: "none" | "1-per-page" | "2-per-page";
}

export interface SubTopic {
  id: string;
  title: string;
  isSelected: boolean;
  content: string;
}

export interface Section {
  id: string;
  title: string;
  isSelected: boolean;
  subtopics: SubTopic[];
  content?: string;
}

export interface DocumentOutline {
  mainTopic: string;
  sections: Section[];
}
