import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Download, FileText, Sparkles, Loader2, AlertCircle } from 'lucide-react';

const Wordfile = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');

  const generateContent = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `Create a comprehensive, well-structured document about "${topic}". 
      The document should include:
      - A clear title
      - Introduction
      - Main sections with subheadings
      - Detailed explanations
      - Conclusion
      
      Format it professionally for a Microsoft Word document with proper structure and flow.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setGeneratedContent(text);
    } catch (err) {
      setError('Failed to generate content. Please check your API key and try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadWordFile = () => {
    if (!generatedContent) return;

    // Create a simple HTML structure that Word can interpret
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${topic}</title>
          <style>
            body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 40px; }
            h1 { color: #2c3e50; text-align: center; margin-bottom: 30px; }
            h2 { color: #34495e; margin-top: 25px; margin-bottom: 15px; }
            h3 { color: #5d6d7e; margin-top: 20px; margin-bottom: 10px; }
            p { margin-bottom: 12px; text-align: justify; }
          </style>
        </head>
        <body>
          ${generatedContent.replace(/\n/g, '<br>').replace(/#{1,3}\s+(.+)/g, (match, title) => {
            const level = match.split('#').length - 1;
            return `<h${level}>${title}</h${level}>`;
          })}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Simpl-AI Word Generator
          </h1>
          <p className="text-lg text-gray-600">
            Transform any topic into a professional Word document with AI
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Input Section */}
          <div className="p-8 border-b border-gray-100">
            <div className="space-y-6">

              {/* Topic Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Document Topic
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Climate Change, Machine Learning, Business Strategy..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    onKeyDown={(e) => e.key === 'Enter' && !isGenerating && generateContent()}
                  />
                  <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generateContent}
                disabled={isGenerating || !topic.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Content...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Document</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content Preview & Download Section */}
          {generatedContent && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Generated Content
                </h3>
                <button
                  onClick={downloadWordFile}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Word File</span>
                </button>
              </div>

              {/* Content Preview */}
              <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto border">
                <div className="prose prose-gray max-w-none">
                  {generatedContent.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return (
                        <h1 key={index} className="text-2xl font-bold text-gray-900 mb-4">
                          {line.replace('# ', '')}
                        </h1>
                      );
                    } else if (line.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                          {line.replace('## ', '')}
                        </h2>
                      );
                    } else if (line.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-lg font-medium text-gray-700 mb-2 mt-4">
                          {line.replace('### ', '')}
                        </h3>
                      );
                    } else if (line.trim()) {
                      return (
                        <p key={index} className="text-gray-700 mb-3 leading-relaxed">
                          {line}
                        </p>
                      );
                    }
                    return <br key={index} />;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600 text-sm">
              Leverages Google's Gemini AI to create comprehensive, well-structured documents
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Format</h3>
            <p className="text-gray-600 text-sm">
              Generates properly formatted documents ready for professional use
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Download</h3>
            <p className="text-gray-600 text-sm">
              Download your generated document as a Word file with a single click
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Google Gemini AI • Built with React</p>
        </div>
      </div>
    </div>
  );
};

export default Wordfile;