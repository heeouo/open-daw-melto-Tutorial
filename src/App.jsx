// src/App.jsx
import React, { useState } from 'react';
import InstrumentPlayer from './components/InstrumentPlayer';
import RecorderControls from './components/RecorderControls';
import KeyboardMapping from './components/KeyboardMapping';
import TrackEditor from './components/TrackEditor';
import TutorialProgram from './components/TutorialProgram';

function App() {
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden mx-auto bg-[#F0F5F3]">
      <div className="min-h-screen grid box-border grid-cols-3 grid-rows-[min-content_430px_auto_auto_min-content] gap-[15px]">
        
        <header className="col-span-3 bg-[#FCFBF4] shadow rounded-md p-[0px_16px]">
          <div className="flex justify-between items-center">
            {/* 왼쪽: Melto */}
            <h1 className="text-[20px] font-bold">
              <a href="https://heeouo.github.io/open-daw-melto/" target="_blank" rel="noopener noreferrer"
                className="text-[#2B2D2E] hover:text-[#248277]">
                Melto
              </a>
            </h1>

            {/* 오른쪽: 네비게이션 링크 */}
            <nav className="space-x-[10px]">
              <a href="https://heeouo.github.io/open-daw-melto/" target="_blank" rel="noopener noreferrer"
                className="text-[#2B2D2E] hover:text-[#248277]">
                Home
              </a>
              <a href="https://heeouo.github.io/open-daw-melto/Info/info.html" target="_blank" rel="noopener noreferrer"
                className="text-[#2B2D2E] hover:text-[#248277]">
                Info
              </a>
              <a href="https://heeouo.github.io/open-daw-melto/Start/start.html" target="_blank" rel="noopener noreferrer"
                className="text-[#2B2D2E] hover:text-[#248277]">
                Start
              </a>
            </nav>
          </div>
        </header>

        {/* 1열: 악기 선택 + 키보드 매핑 */}
        <div className="col-span-1 flex flex-col gap-[15px]">
          <section className="bg-gray-50 border-[1px] border-[#3BA99C] rounded-[20px] p-[8px]">
            <h2 className="text-[20px] font-bold mb-[5px] border-b border-[#3BA99C] mt-[0px] pb-[5px] text-center">🎵 
              <span className="ml-2">악기 선택</span>
            </h2>
            <InstrumentPlayer />
          </section>

          <section className="bg-gray-50 border-[1px] border-[#3BA99C] rounded-[20px] p-[8px]">
            <h2 className="text-[20px] font-bold mb-[5px] border-b border-[#3BA99C] mt-[0px] pb-[5px] text-center">
              <span className="ml-2">⌨️ 키보드 매핑 안내</span>
            </h2>
            <KeyboardMapping />
          </section>
        </div>


        <section className="col-start-2 col-span-2 row-start-2 border-[1px] border-[#3BA99C] rounded-[20px] p-[8px] overflow-auto">
          <h2 className="text-[20px] font-bold mb-[5px] border-b border-[#3BA99C] mt-[0px] pb-[5px] text-center">🎧트랙 편집</h2>
          <TrackEditor recordedUrl={recordedUrl} />
        </section>



        <section className="col-start-2 row-start-3 border-[1px] border-[#3BA99C] rounded-[20px] p-[8px] max-h-[150px]">
          <h2 className="text-[20px] font-bold mb-[5px] border-b border-[#3BA99C] mt-[0px] pb-[5px] text-center">
            <span className="ml-2">🎙️녹음 / 재생</span>
          </h2>
          <RecorderControls onRecordComplete={url => setRecordedUrl(url)} />
        </section>        


        <section className="col-start-3 row-start-3 border-[1px] border-[#3BA99C] rounded-[20px] p-[8px] max-h-[150px]">
          <h2 className="text-[20px] font-bold mb-[5px] border-b border-[#3BA99C] mt-[0px] pb-[5px] text-center">🎓튜토리얼</h2>

          {/* 튜토리얼 시작 버튼 */}
          {!showTutorial && (
            <button
              onClick={() => setShowTutorial(true)}
              className="bg-yellow-400 text-black px-4 py-2 rounded shadow"
            >
              튜토리얼 시작
            </button>
          )}

          {/* 튜토리얼 박스 */}
          {showTutorial && <TutorialProgram />}
        </section>

        <footer className="col-span-3 bg-white shadow rounded-md p-4 text-center text-sm text-[#7a7a7a]">
         © 2025 Team MELTO
        </footer>
      </div>
    </div>
  );
}

export default App;
