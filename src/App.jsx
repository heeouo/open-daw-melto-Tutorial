// import React from 'react';
// import InstrumentPlayer from './components/InstrumentPlayer';
// import KeyboardMapping from './components/KeyboardMapping';
// import RecorderControls from './components/RecorderControls';
// import TrackEditor from './components/TrackEditor';

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* 헤더 */}
//       <header className="bg-white shadow p-4">
//         <h1 className="text-2xl font-bold">Mini Band 🎹</h1>
//       </header>

//       {/* 메인 컨텐츠 */}
//       <main className="p-6 space-y-8 flex-1">
//         {/* 악기 연주 */}
//         <section>
//           <h2 className="text-xl font-semibold mb-2">악기 연주</h2>
//           <InstrumentPlayer />
//         </section>

//         {/* 녹음 & 재생 */}
//         <section>
//           <h2 className="text-xl font-semibold mb-2">녹음 & 재생</h2>
//           <RecorderControls />
//         </section>

//         {/* 트랙 관리 */}
//         <section>
//           <h2 className="text-xl font-semibold mb-2">트랙 편집</h2>
//           <TrackEditor />
//         </section>

//         {/* 키보드 매핑 안내 */}
//         <section>
//           <h2 className="text-xl font-semibold mb-2">키보드 매핑 안내</h2>
//           <KeyboardMapping />
//         </section>
//       </main>

//       {/* 푸터 */}
//       <footer className="bg-white shadow p-4 text-center text-sm text-gray-600">
//         © 2025 Mini Band Team
//       </footer>
//     </div>
//   );
// }

// export default App;



// // src/App.jsx
// import React from 'react';
// import InstrumentPlayer from './components/InstrumentPlayer';
// import RecorderControls from './components/RecorderControls';
// import KeyboardMapping from './components/KeyboardMapping';
// import TrackEditor from './components/TrackEditor';

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <header className="bg-white shadow p-4">
//         <h1 className="text-2xl font-bold">Mini Band 🎹</h1>
//       </header>

//       <main className="p-6 space-y-8 flex-1">
//         <section>
//           <h2 className="text-xl font-semibold mb-2">악기 연주</h2>
//           <InstrumentPlayer />
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-2">녹음 & 재생</h2>
//           <RecorderControls onRecordComplete={() => {}} />
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-2">트랙 편집</h2>
//           <TrackEditor />
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-2">키보드 매핑 안내</h2>
//           <KeyboardMapping />
//         </section>
//       </main>

//       <footer className="bg-white shadow p-4 text-center text-sm text-gray-600">
//         © 2025 Mini Band Team
//       </footer>
//     </div>
//   );
// }

// export default App;







// src/App.jsx
import React, { useState } from 'react';
import InstrumentPlayer from './components/InstrumentPlayer';
import RecorderControls from './components/RecorderControls';
import KeyboardMapping from './components/KeyboardMapping';
import TrackEditor from './components/TrackEditor';

function App() {
  const [recordedUrl, setRecordedUrl] = useState(null);

  return (
    <div className="min-h-screen min-w-screen mx-auto bg-[#F0F5F3]"> {/* min-w-[1897px] 스크롤바 없애려고 이렇게 넣고 싶은데, 그러면 화면 고정되어서 일단 제외*/}
      <div className="w-full min-h-screen grid grid-cols-3 grid-rows-[min-content_1fr_1fr_1fr_min-content] gap-[12px]">

        <header className="col-span-3 bg-[#FCFBF4] shadow rounded-md p-[0px]">
          <a href="https://heeouo.github.io/open-daw-melto/" target="_blank" rel="noopener noreferrer">
            <h1 className="text-base text-[#248277] text-center hover:underline">Melto</h1>
          </a>
        </header>

        <section className="col-span-1 bg-gray-50 border-1 border-[#3BA99C] rounded-[20px] p-[8px]">
          <h2 className="text-xl font-bold mb-[5px] border-b border-[#3BA99C] pb-[5px] text-center">🎵 
            <span className="ml-2">악기 선택</span>
          </h2>
          <InstrumentPlayer />
        </section>

        <section className="col-span-2 row-span-3 border-1 border-[#3BA99C] rounded-[20px] p-[8px]">
          <h2 className="text-xl font-bold mb-[5px] border-b border-[#3BA99C] pb-[5px] text-center">트랙 편집</h2>
          <TrackEditor recordedUrl={recordedUrl} />
        </section>

        <section className="col-span-1 border-1 border-[#3BA99C] rounded-[20px] p-[8px] min-h-[180px]">
          <h2 className="text-xl font-bold mb-2 border-b border-[#3BA99C] pb-[5px] text-center">
            🎙️ <span className="ml-2">녹음 / 재생</span>
          </h2>
          <RecorderControls onRecordComplete={url => setRecordedUrl(url)} />
        </section>

        <section className="col-span-1 bg-gray-50 border-1 border-[#3BA99C] rounded-[20px] p-[8px] hover:scale-[1.01] hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold mb-[6px] border-b border-[#3BA99C] pb-[5px] text-center">
            <span className="ml-2">⌨️ 키보드 매핑 안내</span>
          </h2>
          <KeyboardMapping />
        </section>
                     
        <footer className="col-span-3 bg-white shadow rounded-md p-4 text-center text-sm text-gray-900">
          © 2025 Team MELTO
        </footer>
    
      </div>
    </div>
  );
}

export default App;
