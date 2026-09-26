"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Send, FileText, Bot, User, Loader2, Plus, FileUp,
  ChevronDown, Menu, X, Sparkles, Upload, Mail, UserCog,
  MessageCircle, Clock, CheckCircle, Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Message {
  role: "user" | "bot";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
  pdfName?: string;
}

// Auth Modal
function AuthModal({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: (name: string, email: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onLogin(name, email);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Welcome to <span className="text-indigo-400">DocuBrain</span></h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-lg"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Full Name</label>
            <div className="relative">
              <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Momar DIOP" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder:text-zinc-600" />
            </div>
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="momar@example.com" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder:text-zinc-600" />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-xl py-3 font-medium text-sm transition mt-4">
            Get Started
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// Chat Input Component
function ChatInput({ input, setInput, handleSend, isUploading, selectedFile, handleUpload, fileInputRef, handleFileSelect }) {
  return (
    <div className="p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
      <div className="max-w-3xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2 flex items-center gap-2 relative">
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
          
          {selectedFile ? (
            <button onClick={handleUpload} disabled={isUploading} className="p-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg transition shrink-0" title="Process PDF">
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            </button>
          ) : (
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-zinc-500 hover:text-indigo-400 transition-colors shrink-0" title="Choose PDF">
              <FileUp size={18} />
            </button>
          )}
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything about your document..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 placeholder:text-zinc-600 outline-none"
          />
          <button onClick={handleSend} disabled={!input.trim()} className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg transition shrink-0">
            <Send size={16} />
          </button>
        </div>
        <p className="text-center text-xs text-zinc-600 mt-2">© {new Date().getFullYear()} Momar DIOP — Portfolio Project</p>
      </div>
    </div>
  );
}

// Main App
export default function DocuBrainApp() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Salut 👋 Je suis **Momar DIOP**. Uploadez un PDF pour discuter avec votre document." }
  ]);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [showAuth, setShowAuth] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const recentChats: ChatSession[] = [
    { id: "1", title: "Contrat de service", lastMessage: "Qu'est-ce que la clause 3 signifie ?", time: "10h", pdfName: "Contrat.pdf" },
    { id: "2", title: "Rapport annuel", lastMessage: "Résultats financiers Q4", time: "Hier", pdfName: "Rapport.pdf" },
    { id: "3", title: "CV Modèle", lastMessage: "Corrige les erreurs", time: "15/09", pdfName: "CV.pdf" },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") setSelectedFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setUploadedDocs(prev => [...prev, selectedFile!.name]);
        setMessages(prev => [...prev, { role: "bot", content: `✅ **${selectedFile!.name}** traité ! Posez-moi une question.` }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "bot", content: "⚠️ Erreur lors de l'upload." }]);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsChatting(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "bot", content: data.answer || data.error || "Erreur serveur." }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", content: "❌ Erreur de connexion." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleLogin = (name: string, email: string) => {
    setUserName(name);
    setUserEmail(email);
    setShowAuth(false);
    setMessages(prev => [...prev, { role: "bot", content: `Bienvenue ${name} ! 👋 Uploadez un PDF pour commencer.` }]);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-72" : "w-0"} border-r border-zinc-800 bg-zinc-900/80 flex flex-col transition-all duration-300 overflow-hidden shrink-0`}>
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg"><Sparkles size={20} className="text-white" /></div>
            <h1 className="text-lg font-bold">DocuBrain <span className="text-indigo-400">IA</span></h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-zinc-800 rounded"><X size={18} /></button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-5">
          <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition">
            <Plus size={16} /> Nouvelle discussion
          </button>

          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Clock size={12} /> Discussions récentes
            </p>
            <div className="space-y-1.5">
              {recentChats.map(chat => (
                <button key={chat.id} className="w-full text-left p-2.5 hover:bg-zinc-800 rounded-xl transition group">
                  <p className="text-sm font-medium text-zinc-300 group-hover:text-white">{chat.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">{chat.lastMessage}</p>
                  <span className="text-xs text-zinc-600">{chat.time}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText size={12} /> Documents traités
            </p>
            <div className="space-y-1.5">
              {uploadedDocs.length === 0 && (
                <p className="text-xs text-zinc-600 py-2">Aucun document</p>
              )}
              {uploadedDocs.map((name, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-indigo-500/10 rounded-lg">
                  <FileText size={14} className="text-indigo-400" />
                  <span className="text-xs text-indigo-300 truncate flex-1">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-zinc-800">
          <div className="flex items-center gap-3 p-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">{userName[0] || "?"}</div>
            <div>
              <p className="text-sm font-medium">{userName || "Invité"}</p>
              <p className="text-xs text-zinc-500">{userEmail}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} className="fixed bottom-6 left-6 z-50 bg-indigo-600 text-white rounded-full p-3 shadow-lg shadow-indigo-900/30 md:hidden">
          <Menu size={20} />
        </button>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-zinc-800 rounded md:hidden"><Menu size={18} /></button>
            <h2 className="text-sm font-medium">DocuBrain IA</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>En ligne</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "bot" ? "bg-indigo-600" : "bg-zinc-700"}`}>
                  {msg.role === "bot" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${msg.role === "bot" ? "bg-zinc-900 border border-zinc-800 text-zinc-200" : "bg-indigo-600 text-white"}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isChatting && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center"><Bot size={16} /></div>
              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl"><Loader2 size={16} className="animate-spin text-indigo-400" /></div>
            </div>
          )}
        </div>

        {/* Drag & Drop Zone */}
        <div className={`mx-4 md:mx-6 mb-2 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
          dragOver ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-800 hover:border-zinc-700"
        }`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onClick={() => fileInputRef.current?.click()}>
          <div className="flex items-center justify-center gap-3">
            <Upload size={20} className={dragOver ? "text-indigo-400" : "text-zinc-500"} />
            <p className="text-sm text-zinc-400">{dragOver ? "Droppez votre PDF ici" : "Glissez-déposez un PDF ici ou cliquez pour choisir"}</p>
          </div>
        </div>

        {/* Chat Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isUploading={isUploading}
          selectedFile={selectedFile}
          handleUpload={handleUpload}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
        />
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onLogin={handleLogin} />
    </div>
  );
}
