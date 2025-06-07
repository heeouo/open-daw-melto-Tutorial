import React, { useState, useEffect } from 'react';

export default function TutorialProgram() {
  const tutorialSteps = [
    { message: "1단계: 악기를 선택하고 연주해 보세요.", triggerId: "pianoButton" },
    { message: "2단계: 옥타브를 한 단계 올려보세요.", triggerId: "OctaveUp" },
    { message: "3단계: 녹음 버튼을 눌러보세요.", triggerId: "recordButton" },
    { message: "4단계: 키보드를 통해 d-s-a-s-d-d-d 순서대로 눌러보세요.", triggerId: null }, // triggerId 없음
    { message: "5단계: 녹음 중지 버튼을 눌러보세요.", triggerId: "recordButton" },
    { message: "6단계: 트랙을 추가해 보세요", triggerId: "addTrackButton" },
    { message: "7단계: + 버튼 눌러 해당 음악을 추가해보세요.", triggerId: "addInstrumentButton" },
    { message: "8단계: Play Track버튼 눌러 해당 트랙을 들을 수 있습니다", triggerId: "PlayButton" },
    { message: "9단계: Loop Off를 On으로 바꾸면 해당 음악이 반복됩니다.", triggerId: "LoopButton" },
    { message: "10단계: 믹스다운 버튼을 눌러 같은 트랙의 음원을 하나의 음원으로 만들 수 있습니다.", triggerId: "MixDownButton" },
    { message: "11단계: 믹스다운된 음원은 ⋮를 통해 .wav 파일로 다운로드 가능합니다.", triggerId: null },
    { message: "12단계: 마지막으로 삭제 버튼을 통해 해당 트랙을 삭제할 수 있습니다.", triggerId: "DeleteButton" },
    { message: "튜토리얼이 완료 되었습니다! 키보드 매핑으로 더 다양한 연주를 시도해 보세요.", triggerId: "keyboardMappingArea" },
  ];

  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(Array(tutorialSteps.length).fill(false));

  const nextStep = () => {
    if (completed[step]) {
      setStep(prev => Math.min(prev + 1, tutorialSteps.length - 1));
    }
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));
  const closeTutorial = () => setStep(-1);

  const markStepAsComplete = () => {
    setCompleted(prev => {
      const updated = [...prev];
      updated[step] = true;
      return updated;
    });
  };

  useEffect(() => {
    if (step === 3) return; // 키보드 입력은 아래 useEffect에서 처리

    const { triggerId } = tutorialSteps[step] || {};
    if (!triggerId) return;

    const el = document.getElementById(triggerId);
    if (!el) return;

    el.classList.add('ring-4', 'ring-yellow-400', 'ring-offset-2');

    const handleClick = () => markStepAsComplete();
    el.addEventListener('click', handleClick);

    return () => {
      el.classList.remove('ring-4', 'ring-yellow-400', 'ring-offset-2');
      el.removeEventListener('click', handleClick);
    };
  }, [step]);

  useEffect(() => {
    if (step !== 3) return;

    const expectedKeys = ['d', 's', 'a', 's', 'd', 'd', 'd'];   // 4단계: d-s-a-s-d-d-d 순서대로 입력 확인
    let index = 0;

    const handleKey = (e) => {
      const key = e.key.toLowerCase();
      if (key === expectedKeys[index]) {
        index += 1;
        if (index === expectedKeys.length) {
          markStepAsComplete();
        }
      } else {
        index = 0; // 틀리면 처음부터
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step]);

  if (step === -1) return null;

  const progressPercent = ((step + 1) / tutorialSteps.length) * 100;

  return (
    <div className="w-full space-y-4">
      <p className="text-lg font-bold text-center">{/*튜토리얼 가이드*/}</p>
      <p className="text-center pt-[30px] text-[20px]">{tutorialSteps[step].message}</p>

      <div className="w-full rounded-full">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex justify-between pt-[30px]">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="px-3 py-1 bg-gray-300 text-sm rounded disabled:opacity-50"
        >
          ⬅ 이전
        </button>
        <button
          onClick={() => {
            closeTutorial(); // 튜토리얼 종료 정리
            window.location.href = 'https://heeouo.github.io/open-daw-melto-Daw/'; // 이후 페이지 이동
          }}
          className="px-3 py-1 bg-red-400 text-white text-sm rounded"
        >
          ✖ 닫기
        </button>
        <button
          onClick={nextStep}
          disabled={!completed[step] || step === tutorialSteps.length - 1}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded disabled:opacity-50"
        >
          다음 ➡
        </button>
      </div>
    </div>
  );
}