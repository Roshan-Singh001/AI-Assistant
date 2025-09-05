// Libraries
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate } from "react-router-dom";

// Icons
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneAltSlash } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import {
  ChevronRight,
  MessageSquare,
  FileText,
  Mail,
  Share2,
  FileEdit,
  Sparkles,
  Zap,
  PenTool,
  Globe,
} from "lucide-react";

// Components and CSS
import History from "./components/History";
import Chmarkdown from "./components/Chmarkdown";
import "./App.css";

// Hooks
import { useState, useEffect, useMemo, useRef } from "react";


const AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 3000,
  headers: { "X-Custom-Header": "foobar" },
});

function App() {
  const navigate = useNavigate();

  const handleToolClick = (tool) => {
    navigate(`/tool/${tool}`);
  };

  const tools = [
    {
      name: "Chat Assistant",
      description: "General AI conversation",
      icon: MessageSquare,
      gradient: "from-blue-500 to-cyan-500",
      action: "chat",
    },
    {
      name: "Blog Writer",
      description: "Create engaging blog posts",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
      action: 'blog',
    },
    {
      name: "Email Writer",
      description: "Craft professional emails",
      icon: Mail,
      gradient: "from-green-500 to-emerald-500",
      action: () => handleToolClick("email"),
    },
    {
      name: "Social Media",
      description: "Create viral social posts",
      icon: Share2,
      gradient: "from-orange-500 to-red-500",
      action: () => handleToolClick("social"),
    },
    {
      name: "Document Writer",
      description: "Generate Word documents",
      icon: FileEdit,
      gradient: "from-indigo-500 to-blue-500",
      action: 'word',
    },
    {
      name: "Creative Writer",
      description: "Stories & creative content",
      icon: PenTool,
      gradient: "from-pink-500 to-rose-500",
      action: () => handleToolClick("Creative Writer"),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">

            <div className="">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-r from-pink-400/10 to-orange-400/10 blur-3xl animate-pulse delay-700"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-cyan-400/5 to-blue-400/5 blur-3xl animate-pulse delay-1000"></div>
              </div>

              {/* Main content */}
              <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
                {/* Header with logo */}
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center mb-4">
                    <Sparkles className="w-12 h-12 text-cyan-400 mr-4 animate-pulse" />
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      SIMPL-AI
                    </h1>
                    <Zap className="w-12 h-12 text-purple-400 ml-4 animate-pulse delay-500" />
                  </div>

                  <div className="flex items-center justify-center mb-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-32"></div>
                    <Globe
                      className="w-6 h-6 text-cyan-400 mx-4 animate-spin"
                      style={{ animationDuration: "8s" }}
                    />
                    <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent w-32"></div>
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
                    WHAT CAN I HELP WITH?
                  </h2>

                  <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Choose from our AI-powered writing tools to create
                    professional content in seconds
                  </p>
                </div>

                {/* Tools grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full mb-12">
                  {tools.map((tool, index) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.name}
                        onClick={()=>handleToolClick(tool.action)}
                        className="group relative p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:bg-white/10"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        {/* Gradient background on hover */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                        ></div>

                        {/* Icon */}
                        <div
                          className={`relative w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${tool.gradient} p-3 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-full h-full text-white" />
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                          {tool.description}
                        </p>

                        {/* Hover indicator */}
                        <div className="absolute bottom-4 right-4 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    );
                  })}
                </div>

                {/* Call to action */}
                <div className="text-center">
                  <p className="text-slate-400 mb-6 text-lg">
                    Ready to get started? Pick a tool above or start with a
                    general conversation.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:from-cyan-400 hover:to-blue-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                    >
                      <MessageSquare className="w-5 h-5 inline mr-2" />
                      Start Free Chat
                    </button>

                    <div className="text-slate-500 text-sm">
                      No signup required • Instant access
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom gradient line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
            </div>
      </div>
    </>
  );
}
export default App;
