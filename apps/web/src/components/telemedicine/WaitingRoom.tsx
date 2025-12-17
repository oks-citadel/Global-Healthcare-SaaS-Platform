'use client';

import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';

interface WaitingRoomProps {
  onJoin: () => void;
  isLoading?: boolean;
  visitInfo?: {
    patientName?: string;
    doctorName?: string;
    appointmentTime?: string;
  };
}

export function WaitingRoom({ onJoin, isLoading = false, visitInfo }: WaitingRoomProps) {
  const [hasCamera, setHasCamera] = useState(true);
  const [hasMicrophone, setHasMicrophone] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check device permissions and get preview
  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupPreview = async () => {
      try {
        // Check if devices exist
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        const audioDevices = devices.filter((d) => d.kind === 'audioinput');

        setHasCamera(videoDevices.length > 0);
        setHasMicrophone(audioDevices.length > 0);

        // Get preview stream
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoDevices.length > 0,
          audio: audioDevices.length > 0,
        });

        setPreviewStream(stream);

        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasCamera(false);
        setHasMicrophone(false);
      }
    };

    setupPreview();

    return () => {
      // Clean up stream on unmount
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Update video track when toggled
  useEffect(() => {
    if (previewStream) {
      const videoTrack = previewStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoEnabled;
      }
    }
  }, [isVideoEnabled, previewStream]);

  // Update audio track when toggled
  useEffect(() => {
    if (previewStream) {
      const audioTrack = previewStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isAudioEnabled;
      }
    }
  }, [isAudioEnabled, previewStream]);

  const handleJoin = () => {
    // Clean up preview stream before joining
    if (previewStream) {
      previewStream.getTracks().forEach((track) => track.stop());
    }
    onJoin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Video preview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Video Consultation Waiting Room
            </h2>

            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              {hasCamera && isVideoEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                      <VideoOff className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-400">
                      {!hasCamera ? 'No camera detected' : 'Camera is off'}
                    </p>
                  </div>
                </div>
              )}

              {/* Preview controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  disabled={!hasCamera}
                  className={`p-3 rounded-full transition-all ${
                    !isVideoEnabled
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isVideoEnabled ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <VideoOff className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  disabled={!hasMicrophone}
                  className={`p-3 rounded-full transition-all ${
                    !isAudioEnabled
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isAudioEnabled ? (
                    <Mic className="w-5 h-5 text-white" />
                  ) : (
                    <MicOff className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Device status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    hasCamera ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {hasCamera ? 'Camera ready' : 'No camera detected'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    hasMicrophone ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {hasMicrophone ? 'Microphone ready' : 'No microphone detected'}
                </span>
              </div>
            </div>
          </div>

          {/* Visit information and join button */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Visit Information
                </h3>

                {visitInfo ? (
                  <div className="space-y-3">
                    {visitInfo.patientName && (
                      <div>
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="text-base font-medium text-gray-900">
                          {visitInfo.patientName}
                        </p>
                      </div>
                    )}

                    {visitInfo.doctorName && (
                      <div>
                        <p className="text-sm text-gray-500">Doctor</p>
                        <p className="text-base font-medium text-gray-900">
                          {visitInfo.doctorName}
                        </p>
                      </div>
                    )}

                    {visitInfo.appointmentTime && (
                      <div>
                        <p className="text-sm text-gray-500">Scheduled Time</p>
                        <p className="text-base font-medium text-gray-900">
                          {new Date(visitInfo.appointmentTime).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">Loading visit information...</p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Before you join:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure you're in a quiet, well-lit area</li>
                  <li>• Check your camera and microphone</li>
                  <li>• Have your medical records ready if needed</li>
                  <li>• Prepare any questions for your doctor</li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleJoin}
              disabled={isLoading || (!hasCamera && !hasMicrophone)}
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Joining...
                </>
              ) : (
                'Join Video Consultation'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
