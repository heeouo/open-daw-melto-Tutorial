// src/components/TrackEditor.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function TrackEditor({ recordedUrl, timelineDuration = 30 }) {
  const [tracks, setTracks] = useState([]);
  const trackIdRef = useRef(1);
  const clipIdRef = useRef(1);
  const audioRefs = useRef({});

  // Audio 객체를 refs에 저장 (트랙별 재생용)
  useEffect(() => {
    const refs = {};
    tracks.forEach(track => {
      refs[track.id] = track.clips.map(clip => new Audio(clip.url));
    });
    audioRefs.current = refs;
  }, [tracks]);

  // 트랙 전체 재생
  const playTrack = (trackId) => {
    const audios = audioRefs.current[trackId];
    if (!audios) return;

    audios.forEach(audio => {
      audio.currentTime = 0; // 처음부터 재생
      audio.play();
    });
  };

  // 트랙 추가
  const addTrack = () => {
    const id = trackIdRef.current++;
    setTracks(prev => [
      ...prev,
      // clips: 오디오 클립 배열
      // loop: 루프 on/off 상태
      // mixUrl: 믹스다운된 결과를 저장할 URL (빈 문자열 또는 null이 초기값)
      { id, name: `Track ${id}`, volume: 0.8, clips: [], loop: false, mixUrl: null },
    ]);
  };

  // 트랙 삭제
  const deleteTrack = (trackId) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
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
          ? {
              ...t,
              clips: [
                ...t.clips,
                { id: clipId, start: 0, duration, url: recordedUrl }
              ]
            }
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

  // 믹스다운 : OfflineAudioContext를 사용해 해당 트랙에 있는 모든 클립을 합성(mix)한 뒤, 합성된 Buffer를 WAV Blob으로 변환하여 URL을 생성한 뒤에 상태에 저장
  const mixDownTrack = async (trackId) => {
    // 1. 믹스할 트랙 정보 가져오기
    const track = tracks.find(t => t.id === trackId);
    if (!track || track.clips.length === 0) return;

    try {
      // 2. 각 클립의 오디오 데이터를 fetch + decode
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffers = await Promise.all(
        track.clips.map(async clip => {
          const res = await fetch(clip.url);
          const arrayBuffer = await res.arrayBuffer();
          const decoded = await audioContext.decodeAudioData(arrayBuffer);
          // clip.start는 초 단위 offset (현재 코드는 모두 0으로 고정)
          return { buffer: decoded, start: clip.start };
        })
      );

      // 3. 전체 믹스 길이 계산 (가장 긴 끝나는 시점)
      let maxDuration = 0;
      decodedBuffers.forEach(({ buffer, start }) => {
        const endTime = start + buffer.duration;
        if (endTime > maxDuration) maxDuration = endTime;
      });

      // 4. OfflineAudioContext 생성 (스테레오, sampleRate는 첫 번째 버퍼 기준 사용)
      const sampleRate = decodedBuffers[0].buffer.sampleRate;
      const numChannels = decodedBuffers[0].buffer.numberOfChannels;
      const offlineCtx = new OfflineAudioContext(
        numChannels,
        Math.ceil(maxDuration * sampleRate),
        sampleRate
      );

      // 5. 각 버퍼를 오프라인 컨텍스트에 BufferSource로 넣고, 시작 시간(start) 설정
      decodedBuffers.forEach(({ buffer, start }) => {
        const src = offlineCtx.createBufferSource();
        src.buffer = buffer;
        src.connect(offlineCtx.destination);
        src.start(start);
      });

      // 6. 렌더링 시작
      const renderedBuffer = await offlineCtx.startRendering();

      // 7. 렌더링된 AudioBuffer를 WAV 형식의 Blob으로 변환
      const wavBlob = bufferToWavBlob(renderedBuffer);

      // 8. Blob URL 생성
      const blobUrl = URL.createObjectURL(wavBlob);

      // 9. 상태에 mixUrl 저장 → 버튼 옆에 <audio>로 렌더링
      setTracks(prev => prev.map(t =>
        t.id === trackId
          ? { ...t, mixUrl: blobUrl }
          : t
      ));
    } catch (err) {
      console.error('Mixdown failed:', err);
    }
  };

  // AudioBuffer → WAV Blob으로 변환하는 헬퍼 함수 (퍼블릭 도메인 또는 MIT 라이선스 예시 코드 참고)
  const bufferToWavBlob = (buffer) => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitsPerSample = 16;
    const blockAlign = numChannels * bitsPerSample / 8;
    const byteRate = sampleRate * blockAlign;
    const dataLength = buffer.length * blockAlign;
    const bufferLength = 44 + dataLength; // WAV 헤더(44바이트) + 데이터

    const wavBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(wavBuffer);

    let offset = 0;

    // RIFF chunk descriptor
    writeString(view, offset, 'RIFF'); offset += 4;
    view.setUint32(offset, 36 + dataLength, true); offset += 4; // file length - 8
    writeString(view, offset, 'WAVE'); offset += 4;

    // fmt subchunk
    writeString(view, offset, 'fmt '); offset += 4;
    view.setUint32(offset, 16, true); offset += 4; // PCM header size
    view.setUint16(offset, format, true); offset += 2; // Audio format (1 = PCM)
    view.setUint16(offset, numChannels, true); offset += 2; // 채널 수
    view.setUint32(offset, sampleRate, true); offset += 4; // 샘플레이트
    view.setUint32(offset, byteRate, true); offset += 4; // 바이트레이트
    view.setUint16(offset, blockAlign, true); offset += 2; // block align
    view.setUint16(offset, bitsPerSample, true); offset += 2; // 비트 심도

    // data subchunk
    writeString(view, offset, 'data'); offset += 4;
    view.setUint32(offset, dataLength, true); offset += 4;

    // 실제 샘플 데이터 (Float → 16-bit PCM)
    const channelData = [];
    for (let ch = 0; ch < numChannels; ch++) {
      channelData.push(buffer.getChannelData(ch));
    }

    // 인터리브(interleave)
    let sampleIndex = 0;
    for (let i = 0; i < buffer.length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        // [-1,1] float → 16-bit signed int
        let sample = channelData[ch][i];
        sample = Math.max(-1, Math.min(1, sample));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
      sampleIndex++;
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  // DataView에 문자열을 쓰는 헬퍼
  const writeString = (view, offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  return (
    <div className="p-[5px] space-y-[7px]">
      <button
        id="addTrackButton"
        onClick={addTrack}
        className="px-[30px] py-[10px] bg-blue-600 text-white rounded shadow"
      >
        Add Track
      </button>

      {tracks.map(track => (
        <div key={track.id} className="border border-[#3BA99C] rounded-[10px] p-[3px] space-y-[2px]">
          <div className="flex items-center space-x-[2px]">
            {/* ▶ Play Track */}
            <button
              id="PlayButton"
              onClick={() => playTrack(track.id)}
              className="px-[20px] py-1 bg-purple-600 text-white rounded"
            >
              ▶ Play Track
            </button>

            {/* + (클립 추가) */}
            <button
              id="addInstrumentButton"
              onClick={() => addRecordedClip(track.id)}
              disabled={!recordedUrl}
              className="px-2 py-1 bg-green-500 text-white rounded"
            >
              +
            </button>

            {/* 트랙 이름 */}
            <span className="font-semibold">{track.name}</span>

            {/* Delete Track */}
            <button
              id="DeleteButton"
              onClick={() => deleteTrack(track.id)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>

            {/* Loop On/Off 토글 */}
            <button
              id="LoopButton"
              onClick={() => toggleLoop(track.id)}
              className={`px-2 py-1 rounded ${
                track.loop ? 'bg-[#b8f5f4] text-white' : 'bg-gray-200'
              }`}
            >
              {track.loop ? 'Loop On' : 'Loop Off'}
            </button>

            {/* Mix Down 버튼 */}
            <button
              id="MixDownButton"
              onClick={() => mixDownTrack(track.id)}
              className="px-2 py-1 bg-indigo-600 text-white rounded"
            >
              Mix Down
            </button>

            {/* 믹스다운된 음원을 버튼 옆에 보여주도록 */}
            {track.mixUrl && (
              <audio
                src={track.mixUrl}
                controls
                className="ml-2 w-40"
              />
            )}
          </div>

          {/* 타임라인(클립 바) */}
          <div className="relative h-[0px] border border-[#3BA99C]">
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

          {/* 개별 클립을 audio 컨트롤러로 표시 */}
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
