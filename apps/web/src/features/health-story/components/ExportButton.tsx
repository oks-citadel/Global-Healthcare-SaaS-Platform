'use client';

/**
 * ExportButton Component
 * Button with dropdown for exporting health story in various formats
 */

import React, { useState, useRef, useEffect } from 'react';
import { ExportConfig } from '../types';

interface ExportButtonProps {
  onExport: (config: ExportConfig) => Promise<{ downloadUrl: string; fileSize: number }>;
  availableChapters: Array<{ id: string; title: string }>;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  availableChapters,
  isLoading = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'pdf',
    includeAttachments: false,
    includeInsights: true,
    chaptersIncluded: availableChapters.map((c) => c.id),
    anonymize: false,
  });
  const [exportResult, setExportResult] = useState<{ downloadUrl: string; fileSize: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickExport = async (format: ExportConfig['format']) => {
    setIsOpen(false);
    try {
      const result = await onExport({
        ...exportConfig,
        format,
      });
      setExportResult(result);
      // Auto-download
      window.open(result.downloadUrl, '_blank');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleCustomExport = async () => {
    setShowOptions(false);
    setIsOpen(false);
    try {
      const result = await onExport(exportConfig);
      setExportResult(result);
      window.open(result.downloadUrl, '_blank');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatOptions: Array<{
    format: ExportConfig['format'];
    label: string;
    description: string;
    icon: JSX.Element;
  }> = [
    {
      format: 'pdf',
      label: 'PDF Document',
      description: 'Best for printing and sharing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      format: 'html',
      label: 'HTML Report',
      description: 'Interactive web page',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      format: 'json',
      label: 'JSON Data',
      description: 'Machine-readable format',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
    },
    {
      format: 'fhir',
      label: 'FHIR Bundle',
      description: 'Healthcare standard format',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && !showOptions && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Quick Export
            </p>
            {formatOptions.map((option) => (
              <button
                key={option.format}
                onClick={() => handleQuickExport(option.format)}
                className="w-full flex items-center px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                  {option.icon}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-gray-100 p-2">
            <button
              onClick={() => setShowOptions(true)}
              className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Customize Export
            </button>
          </div>
        </div>
      )}

      {/* Custom export options */}
      {isOpen && showOptions && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Export Options</h3>
              <button
                onClick={() => setShowOptions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Format selection */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Format
              </label>
              <div className="grid grid-cols-4 gap-2">
                {formatOptions.map((option) => (
                  <button
                    key={option.format}
                    onClick={() => setExportConfig({ ...exportConfig, format: option.format })}
                    className={`p-2 rounded-lg border text-center ${
                      exportConfig.format === option.format
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-center mb-1">{option.icon}</div>
                    <span className="text-xs">{option.format.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportConfig.includeInsights}
                  onChange={(e) =>
                    setExportConfig({ ...exportConfig, includeInsights: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include insights</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportConfig.includeAttachments}
                  onChange={(e) =>
                    setExportConfig({ ...exportConfig, includeAttachments: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include attachments</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportConfig.anonymize}
                  onChange={(e) =>
                    setExportConfig({ ...exportConfig, anonymize: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Anonymize data</span>
              </label>
            </div>

            {/* Chapter selection */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Chapters ({exportConfig.chaptersIncluded.length} selected)
              </label>
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                {availableChapters.map((chapter) => (
                  <label
                    key={chapter.id}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={exportConfig.chaptersIncluded.includes(chapter.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setExportConfig({
                            ...exportConfig,
                            chaptersIncluded: [...exportConfig.chaptersIncluded, chapter.id],
                          });
                        } else {
                          setExportConfig({
                            ...exportConfig,
                            chaptersIncluded: exportConfig.chaptersIncluded.filter(
                              (id) => id !== chapter.id
                            ),
                          });
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 truncate">
                      {chapter.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleCustomExport}
              disabled={exportConfig.chaptersIncluded.length === 0}
              className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export {exportConfig.format.toUpperCase()}
            </button>
          </div>
        </div>
      )}

      {/* Export result toast */}
      {exportResult && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-50">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Export Complete</p>
              <p className="text-xs text-gray-500 mt-1">
                File size: {formatFileSize(exportResult.fileSize)}
              </p>
              <a
                href={exportResult.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
              >
                Download again
              </a>
            </div>
            <button
              onClick={() => setExportResult(null)}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
