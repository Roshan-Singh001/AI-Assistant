import React from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Chmarkdown = ({markdownStr}) => {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert px-4 ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings with better spacing and typography
          h1: ({children}) => (
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white dark:text-white mb-4 mt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              {children}
            </h1>
          ),
          h2: ({children}) => (
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white dark:text-gray-100 mb-3 mt-5 ">
              {children}
            </h2>
          ),
          h3: ({children}) => (
            <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-white dark:text-gray-100 mb-3 mt-4  ">
              {children}
            </h3>
          ),
          h4: ({children}) => (
            <h4 className="text-base sm:text-lg lg:text-xl font-medium text-white dark:text-gray-200 mb-2.5 mt-3 ">
              {children}
            </h4>
          ),
          h5: ({children}) => (
            <h5 className="text-sm sm:text-base lg:text-lg font-medium text-white dark:text-gray-200 mb-2 mt-3 ">
              {children}
            </h5>
          ),
          h6: ({children}) => (
            <h6 className="text-sm sm:text-base font-medium text-white dark:text-gray-300 mb-2 mt-3 ">
              {children}
            </h6>
          ),
          
          // Paragraphs with better spacing
          p: ({children}) => (
            <p className="text-sm sm:text-base text-white dark:text-gray-300 mb-3">
              {children}
            </p>
          ),
          
          // Enhanced lists
          ul: ({children}) => (
            <ul className="list-disc list-inside space-y-1.5 mb-3 text-sm sm:text-base text-white dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({children}) => (
            <ol className="list-decimal list-inside space-y-1.5 mb-3 text-sm sm:text-base text-white dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({children}) => (
            <li className="ml-2 ">
              {children}
            </li>
          ),
          
          // Blockquotes with modern styling
          blockquote: ({children}) => (
            <blockquote className="border-l-2 sm:border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-800 pl-3 py-3 mb-4 italic text-sm sm:text-base text-gray-700 dark:text-gray-300 rounded-r-lg">
              {children}
            </blockquote>
          ),
          
          // Links with hover effects
          a: ({children, href}) => (
            <a 
              href={href} 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-600/30 hover:decoration-blue-600 transition-colors duration-200 text-sm sm:text-base break-words"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Enhanced tables
          table: ({children}) => (
            <div className="overflow-x-auto mb-4 -mx-4 ">
              <table className="min-w-full bg-white dark:bg-gray-800 sm:rounded-xl overflow-auto">
                {children}
              </table>
            </div>
          ),
          thead: ({children}) => (
            <thead className="bg-gray-50 dark:bg-gray-900">
              {children}
            </thead>
          ),
          th: ({children}) => (
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
              {children}
            </th>
          ),
          td: ({children}) => (
            <td className="px-3 py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              {children}
            </td>
          ),
          
          // Horizontal rules
          hr: () => (
            <hr className="my-6 border-t border-gray-300 dark:border-gray-600" />
          ),
          
          // Inline code with better styling
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            
            if (!inline && match) {
              return (
                <div className="mb-4 -mx-4 ">
                  <div className="bg-gray-900 sm:rounded-t-lg px-3 py-2 border-b border-gray-700">
                    <span className="text-gray-400 text-xs sm:text-sm font-mono">
                      {match[1]}
                    </span>
                  </div>
                  <div className="sm:rounded-b-lg overflow-hidden">
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      className="!m-0 !rounded-none"
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        fontSize: window.innerWidth < 640 ? '12px' : '14px',
                        lineHeight: '1.5',
                        padding: window.innerWidth < 640 ? '12px' : '16px'
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            }
            
            return (
              <code 
                className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono border border-gray-200 dark:border-gray-700 break-words" 
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // Enhanced images
          img: ({src, alt}) => (
            <div className="mb-4 ">
              <img 
                src={src} 
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              />
              {alt && (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-2 italic px-2">
                  {alt}
                </p>
              )}
            </div>
          ),
          
          // Task lists (checkboxes)
          input: ({type, checked, disabled}) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  readOnly
                />
              );
            }
            return <input type={type} checked={checked} disabled={disabled} />;
          }
        }}
        className="max-w-none"
      >
        {markdownStr}
      </ReactMarkdown>
    </div>
  );
};

export default Chmarkdown;