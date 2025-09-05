import React from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Chmarkdown = ({markdownStr}) => {
  return (
    <div className="prose prose-lg prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings with better spacing and typography
          h1: ({children}) => (
            <h1 className="text-4xl font-bold text-white dark:text-white mb-6 mt-8 pb-3 border-b border-gray-200 dark:border-gray-700">
              {children}
            </h1>
          ),
          h2: ({children}) => (
            <h2 className="text-3xl font-semibold text-white dark:text-gray-100 mb-5 mt-7">
              {children}
            </h2>
          ),
          h3: ({children}) => (
            <h3 className="text-2xl font-medium text-white dark:text-gray-100 mb-4 mt-6">
              {children}
            </h3>
          ),
          h4: ({children}) => (
            <h4 className="text-xl font-medium text-white dark:text-gray-200 mb-3 mt-5">
              {children}
            </h4>
          ),
          h5: ({children}) => (
            <h5 className="text-lg font-medium text-white dark:text-gray-200 mb-3 mt-4">
              {children}
            </h5>
          ),
          h6: ({children}) => (
            <h6 className="text-base font-medium text-white dark:text-gray-300 mb-2 mt-4">
              {children}
            </h6>
          ),
          
          // Paragraphs with better spacing
          p: ({children}) => (
            <p className="text-white dark:text-gray-300 leading-7 mb-4">
              {children}
            </p>
          ),
          
          // Enhanced lists
          ul: ({children}) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-white dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({children}) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-white dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({children}) => (
            <li className="ml-4 leading-7">
              {children}
            </li>
          ),
          
          // Blockquotes with modern styling
          blockquote: ({children}) => (
            <blockquote className="border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-800 pl-6 py-4 mb-6 italic text-gray-700 dark:text-gray-300 rounded-r-lg">
              {children}
            </blockquote>
          ),
          
          // Links with hover effects
          a: ({children, href}) => (
            <a 
              href={href} 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-600/30 hover:decoration-blue-600 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Enhanced tables
          table: ({children}) => (
            <div className="overflow-x-auto mb-6">
              <table className=" bg-white dark:bg-gray-800 rounded-xl overflow-auto">
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
              {children}
            </th>
          ),
          td: ({children}) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              {children}
            </td>
          ),
          
          // Horizontal rules
          hr: () => (
            <hr className="my-8 border-t border-gray-300 dark:border-gray-600" />
          ),
          
          // Inline code with better styling
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            
            if (!inline && match) {
              return (
                <div className="mb-6">
                  <div className="bg-gray-900 rounded-t-lg px-4 py-2 border-b border-gray-700">
                    <span className="text-gray-400 text-sm font-mono">
                      {match[1]}
                    </span>
                  </div>
                  <div className="rounded-b-lg overflow-hidden">
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      className="!m-0 !rounded-none"
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        fontSize: '14px',
                        lineHeight: '1.5'
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
                className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono border border-gray-200 dark:border-gray-700" 
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // Enhanced images
          img: ({src, alt}) => (
            <div className="mb-6">
              <img 
                src={src} 
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              />
              {alt && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 italic">
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
                  className="mr-2 h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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