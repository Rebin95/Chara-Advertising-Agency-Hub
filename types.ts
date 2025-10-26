import type { ReactElement } from 'react';

export interface Employee {
  id: number;
  name: string;
  role: string;
  roleKurdish: string;
  description: string;
  icon: ReactElement;
}

export interface Client {
  id: number;
  name: string;
  type: string;
  about: string;
  locations: string[];
  tasks: {
    videos: string;
    posts: string;
    visiting: string;
    stories: string;
    sponsorship: string;
  };
  pages: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

// New types for chat
export type MessageRole = 'user' | 'model';

export interface ChatMessagePart {
  text?: string;
  imageUrl?: string;
}

export interface ChatMessage {
  role: MessageRole;
  parts: ChatMessagePart[];
  // Add a unique ID for React keys
  id: string; 
  timestamp: string; // Changed from Date to string for serialization
  clientTag?: string;
}

export interface PromptTemplate {
  title: string;
  prompt: string;
}

// FIX: Add NewsItem type for the news widget.
export interface NewsItem {
  headline: string;
  summary: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  speechRate: number;
  fontSize: number;
  fontFamily: string;
  language: 'ku' | 'ar' | 'en';
}

// New Types for Profile and Tasks
export interface UserProfile {
  name: string;
  role: string;
  picture: string | null; // Base64 Data URL for the image
}

export interface TaskProgress {
  [yearMonth: string]: {
    [clientId: number]: {
      completedPosts: number;
      completedVideos: number;
      completedVisiting: number;
      completedStories: number;
      completedSponsorship: number;
    };
  };
}