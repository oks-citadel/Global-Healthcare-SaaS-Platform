'use client';

import React, { useState } from 'react';
import { ClinicalNote } from '@/types/provider';

interface ClinicalNoteEditorProps {
  encounterId: string;
  initialNote?: Partial<ClinicalNote>;
  onSave: (note: Partial<ClinicalNote>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const noteTypes = [
  { value: 'subjective', label: 'Subjective (S)', color: 'blue' },
  { value: 'objective', label: 'Objective (O)', color: 'green' },
  { value: 'assessment', label: 'Assessment (A)', color: 'yellow' },
  { value: 'plan', label: 'Plan (P)', color: 'purple' },
  { value: 'progress', label: 'Progress Note', color: 'indigo' },
  { value: 'discharge', label: 'Discharge Summary', color: 'red' },
];

export default function ClinicalNoteEditor({
  encounterId,
  initialNote,
  onSave,
  onCancel,
  isLoading = false,
}: ClinicalNoteEditorProps) {
  const [noteType, setNoteType] = useState<ClinicalNote['noteType']>(
    initialNote?.noteType || 'progress'
  );
  const [content, setContent] = useState(initialNote?.content || '');
  const [isPrivate, setIsPrivate] = useState(initialNote?.isPrivate || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSave({
      encounterId,
      noteType,
      content: content.trim(),
      isPrivate,
    });
  };

  const handleQuickText = (text: string) => {
    setContent((prev) => prev + (prev ? '\n\n' : '') + text);
  };

  const quickTexts = {
    subjective: [
      'Patient reports...',
      'Chief complaint:',
      'History of present illness:',
      'Review of symptoms:',
    ],
    objective: [
      'Vital signs: BP , HR , Temp , RR , O2 Sat %',
      'Physical examination:',
      'General appearance:',
      'HEENT:',
      'Cardiovascular:',
      'Respiratory:',
      'Abdomen:',
      'Extremities:',
      'Neurological:',
    ],
    assessment: [
      'Primary diagnosis:',
      'Differential diagnoses:',
      'Assessment:',
      'Clinical impression:',
    ],
    plan: [
      'Treatment plan:',
      'Medications prescribed:',
      'Follow-up:',
      'Patient education:',
      'Referrals:',
      'Orders:',
    ],
  };

  const currentQuickTexts =
    quickTexts[noteType as keyof typeof quickTexts] || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Note Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {noteTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setNoteType(type.value as ClinicalNote['noteType'])}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  noteType === type.value
                    ? `bg-${type.color}-600 text-white`
                    : `bg-${type.color}-50 text-${type.color}-700 hover:bg-${type.color}-100`
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Text Templates */}
        {currentQuickTexts.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Text Templates
            </label>
            <div className="flex flex-wrap gap-2">
              {currentQuickTexts.map((text, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickText(text)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Editor */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Clinical Note Content
          </label>
          <textarea
            id="content"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Enter clinical note content..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            {content.length} characters
          </p>
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center">
          <input
            id="isPrivate"
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
            Private note (only visible to providers)
          </label>
        </div>

        {/* Common Formatting Shortcuts */}
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs font-medium text-gray-700 mb-1">
            Formatting Tips:
          </p>
          <ul className="text-xs text-gray-600 space-y-0.5">
            <li>• Use blank lines to separate sections</li>
            <li>• Start lines with "-" or "•" for bullet points</li>
            <li>• Use CAPITAL LETTERS for section headers</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </form>
    </div>
  );
}

interface ClinicalNoteDisplayProps {
  note: ClinicalNote;
  onEdit?: (note: ClinicalNote) => void;
  canEdit?: boolean;
}

export function ClinicalNoteDisplay({ note, onEdit, canEdit = false }: ClinicalNoteDisplayProps) {
  const noteTypeColors: Record<ClinicalNote['noteType'], string> = {
    subjective: 'blue',
    objective: 'green',
    assessment: 'yellow',
    plan: 'purple',
    progress: 'indigo',
    discharge: 'red',
  };

  const color = noteTypeColors[note.noteType];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}
          >
            {note.noteType.charAt(0).toUpperCase() + note.noteType.slice(1)}
          </span>
          {note.isPrivate && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Private
            </span>
          )}
        </div>
        {canEdit && onEdit && (
          <button
            onClick={() => onEdit(note)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        )}
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium text-gray-900">{note.authorName}</p>
        <p className="text-xs text-gray-500">
          {new Date(note.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="prose prose-sm max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
          {note.content}
        </pre>
      </div>
    </div>
  );
}
