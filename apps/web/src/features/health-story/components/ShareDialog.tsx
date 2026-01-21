'use client';

/**
 * ShareDialog Component
 * Modal dialog for sharing health story with configurable permissions
 */

import React, { useState, useEffect } from 'react';
import { SharePermissions, ShareConfig } from '../types';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (permissions: SharePermissions, expiresIn: number) => Promise<ShareConfig>;
  availableChapters: Array<{ id: string; title: string }>;
  existingShares?: ShareConfig[];
  isLoading?: boolean;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  onShare,
  availableChapters,
  existingShares = [],
  isLoading = false,
}) => {
  const [permissions, setPermissions] = useState<SharePermissions>({
    viewTimeline: true,
    viewDocuments: false,
    viewLabResults: false,
    viewMedications: true,
    downloadEnabled: false,
    chaptersIncluded: availableChapters.map((c) => c.id),
  });

  const [expiresIn, setExpiresIn] = useState(72);
  const [shareResult, setShareResult] = useState<ShareConfig | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  useEffect(() => {
    if (isOpen) {
      setShareResult(null);
      setCopySuccess(false);
    }
  }, [isOpen]);

  const handleShare = async () => {
    try {
      const result = await onShare(permissions, expiresIn);
      setShareResult(result);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const toggleChapter = (chapterId: string) => {
    setPermissions((prev) => ({
      ...prev,
      chaptersIncluded: prev.chaptersIncluded.includes(chapterId)
        ? prev.chaptersIncluded.filter((id) => id !== chapterId)
        : [...prev.chaptersIncluded, chapterId],
    }));
  };

  const selectAllChapters = () => {
    setPermissions((prev) => ({
      ...prev,
      chaptersIncluded: availableChapters.map((c) => c.id),
    }));
  };

  const deselectAllChapters = () => {
    setPermissions((prev) => ({
      ...prev,
      chaptersIncluded: [],
    }));
  };

  const formatExpiration = (expiresAt: string) => {
    const date = new Date(expiresAt);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs < 0) return 'Expired';
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`;
    return 'Less than 1 hour remaining';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform rounded-2xl bg-white shadow-2xl transition-all">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Share Your Health Story
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-4">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'create'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Create Share Link
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'manage'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Manage Shares ({existingShares.length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {activeTab === 'create' && !shareResult && (
              <>
                {/* Privacy notice */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Privacy Protected</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Shared links are encrypted and expire automatically. You can revoke access at any time.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    What can they see?
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Timeline Events</p>
                          <p className="text-xs text-gray-500">Appointments, procedures, diagnoses</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={permissions.viewTimeline}
                        onChange={(e) => setPermissions({ ...permissions, viewTimeline: e.target.checked })}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Medications</p>
                          <p className="text-xs text-gray-500">Current and past prescriptions</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={permissions.viewMedications}
                        onChange={(e) => setPermissions({ ...permissions, viewMedications: e.target.checked })}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Lab Results</p>
                          <p className="text-xs text-gray-500">Blood work and test results</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={permissions.viewLabResults}
                        onChange={(e) => setPermissions({ ...permissions, viewLabResults: e.target.checked })}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Documents</p>
                          <p className="text-xs text-gray-500">Uploaded files and reports</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={permissions.viewDocuments}
                        onChange={(e) => setPermissions({ ...permissions, viewDocuments: e.target.checked })}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Allow Download</p>
                          <p className="text-xs text-gray-500">Let them download a PDF copy</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={permissions.downloadEnabled}
                        onChange={(e) => setPermissions({ ...permissions, downloadEnabled: e.target.checked })}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Chapter selection */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Include chapters
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={selectAllChapters}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Select all
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={deselectAllChapters}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Deselect all
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableChapters.map((chapter) => (
                      <label
                        key={chapter.id}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={permissions.chaptersIncluded.includes(chapter.id)}
                          onChange={() => toggleChapter(chapter.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-3"
                        />
                        <span className="text-sm text-gray-700">{chapter.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Expiration */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Link expires in
                  </h3>
                  <div className="flex space-x-2">
                    {[24, 72, 168, 720].map((hours) => (
                      <button
                        key={hours}
                        onClick={() => setExpiresIn(hours)}
                        className={`flex-1 py-2 px-3 text-sm rounded-lg border ${
                          expiresIn === hours
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {hours < 48
                          ? `${hours}h`
                          : hours < 720
                          ? `${hours / 24}d`
                          : '30d'}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'create' && shareResult && (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Share Link Created!
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Expires {formatExpiration(shareResult.expiresAt)}
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={shareResult.shareUrl}
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600"
                    />
                    <button
                      onClick={() => copyToClipboard(shareResult.shareUrl)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        copySuccess
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {shareResult.qrCodeUrl && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Or scan QR code</p>
                    <img
                      src={shareResult.qrCodeUrl}
                      alt="QR Code"
                      className="w-32 h-32 mx-auto border border-gray-200 rounded-lg"
                    />
                  </div>
                )}

                <button
                  onClick={() => setShareResult(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Create another share link
                </button>
              </div>
            )}

            {activeTab === 'manage' && (
              <div>
                {existingShares.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <p className="text-gray-500">No active share links</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Create your first share link
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {existingShares.map((share) => (
                      <div
                        key={share.shareableId}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {share.permissions.chaptersIncluded.length} chapters shared
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatExpiration(share.expiresAt)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Accessed {share.accessedBy.length} times
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyToClipboard(share.shareUrl)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {activeTab === 'create' && !shareResult && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  disabled={isLoading || permissions.chaptersIncluded.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create Share Link'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;
