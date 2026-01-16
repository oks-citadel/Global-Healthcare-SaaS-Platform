'use client';

import { Signal } from 'lucide-react';

interface ConnectionQuality {
  bitrate: number;
  packetsLost: number;
  jitter: number;
  latency: number;
}

interface CallQualityProps {
  quality: ConnectionQuality | null;
}

export function CallQuality({ quality }: CallQualityProps) {
  if (!quality) {
    return null;
  }

  // Calculate quality score (0-100)
  const calculateQualityScore = (): number => {
    let score = 100;

    // Deduct points for packet loss (0-40 points)
    if (quality.packetsLost > 0) {
      score -= Math.min(40, quality.packetsLost * 2);
    }

    // Deduct points for jitter (0-30 points)
    if (quality.jitter > 0.03) {
      // > 30ms
      score -= Math.min(30, (quality.jitter - 0.03) * 1000);
    }

    // Deduct points for latency (0-30 points)
    if (quality.latency > 150) {
      // > 150ms
      score -= Math.min(30, (quality.latency - 150) / 10);
    }

    return Math.max(0, Math.floor(score));
  };

  const qualityScore = calculateQualityScore();

  const getQualityLevel = (): {
    label: string;
    color: string;
    bars: number;
  } => {
    if (qualityScore >= 80) {
      return { label: 'Excellent', color: 'text-green-500', bars: 4 };
    } else if (qualityScore >= 60) {
      return { label: 'Good', color: 'text-blue-500', bars: 3 };
    } else if (qualityScore >= 40) {
      return { label: 'Fair', color: 'text-yellow-500', bars: 2 };
    } else {
      return { label: 'Poor', color: 'text-red-500', bars: 1 };
    }
  };

  const qualityLevel = getQualityLevel();

  // Format bitrate
  const formatBitrate = (bits: number): string => {
    if (bits === 0) return '0 bps';
    const kbps = bits / 1000;
    if (kbps < 1000) {
      return `${kbps.toFixed(1)} Kbps`;
    }
    const mbps = kbps / 1000;
    return `${mbps.toFixed(2)} Mbps`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Connection Quality</h3>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`w-1 rounded-full transition-all ${
                bar <= qualityLevel.bars
                  ? `${qualityLevel.color.replace('text', 'bg')} h-${bar + 2}`
                  : 'bg-gray-300 h-3'
              }`}
              style={{ height: `${bar * 4 + 4}px` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`text-sm font-medium ${qualityLevel.color}`}>
            {qualityLevel.label}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Bitrate:</span>
            <span className="text-gray-900 font-medium">
              {formatBitrate(quality.bitrate)}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Packets Lost:</span>
            <span
              className={`font-medium ${
                quality.packetsLost > 10
                  ? 'text-red-600'
                  : quality.packetsLost > 5
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}
            >
              {quality.packetsLost}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Jitter:</span>
            <span className="text-gray-900 font-medium">
              {(quality.jitter * 1000).toFixed(1)} ms
            </span>
          </div>

          {quality.latency > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Latency:</span>
              <span
                className={`font-medium ${
                  quality.latency > 200
                    ? 'text-red-600'
                    : quality.latency > 150
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              >
                {quality.latency} ms
              </span>
            </div>
          )}
        </div>

        {qualityScore < 60 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-3">
            <p className="text-xs text-yellow-800">
              {qualityScore < 40
                ? 'Poor connection detected. Consider checking your network.'
                : 'Connection quality could be better. You may experience issues.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
