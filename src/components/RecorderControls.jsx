// import React, { useRef, useState, useEffect } from 'react';
// import * as Tone from 'tone';

// export default function RecorderControls() {
//   const recorder = useRef(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingUrl, setRecordingUrl] = useState(null);

//   // 초기화: Recorder 연결
//   useEffect(() => {
//     const init = async () => {
//       await Tone.start();
//       recorder.current = new Tone.Recorder();
//       Tone.Destination.connect(recorder.current);
//     };
//     init();
//     return () => recorder.current?.dispose();
//   }, []);

//   // 녹음 시작
//   const startRecording = async () => {
//     await Tone.start();
//     recorder.current.start();
//     setIsRecording(true);
//     setRecordingUrl(null);
//   };

//   // 녹음 중지 및 URL 생성
//   const stopRecording = async () => {
//     const recording = await recorder.current.stop();
//     const url = URL.createObjectURL(recording);
//     setRecordingUrl(url);
//     setIsRecording(false);
//   };

//   // 녹음 재생
//   const playRecording = () => {
//     if (recordingUrl) {
//       new Audio(recordingUrl).play();
//     }
//   };

//   return (
//     <div className="flex space-x-4">
//       <button
//         onClick={isRecording ? stopRecording : startRecording}
//         className="px-4 py-2 rounded-lg shadow bg-red-500 text-white"
//       >
//         {isRecording ? 'Stop Recording' : 'Start Recording'}
//       </button>
//       <button
//         onClick={playRecording}
//         disabled={!recordingUrl}
//         className="px-4 py-2 rounded-lg shadow bg-green-500 text-white disabled:opacity-50"
//       >
//         Play Recording
//       </button>
//       {recordingUrl && <audio controls src={recordingUrl} className="mt-2" />}
//     </div>
//   );
// }


// src/components/RecorderControls.jsx
import React, { useRef, useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function RecorderControls({ onRecordComplete }) {
  const recorder = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(null);

  useEffect(() => {
    Tone.start().then(() => {
      recorder.current = new Tone.Recorder();
      Tone.Destination.connect(recorder.current);
    });
    return () => recorder.current?.dispose();
  }, []);

  const startRecording = () => {
    recorder.current.start();
    setIsRecording(true);
    setRecordingUrl(null);
  };

  const stopRecording = async () => {
    const recording = await recorder.current.stop();
    const url = URL.createObjectURL(recording);
    setRecordingUrl(url);
    setIsRecording(false);
    if (onRecordComplete) onRecordComplete(url);
  };

  const handleDragStart = (e) => {
    if (recordingUrl) {
      e.dataTransfer.setData('audio/url', recordingUrl);
    }
  };

  return (
    <div className="flex space-x-4 items-center">
      <button id="recordButton"
        onClick={isRecording ? stopRecording : startRecording}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
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
