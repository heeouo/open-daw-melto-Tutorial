// import React, { useState, useRef } from 'react';

// export default function TrackEditor() {
//   const [tracks, setTracks] = useState([]);
//   const trackIdRef = useRef(1);
//   const clipIdRef = useRef(1);
//   const timelineDuration = 30; // 초 단위 타임라인 전체 길이

//   // 트랙 추가
//   const addTrack = () => {
//     const id = trackIdRef.current++;
//     setTracks(prev => [
//       ...prev,
//       { id, name: `Track ${id}`, volume: 0.8, clips: [] },
//     ]);
//   };

//   // 트랙 삭제
//   const deleteTrack = (trackId) => {
//     setTracks(prev => prev.filter(t => t.id !== trackId));
//   };

//   // 볼륨 수정
//   const updateVolume = (trackId, vol) => {
//     setTracks(prev => prev.map(t =>
//       t.id === trackId ? { ...t, volume: parseFloat(vol) } : t
//     ));
//   };

//   // 클립 추가 (기본: 시작 0초, 길이 5초)
//   const addClip = (trackId) => {
//     const clipId = clipIdRef.current++;
//     setTracks(prev => prev.map(t =>
//       t.id === trackId
//         ? { ...t, clips: [...t.clips, { id: clipId, start: 0, duration: 5 }] }
//         : t
//     ));
//   };

//   // 클립 드래그 시 새 시작점 계산
//   const onClipDragEnd = (e, trackId, clip) => {
//     const timelineElem = e.currentTarget.parentElement;
//     const rect = timelineElem.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const newStart = Math.max(0, Math.min((x / rect.width) * timelineDuration, timelineDuration - clip.duration));
//     setTracks(prev => prev.map(t => {
//       if (t.id !== trackId) return t;
//       return {
//         ...t,
//         clips: t.clips.map(c =>
//           c.id === clip.id ? { ...c, start: newStart } : c
//         )
//       };
//     }));
//   };

//   return (
//     <div className="p-4 space-y-6">
//       <button
//         onClick={addTrack}
//         className="px-3 py-1 bg-blue-600 text-white rounded shadow"
//       >
//         Add Track
//       </button>

//       {tracks.map(track => (
//         <div key={track.id} className="border rounded p-3 space-y-2">
//           <div className="flex items-center space-x-4">
//             <span className="font-semibold">{track.name}</span>
//             <button
//               onClick={() => deleteTrack(track.id)}
//               className="px-2 py-1 bg-red-500 text-white rounded"
//             >
//               Delete Track
//             </button>
//             <div className="flex items-center space-x-2">
//               <label>Volume:</label>
//               <input
//                 type="range"
//                 min={0} max={1} step={0.01}
//                 value={track.volume}
//                 onChange={e => updateVolume(track.id, e.target.value)}
//               />
//             </div>
//             <button
//               onClick={() => addClip(track.id)}
//               className="px-2 py-1 bg-green-500 text-white rounded"
//             >
//               Add Clip
//             </button>
//           </div>

//           <div className="relative h-12 border bg-gray-100">
//             {track.clips.map(clip => (
//               <div
//                 key={clip.id}
//                 draggable
//                 onDragEnd={e => onClipDragEnd(e, track.id, clip)}
//                 className="absolute top-0 h-full bg-blue-400 opacity-75 cursor-move rounded"
//                 style={{
//                   left: `${(clip.start / timelineDuration) * 100}%`,
//                   width: `${(clip.duration / timelineDuration) * 100}%`,
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }



// // src/components/TrackEditor.jsx
// import React, { useState, useRef } from 'react';

// export default function TrackEditor({ timelineDuration = 30 }) {
//   const [tracks, setTracks] = useState([]);
//   const trackIdRef = useRef(1);
//   const clipIdRef = useRef(1);

//   // 트랙 추가/삭제 로직은 그대로
//   const addTrack = () => {
//     const id = trackIdRef.current++;
//     setTracks(prev => [
//       ...prev,
//       { id, name: `Track ${id}`, volume: 0.8, clips: [] },
//     ]);
//   };
//   const deleteTrack = (tid) =>
//     setTracks(prev => prev.filter(t => t.id !== tid));

//   // 볼륨 변경
//   const updateVolume = (tid, vol) => {
//     setTracks(prev =>
//       prev.map(t => (t.id === tid ? { ...t, volume: parseFloat(vol) } : t))
//     );
//   };

//   // Drop 핸들러: dataTransfer 에서 URL 꺼내서 클립 생성
//   const handleDrop = (e, trackId) => {
//     e.preventDefault();
//     const url = e.dataTransfer.getData('audio/url');
//     if (!url) return;

//     // 타임라인 절대 시간 계산
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const start = (x / rect.width) * timelineDuration;

//     // 오디오 메타데이터 로드해서 duration 얻기
//     const audio = new Audio(url);
//     audio.addEventListener('loadedmetadata', () => {
//       const duration = audio.duration;
//       const clipId = clipIdRef.current++;
//       setTracks(prev =>
//         prev.map(t =>
//           t.id === trackId
//             ? {
//                 ...t,
//                 clips: [
//                   ...t.clips,
//                   { id: clipId, start, duration, url, loop: false },
//                 ],
//               }
//             : t
//         )
//       );
//     });
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   // 루프 토글
//   const toggleLoop = (trackId, clipId) => {
//     setTracks(prev =>
//       prev.map(t => {
//         if (t.id !== trackId) return t;
//         return {
//           ...t,
//           clips: t.clips.map(c =>
//             c.id === clipId ? { ...c, loop: !c.loop } : c
//           ),
//         };
//       })
//     );
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <button onClick={addTrack} className="px-3 py-1 bg-blue-600 text-white rounded">
//         Add Track
//       </button>
//       {tracks.map(track => (
//         <div key={track.id} className="border rounded p-3 space-y-2">
//           <div className="flex items-center space-x-4">
//             <span className="font-semibold">{track.name}</span>
//             <button
//               onClick={() => deleteTrack(track.id)}
//               className="px-2 py-1 bg-red-500 text-white rounded"
//             >
//               Delete
//             </button>
//             <div className="flex items-center space-x-2">
//               <label>Vol</label>
//               <input
//                 type="range"
//                 min={0} max={1} step={0.01}
//                 value={track.volume}
//                 onChange={e => updateVolume(track.id, e.target.value)}
//               />
//             </div>
//           </div>
//           <div
//             className="relative h-12 border bg-gray-100"
//             onDrop={e => handleDrop(e, track.id)}
//             onDragOver={handleDragOver}
//           >
//             {track.clips.map(clip => (
//               <div
//                 key={clip.id}
//                 className="absolute top-0 h-full bg-blue-400 opacity-75 rounded flex items-center justify-end pr-1"
//                 style={{
//                   left: `${(clip.start / timelineDuration) * 100}%`,
//                   width: `${(clip.duration / timelineDuration) * 100}%`,
//                 }}
//               >
//                 <button
//                   onClick={() => toggleLoop(track.id, clip.id)}
//                   className={`text-xs px-1 rounded ${
//                     clip.loop ? 'bg-green-600 text-white' : 'bg-gray-200'
//                   }`}
//                 >
//                   {clip.loop ? 'Loop On' : 'Loop Off'}
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }







import React, { useState, useRef, useEffect } from 'react';

export default function TrackEditor({ recordedUrl, timelineDuration = 30 }) {
  const [tracks, setTracks] = useState([]);
  const trackIdRef = useRef(1);
  const clipIdRef = useRef(1);

  // 트랙 추가
  const addTrack = () => {
    const id = trackIdRef.current++;
    setTracks(prev => [
      ...prev,
      { id, name: `Track ${id}`, volume: 0.8, clips: [], loop: false },
    ]);
  };

  // 트랙 삭제
  const deleteTrack = (trackId) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
  };

  // 볼륨 변경
  const updateVolume = (trackId, vol) => {
    setTracks(prev => prev.map(t =>
      t.id === trackId ? { ...t, volume: parseFloat(vol) } : t
    ));
  };

  // 녹음된 URL로 클립 추가
  const addRecordedClip = (trackId) => {
    if (!recordedUrl) return;
    const audio = new Audio(recordedUrl);
    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration;
      const clipId = clipIdRef.current++;
      setTracks(prev => prev.map(t =>
        t.id === trackId
          ? { ...t, clips: [...t.clips, { id: clipId, start: 0, duration, url: recordedUrl }] }
          : t
      ));
    });
  };

  // 루프 토글
  const toggleLoop = (trackId) => {
    setTracks(prev => prev.map(t =>
      t.id === trackId ? { ...t, loop: !t.loop } : t
    ));
  };

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={addTrack}
        className="px-3 py-1 bg-blue-600 text-white rounded shadow"
      >
        Add Track
      </button>

      {tracks.map(track => (
        <div key={track.id} className="border rounded p-3 space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => addRecordedClip(track.id)}
              disabled={!recordedUrl}
              className="px-2 py-1 bg-green-500 text-white rounded"
            >
              +
            </button>
            <span className="font-semibold">{track.name}</span>
            <button
              onClick={() => deleteTrack(track.id)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
            <button
              onClick={() => toggleLoop(track.id)}
              className={`px-2 py-1 rounded ${track.loop ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              {track.loop ? 'Loop On' : 'Loop Off'}
            </button>
            <div className="flex items-center space-x-2">
              <label>Volume:</label>
              <input
                type="range"
                min={0} max={1} step={0.01}
                value={track.volume}
                onChange={e => updateVolume(track.id, e.target.value)}
              />
            </div>
          </div>

          <div className="relative h-12 border bg-gray-100">
            {track.clips.map(clip => (
              <div
                key={clip.id}
                className="absolute top-0 h-full bg-blue-400 opacity-75 rounded"
                style={{
                  left: `${(clip.start / timelineDuration) * 100}%`,
                  width: `${(clip.duration / timelineDuration) * 100}%`,
                }}
              />
            ))}
          </div>

          {track.clips.map(clip => (
            <audio
              key={clip.id}
              src={clip.url}
              controls
              loop={track.loop}
              className="mt-2 w-full"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
