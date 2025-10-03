import React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react';
import MoonLoader from 'react-spinners/MoonLoader';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap, indentWithTab } from "@codemirror/commands"
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { Play, Eye, Send, FileText, MessageSquare,CircleCheckBig, CircleX,   TestTube, Terminal, Maximize2, Minimize2, Clipboard, ClipboardCheck } from 'lucide-react';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 360000,
  headers: {'X-Custom-Header': 'foobar'}
});

const CodeEdit = ({ value = "", onChange}) => {
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
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
    console.log("Language mode:", languageMode);
    if (languageMode === "python") {
        langExt = python();
    }
    else if (languageMode === "java") {
        langExt = java();
    }
    else if (languageMode === "cpp") {  
        langExt = cpp();
    }
    else {
        langExt = javascript();
    }
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
          borderRadius: '8px'
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

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        type: 'user',
        content: chatInput
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatInput('');
      
      setTimeout(() => {
        const aiResponse = {
          id: chatMessages.length + 2,
          type: 'ai',
          content: 'I can see your code. How can I help you improve it or debug any issues?'
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }, 1000);
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
  } catch (err) {
    setOutput("Error running full flow");
    console.error(err);
  }
  setIsRunning(false);
};

  const handleReview = () => {
    setActiveTab('chat');
    console.log("Reviewing code:", local);
    
    const reviewMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      content: `Please review my code: ${local}`
    };
    setChatMessages(prev => [...prev, reviewMessage]);
    
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        type: 'ai',
        content: 'I\'ll analyze your code for best practices, potential bugs, and optimization opportunities. Let me review it...'
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 500);
  };

  return (
    <div className='flex h-screen w-full bg-gray-50 dark:bg-gray-900'>
      {/* Main Editor Section */}
      <main className={`transition-all duration-300 ${isRightPanelCollapsed ? 'w-full' : 'w-2/3 lg:w-3/4'} flex flex-col`}>
        {/* Toolbar */}
        <div className='flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 shadow-sm'>
          <div className='flex items-center space-x-4'>
            <h1 className='text-lg font-semibold text-white'>SIMPL-AI Editor</h1>
            <div className='flex items-center space-x-2'>
              <span className='px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full'>
                {languageMode}
              </span>
            </div>

            <div>
            <label className='text-white' htmlFor="language">Language: </label>
            <select name="language" value={languageMode} onChange={(e)=>handleLanguageChange(e)} id="language" className='bg-gray-700 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3 pr-10 text-white font-medium focus:outline-none transition-all duration-200 cursor-pointer'>
                <option className='bg-gray-700' value="javascript">Java Script</option>
                <option className='bg-gray-700' value="python">Python</option>
                <option className='bg-gray-700' value="cpp">C++</option>
                <option className='bg-gray-700' value="java">Java</option>
            </select>
            </div>
          </div>
          
          <div className='flex items-center space-x-2'>
            <button 
              disabled={isRunning || local.trim() === ""}
              onClick={handleRun}
              className='flex items-center space-x-2 px-4 py-2 disabled:opacity-50 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-sm'
            >
              {isRunning ? <span className='animate-spin'><MoonLoader size={16} color="#b3ffba" /></span> : <Play size={16} />}

              <span>Run</span>
            </button>
            <button
              disabled={isRunning || local.trim() === ""}
              onClick={handleReview}
              className='flex items-center space-x-2 px-4 py-2 disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm'
            >
              <Eye size={16} />
              <span>Review</span>
            </button>
            <button
              onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
              className='p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200'
            >
              {isRightPanelCollapsed ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
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
      <aside className={`transition-all duration-300 ${isRightPanelCollapsed ? 'w-0 overflow-hidden' : 'w-1/3 max-[462px]:w-screen max-[462px]:absolute h-screen lg:w-[40%] lg:min-w-20 '} flex flex-col bg-gray-800 border-l border-gray-700 shadow-lg`}>
        {/* Tab Navigation */}
        <div className='flex border-b border-gray-700'>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'chat' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <MessageSquare size={16} />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('input')}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'input' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <TestTube size={16} />
            <span>Input</span>
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'output' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Terminal size={16} />
            <span>Output</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className='flex-1 flex flex-col overflow-hidden'>
          {activeTab === 'chat' && (
            <div className='flex flex-col h-full'>
              <div className='flex-1 p-4 overflow-y-auto space-y-4'>
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      <p className='text-sm'>{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='p-4 border-t border-gray-700'>
                <div className='flex items-center gap-2'>
                  <input
                    type='text'
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder='Ask about your code...'
                    className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm'
                  />
                  <button
                    onClick={handleSendMessage}
                    className='p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200'
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
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
          <ClipboardCheck className='w-4 h-4 text-green-400'/>
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
                className={`rounded-lg border transition-colors duration-200 ${
                  passed 
                    ? 'bg-[#252526] border-green-500/30 hover:border-green-500/50' 
                    : 'bg-[#252526] border-red-500/30 hover:border-red-500/50'
                }`}
              >
                {/* Result Header */}
                <div className={`px-4 py-2 border-b flex items-center justify-between ${
                  passed 
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
                    <div className={`bg-[#1e1e1e] rounded p-3 border ${
                      passed ? 'border-green-500/30' : 'border-red-500/30'
                    }`}>
                      <pre className={`text-sm font-mono whitespace-pre-wrap break-words ${
                        passed ? 'text-green-400' : 'text-red-400'
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
            <ClipboardCheck className='w-16 h-16 text-gray-600 mb-4'/>
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