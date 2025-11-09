import React from 'react'
import { useState } from 'react';
import Navbar from '../components/Navbar'
import Aurora from '../components/Aurora'
import { MessageSquare, Code2, Image, Video, ArrowRight, X, ChevronDown, ChevronUp, Sparkles, Zap, Shield, Globe } from 'lucide-react';

const Tools = () => {
  const [activeTab, setActiveTab] = useState({});
  const [expandedFeatures, setExpandedFeatures] = useState({});
  const [selectedMedia, setSelectedMedia] = useState(null);

  const tools = [
    {
      id: 1,
      title: 'Simpl-AI Chat Assistant',
      description: 'Intelligent conversational AI that understands context and provides helpful responses',
      icon: MessageSquare,
      link: '/chat',
      gradient: 'from-blue-500 to-cyan-500',
      images: [
        { id: 1, url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop', title: 'Chat Interface' },
        { id: 2, url: 'https://images.unsplash.com/photo-1676277791608-ac5c78a9d2c7?w=800&h=600&fit=crop', title: 'AI Conversation' },
        { id: 3, url: 'https://images.unsplash.com/photo-1675557009875-14e1a7e5e5e4?w=800&h=600&fit=crop', title: 'Smart Responses' }
      ],
      videos: [
        { id: 1, url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', title: 'Chat Demo', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop' },
        { id: 2, url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', title: 'Feature Overview', thumbnail: 'https://images.unsplash.com/photo-1676277791608-ac5c78a9d2c7?w=400&h=300&fit=crop' }
      ],
      features: [
        { icon: Sparkles, title: 'Context Awareness', description: 'Understands conversation history and maintains context across multiple interactions for more meaningful responses.' },
        { icon: Zap, title: 'Lightning Fast', description: 'Powered by advanced neural networks delivering instant responses with sub-second latency.' },
        { icon: Shield, title: 'Privacy First', description: 'End-to-end encryption ensures your conversations remain private and secure.' },
        { icon: Globe, title: 'Multi-language', description: 'Supports 50+ languages with natural conversation flow and cultural context understanding.' }
      ]
    },
    {
      id: 2,
      title: 'Simpl-AI Code Editor',
      description: 'Simpl AI Code Editor is an intelligent coding environment designed for competitive programming and learning. It lets you generate, test, review, and improve code instantly with AI assistance. Powered by Gemini and Judge0, it helps you write optimized, error-free programs faster — complete with smart reviews, instant test results, and a clean, distraction-free interface.',
      icon: Code2,
      link: '/code',
      gradient: 'from-purple-500 to-pink-500',
      images: [
        { id: 1, url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop', title: 'Code Editor UI' },
        { id: 2, url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop', title: 'AI Suggestions' },
        { id: 3, url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=600&fit=crop', title: 'Collaboration' }
      ],
      videos: [
        { id: 1, url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: 'Editor Demo', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop' },
        { id: 2, url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', title: 'AI Features', thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop' }
      ],
      features: [
        { icon: Sparkles, title: 'Instant Code Generation', description: 'Write logic — get full, runnable programs instantly. Simpl AI transforms your function snippets into complete, ready-to-run code for any supported language.' },
        { icon: Zap, title: 'Smart Test Case Generator', description: 'Automatically generates diverse and realistic test cases based on your code’s input structure — perfect for debugging and validation.' },
        { icon: Shield, title: 'One-Click Code Execution and Review', description: 'Run your code instantly using Judge0 integration. Get real-time outputs, errors, and performance feedback directly in the editor.' },
        { icon: Globe, title: 'Multi-language Support', description: 'Supports major programming languages like Python, JavaScript, C++, and Java, with seamless execution and code transformation.' }
      ]
    }
  ];

  const toggleTab = (toolId, tab) => {
    setActiveTab(prev => ({
      ...prev,
      [toolId]: prev[toolId] === tab ? null : tab
    }));
  };

  const toggleFeatures = (toolId) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [toolId]: !prev[toolId]
    }));
  };


  return (
    <>
    <div className='min-h-screen relative overflow-hidden'>
      <Navbar/>
      <div className="absolute inset-0 -z-10">
              <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={0.5}
                speed={0.8}
              />
              <div className="absolute inset-0 -z-20 bg-black"></div>
      </div>
      <div className='flex flex-col justify-center items-center mt-4'>
        <h1 className='text-4xl text-white font-bold'>Tools</h1>
        <div className='bg-white w-[7rem] mt-2 h-[0.1rem]'></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300"
            >
              {/* Icon with gradient background */}
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${tool.gradient} mb-6`}>
                <tool.icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-3">
                {tool.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 mb-6 leading-relaxed">
                {tool.description}
              </p>

              {/* Media Tabs */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => toggleTab(tool.id, 'images')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab[tool.id] === 'images'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  <Image className="w-4 h-4" />
                  <span className="text-sm font-medium">Images</span>
                </button>
                <button
                  onClick={() => toggleTab(tool.id, 'videos')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab[tool.id] === 'videos'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span className="text-sm font-medium">Videos</span>
                </button>
              </div>

              {/* Media Gallery */}
              {activeTab[tool.id] === 'images' && (
                <div className="mb-6 grid grid-cols-3 gap-3 animate-in fade-in duration-300">
                  {tool.images.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedMedia({ type: 'image', ...img })}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group/img"
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{img.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab[tool.id] === 'videos' && (
                <div className="mb-6 grid grid-cols-2 gap-3 animate-in fade-in duration-300">
                  {tool.videos.map((vid) => (
                    <div
                      key={vid.id}
                      onClick={() => setSelectedMedia({ type: 'video', ...vid })}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group/vid"
                    >
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover/vid:scale-110 transition-transform">
                          <div className="w-0 h-0 border-l-8 border-l-gray-900 border-y-6 border-y-transparent ml-1"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="text-white text-xs font-medium drop-shadow-lg">{vid.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Features Section */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFeatures(tool.id)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors text-gray-300 hover:text-white"
                >
                  <span className="text-sm font-medium">View All Features</span>
                  {expandedFeatures[tool.id] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {expandedFeatures[tool.id] && (
                  <div className="mt-4 space-y-3 animate-in fade-in duration-300">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-3 p-3 rounded-lg bg-gray-700/20">
                        <div className={`h-fit p-2 rounded-lg bg-gradient-to-br ${tool.gradient}`}>
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-1">{feature.title}</h4>
                          <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <a
                href={tool.link}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/50"
              >
                <span>Try {tool.title.split(' ')[1]}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Decorative gradient orb */}
              <div className={`absolute -z-10 top-0 right-0 w-64 h-64 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 rounded-full`}></div>
            </div>
          ))}
        
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === 'image' ? (
              <div className="relative">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-white text-center mt-4 text-lg font-medium">
                  {selectedMedia.title}
                </p>
              </div>
            ) : (
              <div className="relative">
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-white text-center mt-4 text-lg font-medium">
                  {selectedMedia.title}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default Tools