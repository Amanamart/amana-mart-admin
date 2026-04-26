'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Search, MoreVertical, Phone, 
  Video, Paperclip, Smile, User, 
  Check, CheckCheck, Clock, ShieldCheck
} from 'lucide-react';
import { useConversations, useMessages, useSendMessage } from '@/hooks/useMessaging';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils';

export function MessagingClient() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: loadingConvs } = useConversations();
  const { data: messages, isLoading: loadingMsgs } = useMessages(activeId || '');
  const sendMessage = useSendMessage();

  const activeConversation = conversations?.find((c: any) => c.id === activeId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeId) return;

    try {
      await sendMessage.mutateAsync({
        conversationId: activeId,
        body: message,
      });
      setMessage('');
    } catch (error) {
      console.error('Send failed:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden animate-fade-in">
      {/* Sidebar */}
      <div className="w-80 border-r border-[var(--border)] flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-[var(--border)] bg-white">
          <h2 className="text-lg font-bold">Messages</h2>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full h-9 pl-9 pr-4 rounded-full border border-[var(--border)] bg-slate-50 text-xs focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
             <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">Loading chats...</div>
          ) : conversations?.map((conv: any) => (
            <div 
              key={conv.id}
              className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-slate-100 ${activeId === conv.id ? 'bg-white border-l-4 border-l-[var(--primary)]' : 'hover:bg-white'}`}
              onClick={() => setActiveId(conv.id)}
            >
              <div className="relative">
                <Avatar src={conv.members?.[0]?.user?.image} fallback={<User className="w-4 h-4" />} />
                {conv.members?.[0]?.user?.status === 'active' && (
                   <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="text-[13px] font-semibold truncate">{conv.title || conv.members?.[0]?.user?.name || 'Chat'}</h4>
                  <span className="text-[10px] text-[var(--muted-foreground)]">12:45 PM</span>
                </div>
                <p className="text-[11px] text-[var(--muted-foreground)] truncate">
                  {conv.lastMessage?.body || 'No messages yet'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeId ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={activeConversation?.members?.[0]?.user?.image} size="md" />
              <div>
                <h3 className="text-sm font-bold leading-none">{activeConversation?.title || activeConversation?.members?.[0]?.user?.name}</h3>
                <span className="text-[10px] text-green-600 font-medium mt-1 inline-block">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-slate-400"><Phone className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="text-slate-400"><Video className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="text-slate-400"><MoreVertical className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5] bg-opacity-30"
            style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          >
            {messages?.map((msg: any, i: number) => {
              const isMe = msg.senderId === 'current-user-id'; // This should come from auth
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${isMe ? 'bg-[var(--primary)] text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'}`}>
                    <p className="text-[13px] leading-relaxed">{msg.body}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                      <span className="text-[9px]">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-[var(--border)] flex items-center gap-3 bg-slate-50">
            <Button type="button" variant="ghost" size="icon" className="text-slate-500"><Smile className="w-5 h-5" /></Button>
            <Button type="button" variant="ghost" size="icon" className="text-slate-500"><Paperclip className="w-5 h-5" /></Button>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full h-11 px-4 rounded-full border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] text-sm shadow-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={!message.trim()}
              className="w-11 h-11 rounded-full bg-[var(--primary)] flex items-center justify-center text-white shadow-lg hover:bg-[#0d8a40] transition-all disabled:opacity-50 disabled:hover:bg-[var(--primary)]"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
          <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10 text-[var(--primary)]" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Amana Mart Secure Messaging</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm text-center">
            Select a conversation from the sidebar to start chatting with customers, vendors, or riders.
          </p>
        </div>
      )}
    </div>
  );
}
