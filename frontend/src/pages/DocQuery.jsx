import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { authClient } from '../utils/auth_client';
import { toast } from "react-toastify";
import MainLogo from "../assets/images/MainLogo.png";
import { Upload, Send, FileText, MessageSquare, Trash2, X, Menu, ChevronLeft } from 'lucide-react';
import { BiSolidFileTxt } from "react-icons/bi";
import { BsFileEarmarkPptFill } from "react-icons/bs";
import { IoDocumentTextSharp } from "react-icons/io5";
import { BiSolidFilePdf } from "react-icons/bi";
import { FaFileWord } from "react-icons/fa6";
import { v4 as uuidv4 } from 'uuid';

const AxiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
    timeout: 10000000,
    headers: { "X-Custom-Header": "foobar" },
});

export default function DocQuery() {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [chatInitial, setChatInitial] = useState(false);
    const { data: session } = authClient.useSession();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [Chat, setChat] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [IsUploaded, setIsUploaded] = useState(false);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!session?.user?.id) return;
        const fetchChatHistory = async () => {
            try {
                const res = await AxiosInstance.get(`/doc/api/doc_chat_instance_list`, {
                    headers: {
                        userid: session.user.id,
                    }
                });
                setChatHistory(res.data.instances);
            } catch (error) {
                console.log("Error fetching chat history:", error);
                toast.error("Failed to fetch chat instance list");

            }
        }
        fetchChatHistory();
        console.log("hello");
    }, [session]);


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain'
        ];

        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid document file (PDF, Word, PowerPoint, or TXT)');
            return;
        }

        setUploadedFile(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log("Uploading file:", file);

            const res = await AxiosInstance.post(`/doc/api/upload_doc/${currentChatId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    userid: session.user.id,
                },
            });

            const data = res.data;
            setIsUploaded(true);

            if (data.success) {
                setMessages([{
                    is_human: 0,
                    doc_chat_message: `Document "${file.name}" uploaded and processed. You can now ask questions.`,
                }]);

                setChatHistory((prev) =>
                    prev.map((chat) => {
                        if (chat.doc_instance_id === currentChatId) {

                            let docType = "none";

                            if (file?.type) {
                                if (file.type.includes("pdf")) docType = "pdf";
                                else if (file.type.includes("word")) docType = "docx";
                                else if (file.type.includes("presentation")) docType = "ppt";
                                else if (file.type === "text/plain") docType = "txt";
                            }

                            return {
                                ...chat,
                                doc_type: docType,
                                doc_topic_message: file?.name || chat.doc_topic_message,
                            };
                        }

                        return chat; 
                    })
                );

            } else {
                toast.error('Processing failed.');
            }
        } catch (error) {
            toast.error('Error uploading file. Please try again.');
        }
    };


    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        if (!IsUploaded) {
            alert('Please upload a document first');
            return;
        }

        try {
            const userMessageId = uuidv4();
            const aiMessageId = uuidv4();
            const userMessage = {
                id: userMessageId,
                is_human: true,
                doc_chat_message: inputMessage,
            };

            setMessages(prev => [...prev, userMessage]);
            setInputMessage('');
            setIsProcessing(true);

            const res = await AxiosInstance.post(`/doc/api/ask/${currentChatId}`, {
                userMessageId: userMessageId,
                aiMessageId: aiMessageId,
                question: inputMessage,
                userId: session.user.id,
            })

            const aiMessage = {
                id: aiMessageId,
                is_human: false,
                doc_chat_message: res?.data?.answer || "Technical error occured",
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsProcessing(false);

        } catch (error) {
            console.log("Error sending message:", error);
            toast.error("Failed to send message. Please try again.");
            setIsProcessing(false);

        }
    };

    const handleNewChat = async () => {
        try {
            let n_id = uuidv4();
            const New_Chat_id = n_id.replaceAll("-", "_");
            const res = await AxiosInstance.post(`/doc/api/new_chat/${New_Chat_id}`, {
                userId: session.user.id,
            });

            const ChatHistory = chatHistory.map(item => ({
                ...item,
            }));

            setChatHistory([...ChatHistory, {
                doc_instance_id: New_Chat_id,
                doc_topic_message: 'New Chat',
                doc_type: 'none',
            }])

            setMessages([]);
            setUploadedFile(null);
            setCurrentChatId(New_Chat_id);
        } catch (error) {
            console.log("Error creating new chat:", error);
            toast.error("Failed to save data in the database");
        }

    };

    const handleDeleteChat = async (chatId, e) => {
        e.stopPropagation();
        try {
            await AxiosInstance.delete('/doc/api/delete_doc_chat', {
                data: {
                    userId: session.user.id,
                    instanceId: chatId,
                }
            });
            setChatHistory(prev => prev.filter(chat => chat.doc_instance_id !== chatId));

            setChatInitial(false);
            setMessages([]);
            setUploadedFile(null);
            setCurrentChatId(null);
            setIsUploaded(false);
            toast.success("Chat deleted successfully");

        } catch (error) {
            console.log("Error deleting chat:", error);
            toast.error("Failed to delete chat");

        }
    };

    const loadChat = async (chatId, chat) => {
        setCurrentChatId(chatId);
        setChat(chat);

        if (chatId === currentChatId) return;
        if (chat.doc_type == 'none') {
            setMessages([]);
            setIsUploaded(false);
            return;
        }
        try {
            setIsUploaded(true);
            const res = await AxiosInstance.get(`/doc/api/doc_chat_history/${chatId}`, {
                headers: {
                    userid: session.user.id,
                }
            })
            setMessages(res.data.chatHistory);
            setChatInitial(true);

        } catch (error) {
            console.log(error);
            toast.error("Failed to load chat history");

        }
    };

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Sidebar */}
            <div className={`${showSidebar ? 'w-80 translate-x-0' : 'w-0 -translate-x-[13rem]'} transition-all duration-300 bg-black/30 backdrop-blur-sm border-r border-white/10 flex flex-col overflow-hidden`}>
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-cyan-400">
                            Chat History
                        </h2>
                        <button
                            onClick={() => setShowSidebar(false)}
                            className=" p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => { setChatInitial(true); handleNewChat(); }}
                        className="w-full py-3 px-4 bg-[#282828] hover:bg-cyan-600 rounded-xl font-medium   transition-all transform hover:scale-105 shadow-lg"
                    >
                        + New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {chatHistory.map(chat => (
                        <div
                            key={chat.doc_instance_id}
                            onClick={() => loadChat(chat.doc_instance_id, chat)}
                            className={`p-4 rounded-xl cursor-pointer transition-all hover:bg-white/10 group ${currentChatId === chat.doc_instance_id ? 'bg-white/10 border border-cyan-400/30' : 'bg-white/5'
                                }`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    {chat.doc_type == "none" && <IoDocumentTextSharp className='size-6' />}
                                    {chat.doc_type == "docx" && <FaFileWord className={`size-6 text-blue-300 group-hover:text-blue-600 ${currentChatId === chat.id && 'text-blue-600'}`} />}
                                    {chat.doc_type == "pdf" && <BiSolidFilePdf className={`size-6 text-red-300 group-hover:text-red-600 ${currentChatId === chat.id && 'text-blue-600'}`} />}
                                    {chat.doc_type == "ppt" && <BsFileEarmarkPptFill className={`size-6 text-orange-300 group-hover:text-orange-600 ${currentChatId === chat.id && 'text-orange-600'}`} />}
                                    {chat.doc_type == "txt" && <BiSolidFileTxt className={`size-6 text-gray-300 group-hover:text-gray-600 ${currentChatId === chat.id && 'text-gray-600'}`} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate mb-1">{chat.doc_topic_message}</h3>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteChat(chat.doc_instance_id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {
                        chatHistory.length === 0 && (
                            <p className="text-gray-500 text-sm text-center mt-10">No chats yet. Click "New Chat" to start
                            </p>
                        )
                    }
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {!showSidebar && (
                                <button
                                    onClick={() => setShowSidebar(true)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                            )}
                            <div className='flex justify-center items-center gap-4'>
                                <img className="w-8 h-8 sm:w-[3rem] sm:h-[3rem]" src={MainLogo} alt="Simpl AI Logo" />
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-cyan-400">
                                        DocQuery
                                    </h1>
                                    <p className="text-sm text-gray-400 mt-1">Ask anything about your documents</p>
                                </div>
                            </div>
                        </div>

                        {(uploadedFile || IsUploaded) && (
                            <div className="hidden md:flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                <FileText className="w-5 h-5 text-cyan-400" />
                                <div className="max-w-xs">
                                    <p className="text-sm font-medium truncate">{Chat?.doc_file_name || uploadedFile?.name}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {chatInitial === false && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        <div className="text-center max-w-2xl mx-auto">
                            <div className="flex items-center justify-center">
                                <img className="w-[5rem] h-[5rem]" src={MainLogo} alt="Simpl AI Logo" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2 mt-4">Welcome to DocQuery</h2>
                                <p className="text-gray-400 mb-8">
                                    Upload your documents and start asking questions about their content.
                                </p>
                            </div>
                            <button
                                onClick={() => { setChatInitial(true); handleNewChat(); }}
                                className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                )}

                {/* Chat Area */}
                {chatInitial && (<div className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {IsUploaded == false ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-2xl mx-auto">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-3xl flex items-center justify-center">
                                    <Upload className="w-12 h-12 text-cyan-400" />
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Upload a Document to Begin</h2>
                                <p className="text-gray-400 mb-8">
                                    Support for PDF, Word, PowerPoint, and Text files
                                </p>

                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.is_human ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl p-4 ${msg.is_human
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                            : msg.is_human === false
                                                ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-100'
                                                : 'bg-white/10 backdrop-blur-sm border border-white/10'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.doc_chat_message}</p>
                                        {/* {msg.timestamp && (
                                            <p className="text-xs opacity-70 mt-2">{msg.timestamp}</p>
                                        )} */}
                                    </div>
                                </div>
                            ))}
                            {isProcessing && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-cyan-800 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>)}


                {/* Input Area */}
                {chatInitial && (<div className="bg-black/30 backdrop-blur-sm border-t border-white/10 p-4 lg:p-6">
                    <div className="max-w-4xl mx-auto">
                        {!uploadedFile && !IsUploaded && (
                            <div className="mb-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileUpload}
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-3 px-4 bg-white/5 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/10 hover:border-cyan-400/50 transition-all flex items-center justify-center space-x-2"
                                >
                                    <Upload className="w-5 h-5" />
                                    <span>Upload Document</span>
                                </button>
                            </div>
                        )}

                        <div className="flex items-end space-x-3">
                            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 focus-within:border-cyan-400/50 transition-all">
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder={IsUploaded ? "Ask a question about your document..." : "Upload a document first..."}
                                    disabled={!IsUploaded || isProcessing}
                                    className="w-full bg-transparent px-6 py-4 text-white placeholder-gray-400 focus:outline-none resize-none"
                                    rows="1"
                                    style={{ minHeight: '56px', maxHeight: '120px' }}
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!IsUploaded || !inputMessage.trim() || isProcessing}
                                className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                            >
                                <Send className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                            Press Enter to send, Shift+Enter for new line
                        </p>
                    </div>
                </div>)}
            </div>
        </div>
    );
}