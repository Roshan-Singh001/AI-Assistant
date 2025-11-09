import React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react';
import MoonLoader from 'react-spinners/MoonLoader';
import axios from 'axios';
import MainLogo from '../assets/images/MainLogo.png';
import { toast } from "react-toastify";
import CodeMirror from '@uiw/react-codemirror';
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap, indentWithTab } from "@codemirror/commands"
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { Play, Eye, UserRound, X, Bot, Send, FileText, BotMessageSquare, MessageSquare, CircleCheckBig, CircleX, TestTube, Terminal, Maximize2, Minimize2, Clipboard, ClipboardCheck } from 'lucide-react';

import JavascriptLogo from '../assets/images/JavascriptLogo.png';
import PythonLogo from '../assets/images/PythonLogo.png';
import CppLogo from '../assets/images/CppLogo.png';
import JavaLogo from '../assets/images/JavaLogo.png';
import Chmarkdown from '../components/Chmarkdown';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 360000,
  headers: { 'X-Custom-Header': 'foobar' }
});
 
const CodeEdit = ({ value = "", onChange }) => {
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [testInput, setTestInput] = useState([]);
  const [local, setLocal] = useState(value);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'ai', content: 'Hello! I\'m here to help you with your code. Feel free to ask any questions!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [languageMode, setLanguageMode] = useState("javascript");
  const [activeTab, setActiveTab] = useState('chat');
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);

  useEffect(() => setLocal(value ?? ""), [value]);

  const extensions = useMemo(() => {
    var langExt;
    if (languageMode === "python") langExt = python();
    else if (languageMode === "java") langExt = java();
    else if (languageMode === "cpp") langExt = cpp();
    else langExt = javascript();

    return [
      langExt,
      keymap.of([indentWithTab]),
      EditorView.theme({
        '&': {
          fontSize: '17px',
          fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace'
        },
        '.cm-focused': {
          outline: 'none'
        },
        '.cm-editor': {
          borderRadius: '8px',
          background: '#000000',
        },
        '.ͼo': {
          background: '#000000',
        },
        'cm-theme-dark':{
          height: '100vh',
        }
      })
    ];
  }, [languageMode]);

  const handleChange = useCallback(
    (v, viewUpdate) => {
      setLocal(v);
      if (onChange) onChange(v, viewUpdate);
    },
    [onChange]
  );

  const handleLanguageChange = (e) => {
    setLanguageMode(e.target.value);
  }

  const handleSendMessage = async () => {
    if (chatInput.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        type: 'user',
        content: chatInput
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatInput('');

      try {
        const res = await AxiosInstance.post("/code/api/chat", {
          message: chatInput,
          chatHistory: chatMessages,
          code: local,
        });

        const aiResponse = {
          id: chatMessages.length + 2,
          type: 'ai',
          content: res.data.reply
        };

        console.log(aiResponse);
        setChatMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error("Chat Error:", error.message);
        const aiResponse = {
          id: chatMessages.length + 2,
          type: 'ai',
          content: 'Sorry, I\'m having trouble responding right now. Please try again later.'
        };
        setChatMessages(prev => [...prev, aiResponse]);

      }
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await AxiosInstance.post("/code/api/run-full", {
        logicCode: local,
        language: languageMode,
      });

      const { fullCode, testCases, results } = res.data;

      console.log("✅ Full code generated:\n", fullCode);
      console.log("📦 Test cases:", testCases);
      console.log("🏁 Results:", results);

      setTestInput(testCases);
      setOutput(results);
      setActiveTab('output');
      toast.success("Code ran successfully!");
    } catch (err) {
      toast.error("Internal server error. Please try again.");
      console.error(err);
    }
    setIsRunning(false);
  };

  const handleReview = async() => {
    setIsReviewing(true);
    setActiveTab('chat');
    console.log("Reviewing code:", local);

    const reviewMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      content: `Please review my code`
    };
    setChatMessages(prev => [...prev, reviewMessage]);

    try {
      const result = await AxiosInstance.post("/code/api/review-code",{
        code: local,
        language: languageMode,
      });

      console.log("Review result:", result);
      console.log("Review result:", result.data.review);

      const aiResponse = {
        id: chatMessages.length + 2,
        type: 'ai',
        content: result.data.review
      };

      setChatMessages(prev => [...prev, aiResponse]);

      toast.success("Code reviewed successfully!");
      
    } catch (error) {
      toast.error("Failed to review code. Please try again.");
      console.error("Review Error:", error);
    }
    setIsReviewing(false);

  };

  return (
    <div className='flex h-screen w-full bg-gray-50 dark:bg-gray-900'>
      {/* Main Editor Section */}
      <main className={`transition-all duration-300 ${isRightPanelCollapsed ? 'w-full' : 'w-2/3 lg:w-3/4'} flex flex-col`}>
        {/* Toolbar */}
        <div className='flex max-[1020px]:flex-col justify-between p-4 bg-black border-b border-gray-700 shadow-sm'>
          <div className='flex '>
            <div className='flex max-[1020px]:w-screen justify-between items-center gap-4'>
              <div className='flex items-center gap-[0.2rem]'>
                <img className="w-10 h-10 sm:w-12 sm:h-12" src={MainLogo} alt="Simpl AI Logo" srcset="" />
                <h1 className='text-lg font-semibold text-white'>SIMPL-AI Editor</h1>
              </div>
              <div className='flex items-center space-x-2'>
                <span className='px-2 py-1'>
                  {languageMode === 'javascript' && <img src={JavascriptLogo} alt="Javascript" srcset="" />}
                  {languageMode === 'python' && <img src={PythonLogo} alt="Python" />}
                  {languageMode === 'cpp' && <img src={CppLogo} alt="Python" />}
                  {languageMode === 'java' && <img src={JavaLogo} alt="Python" />}
                </span>
              </div>
            </div>
          </div>

          <div className='flex max-[1020px]:justify-between items-center gap-4'>
            <div>
              <label className='text-white' htmlFor="language">Language: </label>
              <select name="language" value={languageMode} onChange={(e) => handleLanguageChange(e)} id="language" className='bg-gray-700 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3 pr-10 text-white font-medium focus:outline-none transition-all duration-200 cursor-pointer'>
                <option className='bg-gray-700' value="javascript">Java Script</option>
                <option className='bg-gray-700' value="python">Python</option>
                <option className='bg-gray-700' value="cpp">C++</option>
                <option className='bg-gray-700' value="java">Java</option>
              </select>
            </div>

            <div className='flex items-center gap-4'>
              <button
                disabled={isRunning || local.trim() === "" || local.length < 10 || isReviewing}
                onClick={handleRun}
                className='flex items-center space-x-2 px-4 py-2 disabled:opacity-50 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-sm'
              >
                {isRunning ? <MoonLoader size={16} color="#b3ffba" /> : <Play size={16} />}

                <span className='max-[1200px]:hidden'>Run</span>
              </button>
              <button
                disabled={isRunning || local.trim() === "" || local.length < 10 || isReviewing}
                onClick={handleReview}
                className='flex items-center space-x-2 px-4 py-2 disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm'
              >
                {isReviewing ? <MoonLoader size={16} color="#b3ffba" /> : <Eye size={16} />}
                <span className='max-[1200px]:hidden'>Review</span>
              </button>
              <button
                onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
                className='p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200'
              >
                {isRightPanelCollapsed ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className='flex-1'>
          <div className='h-full bg-[#282c34] overflow-hidden shadow-sm border-gray-700'>
            <CodeMirror
              value={value}
              height="100%"
              extensions={extensions}
              onChange={handleChange}
              basicSetup={true}
              theme="dark"
            />
          </div>
        </div>
      </main>

      {/* Right Panel */}
      <aside className={`transition-all duration-300 ${isRightPanelCollapsed ? 'w-0 overflow-hidden' : 'w-1/2 max-[940px]:w-screen max-[1070px]:absolute z-10 right-0 h-screen lg:w-[40%] lg:min-w-20 '} flex flex-col bg-gray-800 border-l border-gray-700 shadow-lg`}>
        {/* Tab Navigation */}
        <div className='flex justify-between items-center border-b bg-black border-gray-700'>
          <div className='flex'>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === 'chat'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              <MessageSquare size={16} />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('input')}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === 'input'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              <TestTube size={16} />
              <span>Input</span>
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === 'output'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              <Terminal size={16} />
              <span>Output</span>
            </button>
          </div>
          <div>

            <button onClick={() => { setIsRightPanelCollapsed(!isRightPanelCollapsed) }} className='px-4 py-3 hover:bg-red-600 transition rounded-xl'>
              <X size={16} className='text-white' />

            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className='flex-1 flex flex-col overflow-hidden'>
          {activeTab === 'chat' && (
            <div className='flex flex-col h-full bg-[#1e1e1e]'>
              {/* Header */}
              <div className='w-screen px-4 py-3 bg-[#252526] border-b border-[#3e3e42] flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <img className="w-3 h-3 sm:w-4 sm:h-4" src={MainLogo} alt="Simpl AI Logo" />
                  <h3 className='text-sm font-semibold text-gray-200'>AI Assistant</h3>
                </div>
              </div>

              {/* Messages Container */}
              <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {chatMessages.length === 0 ? (
                  <div className='flex flex-col items-center justify-center h-full text-center'>
                    <div className='w-16 h-16 mb-4 rounded-full bg-purple-500/10 flex items-center justify-center'>
                      <img className="w-6 h-6 sm:w-8 sm:h-8" src={MainLogo} alt="Simpl AI Logo" srcset="" />
                    </div>
                    <p className='text-gray-400 text-sm font-medium mb-2'>Start a conversation</p>
                    <p className='text-gray-500 text-xs max-w-xs'>
                      Ask me anything about your code, debugging, or programming concepts
                    </p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user'
                          ? 'bg-blue-500'
                          : 'bg-gradient-to-br from-purple-500 to-pink-500'
                          }`}>
                          {message.type === 'user' ? (
                            <UserRound className='w-5 h-5 text-white' />
                          ) : (
                            <Bot className='w-5 h-5 text-white' />
                          )}
                        </div>

                        {/* Message Content */}
                        <div className={`flex flex-col gap-1 ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                          <span className='text-xs text-gray-500 px-1'>
                            {message.type === 'user' ? 'You' : 'AI Assistant'}
                          </span>
                          <div className={`px-4 py-2.5 min-[340px]:w-[23rem] w-full rounded-2xl ${message.type === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-sm'
                            : 'bg-[#252526] text-gray-200 border border-[#3e3e42] rounded-tl-sm'
                            }`}>
                            <div className='text-sm whitespace-pre-wrap break-words'>
                              {<Chmarkdown markdownStr={message.content} />}
                            </div>
                          </div>
                          {/* Timestamp */}
                          <span className='text-xs text-gray-600 px-1'>
                            {message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}

              </div>

              {/* Input Area */}
              <div className='p-4 border-t border-[#3e3e42] bg-[#252526]'>
                <div className='flex items-end gap-2'>
                  {/* Input Field */}
                  <div className='flex-1 relative'>
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder='Ask about your code...'
                      rows={1}
                      className='w-full px-4 py-3 pr-12 bg-[#1e1e1e] border border-[#3e3e42] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-200 text-sm resize-none placeholder-gray-500 transition-all duration-200'
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                    {/* Character count or suggestions */}
                    {chatInput.length > 0 && (
                      <button
                        onClick={() => setChatInput('')}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors'
                      >
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || local.length < 10}
                    className={`p-3 rounded-lg transition-all duration-200 ${chatInput.trim() && local.length > 10
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105'
                      : 'bg-[#3e3e42] text-gray-600 cursor-not-allowed'
                      } disabled:bg-[#3e3e42] disabled:text-gray-600 disabled:cursor-not-allowed`}
                  >
                    <Send size={18} />
                  </button>
                </div>

                {/* Quick Actions */}
                <div className='flex flex-wrap gap-2 mt-3'>
                  <button
                    onClick={() => setChatInput('Explain this code')}
                    className='text-xs px-3 py-1.5 bg-[#1e1e1e] text-gray-400 rounded-full border border-[#3e3e42] hover:border-purple-500/50 hover:text-purple-400 transition-colors duration-200'
                  >
                    💡 Explain code
                  </button>
                  <button
                    onClick={() => setChatInput('Find bugs in my code')}
                    className='text-xs px-3 py-1.5 bg-[#1e1e1e] text-gray-400 rounded-full border border-[#3e3e42] hover:border-purple-500/50 hover:text-purple-400 transition-colors duration-200'
                  >
                    🐛 Find bugs
                  </button>
                  <button
                    onClick={() => setChatInput('Optimize this code')}
                    className='text-xs px-3 py-1.5 bg-[#1e1e1e] text-gray-400 rounded-full border border-[#3e3e42] hover:border-purple-500/50 hover:text-purple-400 transition-colors duration-200'
                  >
                    ⚡ Optimize
                  </button>
                </div>
              </div>
              <style jsx>{`
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  
  textarea {
    scrollbar-width: thin;
    scrollbar-color: #3e3e42 #1e1e1e;
  }
  
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  
  textarea::-webkit-scrollbar-track {
    background: #1e1e1e;
  }
  
  textarea::-webkit-scrollbar-thumb {
    background: #3e3e42;
    border-radius: 3px;
  }
  
  textarea::-webkit-scrollbar-thumb:hover {
    background: #4e4e52;
  }
`}</style>
            </div>
          )}

          {activeTab === 'input' && (
            <InputPanel testInput={testInput} />
          )}

          {activeTab === 'output' && (
            <OutputPanel output={output} />
          )}
        </div>
      </aside>
    </div>
  )
}

const InputPanel = ({ testInput }) => {
  return (
    <div className='h-full flex flex-col bg-[#1e1e1e]'>
      {/* Header */}
      <div className='px-4 py-3 bg-[#252526] border-b border-[#3e3e42] flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Clipboard className='w-4 h-4 text-blue-400' />
          <h3 className='text-sm font-semibold text-gray-200'>Test Cases</h3>
        </div>
        <span className='text-xs text-gray-400 bg-[#3e3e42] px-2 py-1 rounded'>
          {testInput.length} {testInput.length === 1 ? 'case' : 'cases'}
        </span>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto p-4 space-y-3'>
        {testInput.length > 0 ? (
          testInput.map((test, index) => (
            <div
              key={index}
              className='bg-[#252526] rounded-lg border border-[#3e3e42] hover:border-blue-500/50 transition-colors duration-200'
            >
              {/* Test Case Header */}
              <div className='px-4 py-2 rounded-lg bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between'>
                <span className='text-xs font-semibold text-gray-300'>
                  Test Case {index + 1}
                </span>
              </div>

              {/* Test Case Content */}
              <div className='p-4'>
                {/* Input */}
                <div>
                  <label className='text-xs font-medium text-gray-400 mb-1 block'>Input:</label>
                  <div className='bg-[#1e1e1e] rounded p-3 border border-[#3e3e42]'>
                    <pre className='text-sm text-cyan-300 font-mono whitespace-pre-wrap break-words'>
                      {JSON.stringify(test.input, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Expected Output */}
                <div>
                  <label className='text-xs font-medium text-gray-400 mb-1 block'>Expected Output:</label>
                  <div className='bg-[#1e1e1e] rounded p-3 border border-[#3e3e42]'>
                    <pre className='text-sm text-green-400 font-mono whitespace-pre-wrap break-words'>
                      {JSON.stringify(test.expected_output, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-center py-12'>
            <FileText className='w-16 h-16 text-gray-600 mb-4' />
            <p className='text-gray-400 text-sm font-medium mb-1'>No test cases available</p>
            <p className='text-gray-500 text-xs max-w-xs'>
              Run your code to generate test cases automatically
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const OutputPanel = ({ output }) => {
  return (
    <div className='h-full flex flex-col bg-[#1e1e1e]'>
      {/* Header */}
      <div className='px-4 py-3 bg-[#252526] border-b border-[#3e3e42] flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <ClipboardCheck className='w-4 h-4 text-green-400' />
          <h3 className='text-sm font-semibold text-gray-200'>Test Results</h3>
        </div>
        {output.length > 0 && (
          <div className='flex items-center gap-2'>
            <span className='text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded'>
              {output.filter(r => r.passed).length} passed
            </span>
            <span className='text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded'>
              {output.filter(r => !r.passed).length} failed
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto p-4 space-y-3'>
        {output.length > 0 ? (
          output.map((res, index) => {
            const passed = res.output === res.expected_output || res.passed;
            return (
              <div
                key={index}
                className={`rounded-lg border transition-colors duration-200 ${passed
                  ? 'bg-[#252526] border-green-500/30 hover:border-green-500/50'
                  : 'bg-[#252526] border-red-500/30 hover:border-red-500/50'
                  }`}
              >
                {/* Result Header */}
                <div className={`px-4 py-2 border-b flex items-center justify-between ${passed
                  ? 'bg-green-500/5 border-green-500/30'
                  : 'bg-red-500/5 border-red-500/30'
                  }`}>
                  <span className='text-xs font-semibold text-gray-300'>
                    Test Case {index + 1}
                  </span>
                  <div className='flex items-center gap-2'>
                    {passed ? (
                      <>
                        <CircleCheckBig className='w-4 h-4 text-green-400' />
                        <span className='text-xs font-medium text-green-400'>Passed</span>
                      </>
                    ) : (
                      <>
                        <CircleX className='w-4 h-4 text-red-400' />
                        <span className='text-xs font-medium text-red-400'>Failed</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Result Content */}
                <div className='p-4 space-y-3'>
                  {/* Input */}
                  <div>
                    <label className='text-xs font-medium text-gray-400 mb-1 block'>Input:</label>
                    <div className='bg-[#1e1e1e] rounded p-3 border border-[#3e3e42]'>
                      <pre className='text-sm text-cyan-300 font-mono whitespace-pre-wrap break-words'>
                        {JSON.stringify(res.input, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Expected Output */}
                  <div>
                    <label className='text-xs font-medium text-gray-400 mb-1 block'>Expected:</label>
                    <div className='bg-[#1e1e1e] rounded p-3 border border-[#3e3e42]'>
                      <pre className='text-sm text-green-400 font-mono whitespace-pre-wrap break-words'>
                        {JSON.stringify(res.expected, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Actual Output */}
                  <div>
                    <label className='text-xs font-medium text-gray-400 mb-1 block'>Your Output:</label>
                    <div className={`bg-[#1e1e1e] rounded p-3 border ${passed ? 'border-green-500/30' : 'border-red-500/30'
                      }`}>
                      <pre className={`text-sm font-mono whitespace-pre-wrap break-words ${passed ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {JSON.stringify(res.output, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-center py-12'>
            <ClipboardCheck className='w-16 h-16 text-gray-600 mb-4' />
            <p className='text-gray-400 text-sm font-medium mb-1'>No results yet</p>
            <p className='text-gray-500 text-xs max-w-xs'>
              Execute your code to see test results here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


export default CodeEdit;