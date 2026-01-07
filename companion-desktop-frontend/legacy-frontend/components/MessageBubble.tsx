import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  aiAvatarUrl: string;
  searchQuery?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, aiAvatarUrl, searchQuery }) => {
  const isAi = message.sender === 'ai';

  // Helper function to highlight text
  const highlightText = (text: React.ReactNode, query: string): React.ReactNode => {
    if (typeof text !== 'string' || !query.trim()) return text;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));

    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={i} className="bg-yellow-500/50 text-white font-bold rounded px-0.5 shadow-sm box-decoration-clone">{part}</span> 
        : part
    );
  };

  // Custom components for ReactMarkdown to inject highlighting
  const components = React.useMemo(() => {
    if (!searchQuery) return undefined;

    const renderWithHighlight = ({ children }: { children: React.ReactNode }) => {
      return (
        <>
          {React.Children.map(children, child => {
            if (typeof child === 'string') {
              return highlightText(child, searchQuery);
            }
            return child;
          })}
        </>
      );
    };

    return {
      p: ({ children }: any) => <p>{renderWithHighlight({ children })}</p>,
      strong: ({ children }: any) => <strong>{renderWithHighlight({ children })}</strong>,
      em: ({ children }: any) => <em>{renderWithHighlight({ children })}</em>,
      li: ({ children }: any) => <li>{renderWithHighlight({ children })}</li>,
      h1: ({ children }: any) => <h1>{renderWithHighlight({ children })}</h1>,
      h2: ({ children }: any) => <h2>{renderWithHighlight({ children })}</h2>,
      h3: ({ children }: any) => <h3>{renderWithHighlight({ children })}</h3>,
      blockquote: ({ children }: any) => <blockquote>{renderWithHighlight({ children })}</blockquote>,
    };
  }, [searchQuery]);

  return (
    <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[70%] group ${!isAi ? 'self-end justify-end' : ''}`}>
      {isAi && (
        <div 
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 md:size-10 shrink-0 self-end mb-1" 
          style={{backgroundImage: `url("${aiAvatarUrl}")`}}
        >
        </div>
      )}

      <div className={`flex flex-col gap-1 ${isAi ? 'items-start' : 'items-end'}`}>
        <div 
          className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
            ${isAi 
              ? 'bg-surface-light text-white/90 rounded-bl-sm' 
              : 'bg-primary text-white rounded-br-sm shadow-lg shadow-primary/10'
            }`}
        >
          <ReactMarkdown 
            className="markdown-body"
            components={components}
          >
            {message.text}
          </ReactMarkdown>
        </div>
        <span className={`text-[11px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity ${isAi ? 'ml-1' : 'mr-1'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export const TypingIndicator: React.FC<{ avatarUrl: string }> = ({ avatarUrl }) => (
  <div className="flex items-end gap-3 max-w-[85%] md:max-w-[70%]">
    <div 
      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 md:size-10 shrink-0 self-end mb-1 opacity-80" 
      style={{backgroundImage: `url("${avatarUrl}")`}}
    >
    </div>
    <div className="flex flex-col gap-1 items-start">
      <div className="px-4 py-3 bg-surface-light rounded-2xl rounded-bl-sm flex items-center gap-1 h-[46px]">
        <div className="typing-dot size-2 bg-primary/60 rounded-full"></div>
        <div className="typing-dot size-2 bg-primary/80 rounded-full"></div>
        <div className="typing-dot size-2 bg-primary rounded-full"></div>
      </div>
    </div>
  </div>
);