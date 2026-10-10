// ==============================================================================
// NEXGUIDE AI — DUAL-MODE ACADEMIC TUTOR CHATBOT (ChatBot.jsx)
// SYSTEM PROMPT FOR CHATBOT ENGINE:
// MODE 1: PLATFORM GUIDANCE (Roadmaps, daily targets, mock tests, resume builder)
// MODE 2: DUAL-MODE ACADEMIC TUTOR (CS, Quant/Reasoning, Law/GS, General Concepts)
// ==============================================================================

import React from 'react';
import ChatDrawer from './ChatDrawer';
import { 
  generateChatResponse, 
  SYSTEM_PROMPT, 
  QUICK_PROMPTS_ACADEMIC, 
  QUICK_PROMPTS_PLATFORM 
} from '../../services/chatKnowledgeService';

export { generateChatResponse, SYSTEM_PROMPT, QUICK_PROMPTS_ACADEMIC, QUICK_PROMPTS_PLATFORM };

export default function ChatBot(props) {
  return <ChatDrawer {...props} />;
}
