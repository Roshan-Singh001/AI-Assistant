import axios from "axios";
import Aurora from './components/Aurora';
import TextType from './components/TextType'

import "regenerator-runtime/runtime";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa6";
// Icons
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
  Code,
} from "lucide-react";

import Navbar from "./components/Navbar";


import "./App.css";



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
      name: "Code Editor",
      description: "Write and debug code worrying about input",
      icon: Code,
      gradient: "from-purple-500 to-pink-500",
      action: 'code',
    },
    {
      name: "Doc Query",
      description: "Ask questions from your documents",
      icon: FileText,
      gradient: "from-purple-500 to-cyan-500",
      action: 'doc',
    },
  ];

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={0.5}
            speed={0.8}
          />
          <div className="absolute inset-0 -z-20 bg-black"></div>
        </div>

        <div className="">
          <Navbar />
          {/* Main content */}
          <div className="relative z-[5] flex flex-col items-center justify-center min-h-screen px-6 py-12">
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
              <TextType
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl"
                text={["WHAT CAN I HELP WITH?", "GENERAL CHATS", "CODE EDITING", "DOCUMENT QUERIES"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
              />

              {/* <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Choose from our AI-powered writing tools to create
                professional content in seconds
              </p> */}
            </div>

            {/* Tools grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 max-w-6xl mx-auto w-full mb-12">
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.name}
                    onClick={() => handleToolClick(tool.action)}
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
            <div className="border-t text-center pt-4">
              {/* <p className="text-slate-400 mb-6 text-lg">
                Ready to get started? Pick a tool above or start with a
                general conversation.
              </p> */}

              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <div>
                  <a href="https://github.com/Roshan-Singh001/AI-Assistant" className="hover:scale-105 transition-transform duration-300 ">
                    <FaGithub className="text-white size-7" />
                  </a>
                </div>

                <div className="text-slate-500 text-sm">
                  Made by Roshan Singh
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
