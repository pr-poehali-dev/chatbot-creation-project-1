import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
}

const ChatMessage = ({ role, content, imageUrl, fileUrl, fileName }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'code', language: match[1] || 'text', content: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.slice(lastIndex) });
    }

    return parts.map((part, index) => {
      if (part.type === 'code') {
        return (
          <Card key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg my-3 relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400 uppercase">{part.language}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-gray-400 hover:text-white"
                onClick={() => navigator.clipboard.writeText(part.content)}
              >
                <Icon name="Copy" className="h-3 w-3" />
              </Button>
            </div>
            <pre className="overflow-x-auto">
              <code className="text-sm">{part.content}</code>
            </pre>
          </Card>
        );
      }
      return (
        <p key={index} className="whitespace-pre-wrap leading-relaxed">
          {part.content.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < part.content.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
  };

  return (
    <div
      className={`flex gap-4 animate-fade-in ${role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {role === 'assistant' && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <Icon name="Bot" className="h-5 w-5 text-white" />
        </div>
      )}
      <div
        className={`rounded-2xl px-6 py-4 max-w-[80%] ${
          role === 'user'
            ? 'bg-gradient-to-r from-primary to-secondary text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Attached"
            className="rounded-lg mb-3 max-w-full h-auto max-h-96 object-cover"
          />
        )}
        {fileUrl && fileName && (
          <a
            href={fileUrl}
            download={fileName}
            className="flex items-center gap-2 mb-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <Icon name="File" className="h-4 w-4" />
            <span className="text-sm">{fileName}</span>
            <Icon name="Download" className="h-4 w-4 ml-auto" />
          </a>
        )}
        <div className="prose prose-sm max-w-none">{renderContent()}</div>
        {role === 'assistant' && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={handleCopy}
            >
              <Icon name={copied ? 'Check' : 'Copy'} className="h-3 w-3 mr-1" />
              {copied ? 'Скопировано' : 'Копировать'}
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              <Icon name="ThumbsUp" className="h-3 w-3 mr-1" />
              Полезно
            </Button>
          </div>
        )}
      </div>
      {role === 'user' && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
          <Icon name="User" className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
