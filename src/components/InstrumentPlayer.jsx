import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

// 피아노 키 맵 오프셋
const keyMapOffsets = { A: 0, W: 1, S: 2, E: 3, D: 4, F: 5, T: 6, G: 7, Y: 8, H: 9, U: 10, J: 11, K: 12 };
const noteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

// 드럼 키 맵 오프셋
const drumKeyMapOffsets = { B: 0, F: 1, V: 2, G: 3, H: 4, N: 5, T: 6, J: 7 };
const drumNames = ['DrumKick','DrumHihat','DrumSnare','DrumSmallTom','DrumMediumTom','DrumFloorTom','DrumCrash','DrumRide'];

export default function InstrumentPlayer() {
  const [instrument, setInstrument] = useState('piano');
  const [octave, setOctave] = useState(4);
  const [sampler, setSampler] = useState(null);

  useEffect(() => {
    const init = async () => {
      await Tone.start();
      sampler?.dispose();
      let inst;
      if (instrument === 'piano') {
        // 반음계 모두 로드 (파일명 #→s)
        const urls = {};
        Object.values(keyMapOffsets).forEach(offset => {
          const abs = octave * 12 + offset;
          const name = `${noteNames[abs % 12]}${Math.floor(abs / 12)}`;
          urls[name] = name.replace('#','s') + '.mp3';
        });
        inst = new Tone.Sampler({ urls, baseUrl: '/open-daw-melto-Daw/samples/pianos/', release: 1 }).toDestination();
      } else {
        // 드럼 샘플 맵
        const urls = {};
        Object.entries(drumKeyMapOffsets).forEach(([key, idx]) => {
          const name = drumNames[idx];
          urls[name] = name + '.mp3';
        });
        inst = new Tone.Players(urls, { baseUrl: '/open-daw-melto-Daw/samples/drums/' }).toDestination();
      }
      setSampler(inst);
    };
    init();
    return () => sampler?.dispose();
  }, [instrument, octave]);

  useEffect(() => {
    const onKey = async (e) => {
      const key = e.key.toUpperCase();
      if (instrument === 'piano') {
        if (e.key === ',') { setOctave(o => Math.max(0, o-1)); return; }
        if (e.key === '.') { setOctave(o => Math.min(7, o+1)); return; }
      }
      if (!sampler) return;
      await Tone.start();
      if (instrument === 'drum') {
        const idx = drumKeyMapOffsets[key]; if (idx === undefined) return;
        const name = drumNames[idx];
        sampler.player(name).start();
      } else {
        const offset = keyMapOffsets[key]; if (offset === undefined) return;
        const abs = octave * 12 + offset;
        const note = `${noteNames[abs % 12]}${Math.floor(abs / 12)}`;
        sampler.triggerAttackRelease(note, '8n');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [instrument, octave, sampler]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-4">
        <button onClick={() => setInstrument('piano')} className={instrument==='piano'? 'px-4 py-2 bg-blue-500 text-white rounded':'px-4 py-2 bg-gray-200 rounded'}>Piano</button>
        <button onClick={() => setInstrument('drum')} className={instrument==='drum'? 'px-4 py-2 bg-green-500 text-white rounded':'px-4 py-2 bg-gray-200 rounded'}>Drum</button>
      </div>
      {instrument === 'piano' && (
        <div className="flex items-center space-x-2">
          <button onClick={() => setOctave(o => Math.max(0, o-1))} disabled={octave<=0} className="px-2 py-1 bg-gray-300 rounded">Octave Down</button>
          <span>Octave: {octave}</span>
          <button onClick={() => setOctave(o => Math.min(7, o+1))} disabled={octave>=7} className="px-2 py-1 bg-gray-300 rounded">Octave Up</button>
        </div>
      )}
      <p>현재 선택된 악기: <strong>{instrument}</strong>{instrument==='piano' && `, 옥타브: ${octave}`}</p>
      <p>▶ Piano: A W S E D F T G Y H U J K키, ','·'.'로 옥타브</p>
      <p>▶ Drum: B F V G H N T J키</p>
    </div>
  );
}
