// src/components/RecorderControls.jsx
import React, { useRef, useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function RecorderControls({ onRecordComplete }) {
  const recorder = useRef(null); // Tone.Recorder 인스턴스를 저장할 ref
  const [isRecording, setIsRecording] = useState(false); // 녹음 중 여부
  const [recordingUrl, setRecordingUrl] = useState(null); // 녹음된 오디오 URL

  // 컴포넌트 마운트 시 Tone 시작 후 Recorder 연결
  useEffect(() => {
    Tone.start().then(() => {
      recorder.current = new Tone.Recorder(); // Recorder 생성
      Tone.Destination.connect(recorder.current);
    });
    return () => recorder.current?.dispose();
  }, []);

  const startRecording = () => {
    recorder.current.start(); // Recorder 시작
    setIsRecording(true);
    setRecordingUrl(null);
  };

  const stopRecording = async () => {
    const recording = await recorder.current.stop(); // 녹음 종료 후 Blob 반환
    const url = URL.createObjectURL(recording); // Blob → URL
    setRecordingUrl(url);
    setIsRecording(false);
    if (onRecordComplete) onRecordComplete(url);
  };

  // '/' 키로 녹음 토글
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/') {
        if (!isRecording) {
          startRecording();
        } else {
          stopRecording();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecording]);

  // 오디오 드래그 시작 시 URL 전송
  const handleDragStart = (e) => {
    if (recordingUrl) {
      e.dataTransfer.setData('audio/url', recordingUrl);
    }
  };

  return (
    <div className="flex space-x-4 items-center">
      {/* 녹음/정지 버튼 */}
      <button
        id="recordButton"
        onClick={isRecording ? stopRecording : startRecording}
        className="px-[20px] py-[10px] bg-red-500 text-white rounded"
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {/* 녹음된 오디오 컨트롤러 */}
      {recordingUrl && (
        <audio
          src={recordingUrl}
          controls
          className="ml-4"
          draggable
          onDragStart={handleDragStart}
        />
      )}
    </div>
  );
}
