// src/components/InstrumentPlayer.jsx
import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

// 피아노 키 맵 오프셋 (새로운 범위: C4 아래 5개 음부터 다음 C까지)
// A: G3  → offset = -5
// W: G#3 → offset = -4
// S: A3  → offset = -3
// E: A#3 → offset = -2
// D: B3  → offset = -1
// F: C4  → offset = 0
// T: C#4 → offset = 1
// G: D4  → offset = 2
// Y: D#4 → offset = 3
// H: E4  → offset = 4
// J: F4  → offset = 5
// I: F#4 → offset = 6
// K: G4  → offset = 7
// O: G#4 → offset = 8
// L: A4  → offset = 9
// P: A#4 → offset = 10
// ;: B4  → offset = 11
// ': C5  → offset = 12

const keyMapOffsets = {
  A: -5, W: -4, S: -3, E: -2, D: -1,
  F:  0, T:  1, G:  2, Y:  3, H:  4,
  J:  5, I:  6, K:  7, O:  8, L:  9,
  P: 10, ';': 11, "'": 12,
};
const noteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

// 드럼 키 맵 오프셋 (변경 없음)
const drumKeyMapOffsets = { B: 0, F: 1, V: 2, G: 3, H: 4, N: 5, T: 6, J: 7 };
const drumNames = [
  'DrumKick',
  'DrumHihat',
  'DrumSnare',
  'DrumSmallTom',
  'DrumMediumTom',
  'DrumFloorTom',
  'DrumCrash',
  'DrumRide',
];

export default function InstrumentPlayer() {
  const [instrument, setInstrument] = useState('piano');
  const [octave, setOctave] = useState(3);
  const [sampler, setSampler] = useState(null);

  // 샘플러 초기화: instrument 또는 octave가 바뀔 때마다 실행
  useEffect(() => {
    const init = async () => {
      await Tone.start();
      sampler?.dispose();

      if (instrument === 'piano') {
        // keyMapOffsets에 정의된 모든 오프셋을 기반으로 반음계 로드
        const urls = {};
        Object.values(keyMapOffsets).forEach(offset => {
          const abs = octave * 12 + offset;
          // abs가 0보다 작은 경우(C0 아래)에는 샘플이 없으므로 건너뜀
          if (abs < 0) return;
          const name = `${noteNames[abs % 12]}${Math.floor(abs / 12)}`;
          urls[name] = name.replace('#', 's') + '.mp3';
        });
        const pianoSampler = new Tone.Sampler({
          urls,
          baseUrl: './samples/pianos/',
          release: 1,
        }).toDestination();
        setSampler(pianoSampler);
      } else {
        // 드럼: drumKeyMapOffsets에 따라 Players 생성
        const urls = {};
        Object.entries(drumKeyMapOffsets).forEach(([key, idx]) => {
          const name = drumNames[idx];
          urls[name] = `${name}.mp3`;
        });
        const drumPlayers = new Tone.Players(urls, {
          baseUrl: './samples/drums/',
        }).toDestination();
        setSampler(drumPlayers);
      }
    };

    init();
    return () => sampler?.dispose();
  }, [instrument, octave]);

  // 키 입력 이벤트: 연주 및 옥타브 조절
  useEffect(() => {
    const onKey = async (e) => {
      const key = e.key.toUpperCase();

      if (instrument === 'piano') {
        // 옥타브 조절
        if (e.key === ',') {
          setOctave(o => Math.max(0, o - 1));
          return;
        }
        if (e.key === '.') {
          setOctave(o => Math.min(7, o + 1));
          return;
        }
      }

      if (!sampler) return;
      await Tone.start();

      if (instrument === 'drum') {
        const idx = drumKeyMapOffsets[key];
        if (idx === undefined) return;
        const name = drumNames[idx];
        sampler.player(name).start();
      } else {
        const offset = keyMapOffsets[key];
        if (offset === undefined) return;
        const abs = octave * 12 + offset;
        // abs가 0보다 작은 경우(C0 아래)에는 재생하지 않음 (최저 음역대)
        if (abs < 0) return;
        const note = `${noteNames[abs % 12]}${Math.floor(abs / 12)}`;
        sampler.triggerAttackRelease(note, '8n');
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [instrument, octave, sampler]);

  return (
    <div className="p-[4px] space-y-[4px]">
      <div className="flex space-x-[10px]">
        <button
          id="pianoButton"
          onClick={() => setInstrument('piano')}
          className={
            instrument === 'piano'
              ? 'px-[20px] py-[10px] bg-[#b8f5f4] text-white rounded'
              : 'px-[20px] py-[10px] bg-[#fcfcf7] rounded'
          }
        >
          Piano
        </button>
        <button
          onClick={() => setInstrument('drum')}
          className={
            instrument === 'drum'
              ? 'px-[20px] py-[10px] bg-[#b8f5f4] text-white rounded'
              : 'px-[20px] py-[10px] bg-[#fcfcf7] rounded'
          }
        >
          Drum
        </button>
      </div>

      {instrument === 'piano' && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setOctave(o => Math.max(0, o - 1))}
            disabled={octave <= 0}
            className="px-[20px] py-[10px] bg-[#fcfcf7] rounded"
          >
            Octave Down
          </button>
          <span>Octave: {octave}</span>
          <button
            id="OctaveUp"
            onClick={() => setOctave(o => Math.min(7, o + 1))}
            disabled={octave >= 7}
            className="px-[20px] py-[10px] bg-[#fcfcf7] rounded"
          >
            Octave Up
          </button>
        </div>
      )}

      <p>
        현재 선택된 악기:{' '}
        <strong>{instrument}</strong>
        {instrument === 'piano' && `, 옥타브: ${octave}`}
      </p>
    </div>
  );
}
