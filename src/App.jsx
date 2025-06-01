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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold">Mini Band 🎹</h1>
      </header>

      <main className="p-6 space-y-8 flex-1">
        <section>
          <h2 className="text-xl font-semibold mb-2">악기 연주</h2>
          <InstrumentPlayer />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">녹음 & 재생</h2>
          <RecorderControls onRecordComplete={url => setRecordedUrl(url)} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">트랙 편집</h2>
          <TrackEditor recordedUrl={recordedUrl} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">키보드 매핑 안내</h2>
          <KeyboardMapping />
        </section>
      </main>

      <footer className="bg-white shadow p-4 text-center text-sm text-gray-600">
        © 2025 Mini Band Team
      </footer>
    </div>
  );
}

export default App;
