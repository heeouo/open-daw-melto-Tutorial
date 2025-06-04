// // src/components/KeyboardMapping.jsx
// import React from 'react';
// import { keyToNote } from './InstrumentPlayer'; // InstrumentPlayer 에서 export 해둔 매핑 객체

// export default function KeyboardMapping() {
//   return (
//     <div className="keyboard-map grid grid-cols-7 gap-2 p-4">
//       {Object.entries(keyToNote).map(([key, note]) => (
//         <div
//           key={key}
//           className="flex flex-col items-center justify-center border rounded-lg p-2 bg-white shadow"
//         >
//           <span className="text-lg font-mono">{key}</span>
//           <span className="text-sm text-gray-600">{note}</span>
//         </div>
//       ))}
//     </div>
//   );
// }




// src/components/KeyboardMapping.jsx
import React from 'react';

// 키 맵 오프셋: 키 → 반음 오프셋 (C 기준)
const keyMapOffsets = {
  A: 0, W: 1, S: 2, E: 3, D: 4,
  F: 5, T: 6, G: 7, Y: 8, H: 9,
  U: 10, J: 11, K: 12,
};
const noteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const defaultOctave = 4;

// 기본 옥타브(defaultOctave)를 기준으로 keyToNote 맵 생성
const keyToNote = Object.fromEntries(
  Object.entries(keyMapOffsets).map(([key, offset]) => {
    const abs = defaultOctave * 12 + offset;
    const name = `${noteNames[abs % 12]}${Math.floor(abs / 12)}`;
    return [key, name];
  })
);

export default function KeyboardMapping() {
  return (
    <div className="flex justify-center"> 
      <div className="grid grid-cols-7 gap-[2px] pt-[40px] min-w-[500px]">
        {Object.entries(keyToNote).map(([key, note]) => (
          <div
            key={key}
            className="flex flex-col items-center justify-center border rounded-[10px] p-[2px] bg-[#ffffff] shadow"
          >
            <span className="text-[18px] font-mono">{key}</span>
            <span className="text-[14px] text-gray-600">{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
