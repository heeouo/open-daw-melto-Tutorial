// src/components/KeyboardMapping.jsx
import React, { useEffect, useState } from 'react';

export default function KeyboardMapping() {
  // 1) instrument 상태: 'piano' 또는 'drum' 디폴트는 Piano로 시작
  const [instrument, setInstrument] = useState('piano');

  useEffect(() => {
    // 2) 클릭 이벤트 핸들러: Piano/Drum 버튼 클릭을 감지
    const handleClick = (e) => {
      const text = e.target.innerText.trim();
      if (text === 'Piano') {
        setInstrument('piano');
      } else if (text === 'Drum') {
        setInstrument('drum');
      }
    };

    // 3) 마운트 시점에 전역 클릭 리스너 등록
    window.addEventListener('click', handleClick);

    // 4) 언마운트 시점에 정리
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // 5) instrument 값에 따라 경로 선택
  const imgSrc =
    instrument === 'drum'
      ? './samples/images/drum_mapping.png'
      : './samples/images/piano_mapping.png';

  return (
    <div className="flex justify-center p-4">
      <img
        src={imgSrc}
        alt={instrument === 'drum' ? 'Drum Mapping' : 'Piano Mapping'}
        className="max-w-full h-auto rounded shadow"
      />
    </div>
  );
}
