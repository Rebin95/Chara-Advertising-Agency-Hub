import React from 'react';
import type { Employee } from './types';
import { ManagerIcon, CaptionIcon, DesignIcon, DocsIcon, ScriptIcon, NewsIcon, MedicalIcon, ZanaIcon } from './components/icons';

export const EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: "Social Media Manager",
    role: "Social Media Manager",
    roleKurdish: "بەڕێوەبەری سۆشیاڵ میدیا",
    description: "ڕێکخستنی پلانی کڕیارەکان بۆ فەیسبووک و ئینستاگرام و تیکتۆک.",
    icon: <ManagerIcon />,
  },
  {
    id: 2,
    name: "Caption Writer",
    role: "Caption Writer",
    roleKurdish: "نووسەری کاپشن",
    description: "نووسینی کاپشنی کورت و جوان بۆ سۆشیاڵ میدیا بە شێوەیەکی کورت و پوخت.",
    icon: <CaptionIcon />,
  },
  {
    id: 3,
    name: "Designer",
    role: "Designer",
    roleKurdish: "دیزاینەر",
    description: "کاری دیزاین دەکات و هیچ دەقێک نانووسێت.",
    icon: <DesignIcon />,
  },
  {
    id: 4,
    name: "Document Author",
    role: "Official Document Writer",
    roleKurdish: "نووسەری بەڵگەنامە فەرمییەکان",
    description: "بەرپرسە لە نووسینی بەڵگەنامە فەرمیەکان، پێشنیارنامە و دۆکیومێntەکان.",
    icon: <DocsIcon />,
  },
  {
    id: 5,
    name: "Script Writer",
    role: "Script Writer",
    roleKurdish: "نووسەری سکریپت",
    description: "تەنها ئەرکی نووسینی سکریپتە بۆ کورتە ڤیدیۆ و ڕیڵز.",
    icon: <ScriptIcon />,
  },
  {
    id: 6,
    name: "Marketing Developer",
    role: "R&D Specialist",
    roleKurdish: "پسپۆڕی توێژینەوە و گەشەپێدان",
    description: "هێنانی هەواڵی نوێ دەربارەی کار و AI نوێ بۆ ئاسانکاری کارەکانی ئاژانس.",
    icon: <NewsIcon />,
  },
  {
    id: 7,
    name: "Medical Article Writer",
    role: "Medical Article Writer",
    roleKurdish: "نووسەری بابەتی پزیشکی",
    description: "ئەرکی نووسینی وتاری پزیشکییە بۆ سۆشیاڵ میدیا.",
    icon: <MedicalIcon />,
  },
  {
    id: 8,
    name: "General Assistant",
    role: "General Assistant",
    roleKurdish: "یاریدەدەری گشتی",
    description: "پرسیاری گشتی بکە و وەڵامی خێرا وەربگرە. بۆ یارمەتی خێرا و ئاسان.",
    icon: <ZanaIcon />,
  }
];
