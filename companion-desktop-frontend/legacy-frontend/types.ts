export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface AICharacter extends User {
  title: string;
  status: 'online' | 'offline' | 'busy';
  mood: {
    label: string;
    percentage: number;
    color: string;
  };
}

export interface MemoryItem {
  id: number;
  type: 'image' | 'text' | 'voice';
  title: string;
  date: string;
  tags: string[];
  url?: string;
  content?: string;
  duration?: string;
  audioUrl?: string;
}