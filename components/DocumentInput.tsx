
import React, { useRef, useState } from 'react';
import { PaperAirplaneIcon, ArrowUpTrayIcon, XCircleIcon } from './Icons';

interface DocumentInputProps {
  documentText: string;
  setDocumentText: (text: string) => void;
  query: string;
  setQuery: (query: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({
  documentText,
  setDocumentText,
  query,
  setQuery,
  onSubmit,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setDocumentText(text);
        setFileName(file.name);
      };
      reader.onerror = () => {
        // You could set an error state here for the UI
        console.error("Error reading file.");
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setDocumentText('');
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleQueryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      onSubmit();
    }
  };
    
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 space-y-6 flex flex-col h-full">
        {/* Step 1: Document Input */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">1. Provide Document Content</h3>
            <div className="flex flex-wrap items-center gap-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".txt,.md,.text,text/plain"
                    disabled={isLoading}
                />
                <label
                    htmlFor="file-upload"
                    className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                    Upload File
                </label>
                {fileName && (
                    <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-900/50 px-3 py-1 rounded-full">
                        <span className="truncate max-w-xs">{fileName}</span>
                        <button onClick={handleClear} className="text-gray-500 hover:text-red-400 disabled:opacity-50" disabled={isLoading}>
                            <XCircleIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
            <div>
                <textarea
                    id="document-text"
                    rows={15}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 disabled:opacity-50"
                    placeholder="Upload a file or paste content here..."
                    value={documentText}
                    onChange={(e) => {
                        setDocumentText(e.target.value);
                        if (fileName) handleClear(); // Clear file if user types
                    }}
                    disabled={isLoading}
                />
            </div>
        </div>
        
        <div className="flex-grow"></div>

        {/* Step 2: Ask Question */}
        <div className="relative">
            <label htmlFor="query-text" className="block text-lg font-semibold text-gray-200 mb-2">
                2. Ask a Question
            </label>
            <input
                id="query-text"
                type="text"
                className="w-full bg-gray-900 border border-gray-600 rounded-full py-3 pl-4 pr-16 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
                placeholder="e.g., How long does a refund take?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleQueryKeyDown}
                disabled={isLoading}
            />
            <button
                onClick={onSubmit}
                disabled={isLoading || !documentText.trim() || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 mt-4 flex items-center justify-center h-9 w-9 bg-indigo-600 text-white rounded-full transition-all duration-200 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                aria-label="Submit query"
            >
                {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
                )}
            </button>
        </div>
    </div>
  );
};
