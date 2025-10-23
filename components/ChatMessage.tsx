import React from 'react';
import type { Message } from '../types';
import { MessageRole } from '../types';
import { BotIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUserModel = message.role === MessageRole.USER;

  const wrapperClasses = `flex items-start gap-3 my-4 ${isUserModel ? 'justify-end' : ''}`;
  const bubbleClasses = `p-3 rounded-2xl max-w-md ${
    isUserModel
      ? 'bg-purple-600 text-white rounded-br-none'
      : 'bg-gray-700 text-gray-200 rounded-bl-none'
  }`;
  
  const textWithBreaks = message.text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className={wrapperClasses}>
      {!isUserModel && (
        <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
          <BotIcon className="w-5 h-5 text-gray-300" />
        </div>
      )}
      <div className={bubbleClasses}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};