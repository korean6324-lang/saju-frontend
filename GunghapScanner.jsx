import React from 'react';
import { Heart, Home, CalendarCheck, ShieldAlert, Sparkles, AlertTriangle, CheckCircle2, Map, Flame, Activity, XOctagon, Compass, BookOpen } from 'lucide-react';

const GunghapScanner = ({ gunghapData }) => {
  if (!gunghapData || !gunghapData.hontaek_summary) return null;

  const { deep_analysis, hontaek_summary, fengshui_advice, taekil_validation } = gunghapData;
  const dongseo = hontaek_summary.dongseo_gunghap;
  // 🚨 백엔드에서 생성한 딥 리포트 데이터 안전 파싱
  const deepReport = dongseo?.deep_report; 
  const special = hontaek_summary.special_gunghap || [];
  const baseGung = fengshui_advice?.base_gung;
  const dirs = fengshui_advice?.directions;

  const isDongseoGood = dongseo?.type?.includes("사길성") || deepReport?.is_good;

  return (
    <div className="flex flex-col gap-6 mt-6 animate-fade-in-up">
      
      {/* 🌟 1. 기존 명리 심층 궁합 (오행 조후 & 일주 부부궁) - 100% 보존 */}
      {deep_analysis && (
        <div className="bg-[#111318] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="bg-[#1a1c23] px-5 py-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-sm font-bold text-purple-400 flex items-center gap-2 uppercase tracking-widest">
              <Activity className="w-4 h-4" /> Deep Bazi Synergy (명리 심층 궁합 진단)
            </h2>
          </div>
          <div className="p-6 bg-[#0f1014] grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0c] p-5 rounded-lg border border-purple-900/30 shadow-inner h-full flex flex-col">
              <h3 className="text-xs font-bold text-purple-400 mb-4 flex items-center gap-1.5 uppercase tracking-widest border-b border-purple-900/30 pb-2">
                <Flame className="w-3.5 h-3.5" /> 오행 밸런스 및 상호 보완
              </h3>
              <p className="text-gray-300 text-[13px] leading-relaxed font-light whitespace-pre-wrap">
                {deep_analysis.elements_synergy}
              </p>
            </div>
            <div className="bg-[#0a0a0c] p-5 rounded-lg border border-pink-900/30 shadow-inner h-full flex flex-col">
              <h3 className="text-xs font-bold text-pink-400 mb-4 flex items-center gap-1.5 uppercase tracking-widest border-b border-pink-900/30 pb-2">
                <Heart className="w-3.5 h-3.5" /> 안방(일주)의 내밀한 관계
              </h3>
              <div className="flex flex-col gap-3">
                {deep_analysis.day_pillar_synergy?.map((txt, idx) => (
                  <p key={idx} className="text-gray-300 text-[13px] leading-relaxed font-light">
                    {txt}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 2. 신규 업데이트: 동서명합 심층 궁합 딥 리포트 */}
      {deepReport && (
        <div className="bg-[#111318] rounded-xl border border-[#d4af37]/30 shadow-[0_0_20px_rgba(212,175,55,0.15)] overflow-hidden">
          {/* 헤더 */}
          {/* ✨ Tailwind v4 최신 문법 유지 */}
          <div className="bg-linear-to-r from-[#1a1c23] via-[#2a2415] to-[#1a1c23] px-6 py-5 border-b border-[#d4af37]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-[#d4af37] to-transparent"></div>
            <h2 className="text-lg font-black text-[#d4af37] flex items-center gap-2 uppercase tracking-widest z-10">
              <Compass className="w-5 h-5 text-[#f1c40f]" /> 동서명합(東西命合) 딥 리포트
            </h2>
            <p className="text-xs text-gray-400 mt-2 font-light leading-relaxed max-w-3xl">
              단순히 "궁합이 좋다, 나쁘다"고 치부하는 것을 넘어, 근본적으로 두 분의 에너지가 왜 융화되거나 충돌할 수밖에 없는지 역학적 근거와 현실적인 발현 양상을 명확하고 논리적으로 풀어드립니다.
            </p>
          </div>

          <div className="p-6 bg-[#0f1014] flex flex-col gap-6">
            
            {/* 파트 2-1. 본명궁 기반 에너지 그룹 분석 */}
            <div className="border border-gray-800 rounded-lg overflow-hidden bg-[#0a0a0c] shadow-inner">
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-800">
                <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 tracking-widest">
                  <Activity className="w-4 h-4 text-emerald-500" /> 📊 [본명궁 기반 에너지 그룹 분석]
                </h3>
              </div>
              <div className="p-5 flex flex-col gap-5">
                <p className="text-[13px] text-gray-400 font-light leading-relaxed">
                  사람은 태어난 해의 기운에 따라 평생 자신에게 영향을 미치는 고유의 '주파수(본명궁)'를 가지며, 이는 크게 동사택(東四宅)과 서사택(西四宅) 두 그룹으로 나뉩니다. 같은 그룹끼리는 기운이 상생(相生)하지만, 다른 그룹이 만나면 기운이 충돌하고 소모됩니다.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* 신랑 프로필 */}
                  <div className="flex-1 bg-[#111318] border border-blue-900/30 p-5 rounded-lg shadow-inner">
                    <h4 className="text-[13px] font-bold text-blue-400 mb-3 border-b border-blue-900/30 pb-2">👨‍💼 {deepReport.groom_profile.name}</h4>
                    <ul className="text-[13px] text-gray-300 space-y-2.5 font-light">
                      <li><strong className="text-gray-500 font-bold w-16 inline-block">본명궁:</strong> <span className="text-white">{deepReport.groom_profile.gung}</span></li>
                      <li><strong className="text-gray-500 font-bold w-16 inline-block">소속 그룹:</strong> <span className="text-blue-300 font-bold">{deepReport.groom_profile.group}</span></li>
                      <li><strong className="text-gray-500 font-bold w-16 inline-block">오행 기운:</strong> {deepReport.groom_profile.element_desc}</li>
                    </ul>
                  </div>
                  {/* 신부 프로필 */}
                  <div className="flex-1 bg-[#111318] border border-pink-900/30 p-5 rounded-lg shadow-inner">
                    <h4 className="text-[13px] font-bold text-pink-400 mb-3 border-b border-pink-900/30 pb-2">👩‍💼 {deepReport.bride_profile.name}</h4>
                    <ul className="text-[13px] text-gray-300 space-y-2.5 font-light">
                      <li><strong className="text-gray-500 font-bold w-16 inline-block">본명궁:</strong> <span className="text-white">{deepReport.bride_profile.gung}</span></li>
                      <li><strong className="text-gray-500 font-bold w-16 inline-block">소속 그룹:</strong> <span className="text-pink-300 font-bold">{deepReport.bride_profile.group}</span></li>
                      <li><strong className="text-gray-500 font-bold w-16 inline-block">오행 기운:</strong> {deepReport.bride_profile.element_desc}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 파트 2-2. 3가지 핵심 이유 */}
            <div className="border border-gray-800 rounded-lg overflow-hidden bg-[#0a0a0c] shadow-inner">
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-800">
                <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 tracking-widest">
                  <AlertTriangle className={`w-4 h-4 ${isDongseoGood ? 'text-emerald-500' : 'text-rose-500'}`} /> 
                  {isDongseoGood ? '✨ [왜 두 분의 궁합이 완벽한가? - 3가지 핵심 이유]' : '🚨 [왜 두 분의 궁합이 불리한가? - 3가지 핵심 이유]'}
                </h3>
              </div>
              <div className="p-5 flex flex-col gap-6">
                <p className="text-[13px] text-gray-400 font-light leading-relaxed">
                  이 두 분이 결합했을 때 {isDongseoGood ? '대길(大吉)' : '흉(凶)'}하다고 판단하는 역학적인 이유는 다음과 같이 매우 명확합니다.
                </p>
                <div className="space-y-5">
                  {/* 🚨 옵셔널 체이닝 (?.) 적용 완료 */}
                  {deepReport.reasons?.map((reason, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <h4 className={`text-[13px] font-bold ${isDongseoGood ? 'text-emerald-400' : 'text-rose-400'}`}>{reason.title}</h4>
                      <p className="text-[13px] text-gray-300 leading-relaxed font-light whitespace-pre-wrap pl-3 border-l-2 border-gray-700">{reason.desc}</p>
                      
                      {/* 오행 생극제화 남녀 입장 분석 */}
                      {reason.m_stance && reason.f_stance && (
                        <div className="mt-2 pl-3 space-y-2 bg-gray-900/30 p-3 rounded border border-gray-800/50">
                          <p className="text-[13px] text-gray-400 leading-relaxed font-light"><strong className="text-blue-400/90 font-bold tracking-widest">남성의 입장: </strong> {reason.m_stance}</p>
                          <p className="text-[13px] text-gray-400 leading-relaxed font-light"><strong className="text-pink-400/90 font-bold tracking-widest">여성의 입장: </strong> {reason.f_stance}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 파트 2-3. 현실적인 발현 양상 */}
            <div className="border border-gray-800 rounded-lg overflow-hidden bg-[#0a0a0c] shadow-inner">
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-800">
                <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 tracking-widest">
                  <BookOpen className="w-4 h-4 text-[#3498db]" /> 💡 [현실적인 발현 양상 (결론)]
                </h3>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <p className="text-[13px] text-gray-400 font-light leading-relaxed mb-2">
                  이러한 동사택/서사택의 {isDongseoGood ? '조화와' : '대립과'} 오행의 작용이 일상생활에서는 다음과 같이 나타나게 됩니다.
                </p>
                {/* 🚨 옵셔널 체이닝 (?.) 적용 완료 */}
                {deepReport.manifestations?.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-2 md:gap-3 items-start pl-3 border-l-2 border-gray-700">
                    <span className="text-[#3498db] font-bold shrink-0">{item.title} :</span>
                    <p className="text-[13px] text-gray-300 font-light leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 파트 2-4. 전문가 총평 */}
            <div className={`bg-[#15171e] border p-6 rounded-lg relative overflow-hidden shadow-inner ${isDongseoGood ? 'border-emerald-900/50' : 'border-rose-900/50'}`}>
              <h3 className="text-[14px] font-black text-[#d4af37] mb-3 flex items-center gap-2 z-10 relative tracking-widest">
                📌 전문가 총평
              </h3>
              <p className="text-[13px] text-gray-300 leading-relaxed font-light z-10 relative">
                {deepReport.conclusion}
              </p>
              {isDongseoGood ? (
                <Heart className="absolute -right-6 -bottom-6 w-36 h-36 text-emerald-500/5 z-0 rotate-12" />
              ) : (
                <ShieldAlert className="absolute -right-6 -bottom-6 w-36 h-36 text-rose-500/5 z-0 rotate-12" />
              )}
            </div>

          </div>
        </div>
      )}

      {/* 🌟 3. 혼례 택일(擇日) 초정밀 검증 리포트 (기존 내용 완벽 보존) */}
      <div className="bg-[#111318] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="bg-[#1a1c23] px-5 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-sm font-bold text-[#f1c40f] flex items-center gap-2 uppercase tracking-widest">
            <CalendarCheck className="w-4 h-4" /> 혼례 택일(擇日) 4단계 초정밀 검증 리포트
          </h2>
        </div>
        <div className="p-6 bg-[#0f1014]">
          {taekil_validation ? (
            <div className="space-y-6">
              <div className={`p-5 rounded-lg border shadow-lg flex items-start gap-4 ${taekil_validation.final_status === 'PASS' ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-rose-950/20 border-rose-500/50'}`}>
                {taekil_validation.final_status === 'PASS' ? <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0 mt-1" /> : <XOctagon className="w-8 h-8 text-rose-500 shrink-0 mt-1 animate-pulse" />}
                <div className="flex flex-col gap-1.5">
                  <span className="text-white font-bold text-lg">희망일: {taekil_validation.target_date}</span>
                  <span className={`text-sm font-black ${taekil_validation.final_status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {taekil_validation.conclusion}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">상세 검증 프로세스 및 팩트 폭행</h3>
                {taekil_validation.steps.map((step, idx) => {
                  const isPass = step.status.includes('吉') || step.status.includes('PASS') || step.status.includes('무난');
                  const isWarning = step.status.includes('WARNING');
                  return (
                    <div key={idx} className="bg-[#0a0a0c] p-4 rounded-lg border border-gray-800 flex flex-col md:flex-row gap-4 relative overflow-hidden">
                      <div className="shrink-0 md:w-1/4 flex flex-col gap-1 border-b md:border-b-0 md:border-r border-gray-800 pb-3 md:pb-0 z-10">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{step.step}</span>
                        <span className={`text-[13px] font-black tracking-widest ${isPass ? 'text-emerald-500' : (isWarning ? 'text-yellow-500' : 'text-rose-500')}`}>
                          {step.status}
                        </span>
                      </div>
                      <div className="flex-1 flex items-center z-10">
                        <p className="text-gray-300 text-[13px] leading-relaxed font-light">{step.reason}</p>
                      </div>
                      {!isPass && !isWarning && <ShieldAlert className="absolute -right-4 -bottom-4 w-20 h-20 text-rose-500/5 z-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-[#0a0a0c] rounded-lg border border-gray-800">
              <CalendarCheck className="w-10 h-10 text-gray-700 mx-auto mb-3 opacity-50" />
              <p className="text-gray-400 text-sm">입력 폼에서 <span className="text-[#f1c40f] font-bold">혼례 택일 검증 시스템</span>을 활성화하시면 상세 리포트가 생성됩니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 🌟 4. 특수 궁합 (시너지 및 흉살) - 기존 내용 보존 */}
      <div className="bg-[#111318] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="bg-[#1a1c23] px-5 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-sm font-bold text-[#e84393] flex items-center gap-2 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> 특수 궁합 (시너지 및 흉살)
          </h2>
        </div>
        <div className="p-6 bg-[#0f1014] flex flex-col gap-6">
          <div className="bg-[#0a0a0c] p-5 rounded-lg border border-gray-800 shadow-inner">
            <h3 className="text-xs font-bold text-[#d4af37] mb-4 flex items-center gap-1.5 uppercase tracking-widest border-b border-gray-800/50 pb-2">
              <Sparkles className="w-3.5 h-3.5" /> 특이 격국 진단
            </h3>
            {special.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {special.map((sp, idx) => (
                  <div key={idx} className="bg-[#111318] border border-gray-700 p-4 rounded-lg flex flex-col gap-1.5 shadow-sm">
                    <span className="text-[#f1c40f] font-bold text-sm">{sp.name}</span>
                    <p className="text-gray-400 text-[13px] leading-relaxed font-light">{sp.desc}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-[12px] text-gray-500 font-light">특별한 시너지 격국이나 치명적인 흉살이 감지되지 않은 평탄한 명합입니다.</p>}
          </div>
        </div>
      </div>

      {/* 🌟 5. 팔사택 풍수 (기존 내용 보존) */}
      {baseGung && dirs && (
        <div className="bg-[#111318] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="bg-[#1a1c23] px-5 py-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#3498db] flex items-center gap-2 uppercase tracking-widest">
              <Home className="w-4 h-4" /> 팔사택 풍수 개운법 (신혼집 세팅)
            </h2>
          </div>
          <div className="p-6 bg-[#0f1014] space-y-6">
            <div className="flex items-center gap-3 bg-[#0a0a0c] p-4 rounded-lg border border-blue-900/30">
              <Map className="w-6 h-6 text-blue-400 shrink-0" />
              <div>
                <span className="text-blue-300 font-bold text-sm">{baseGung.name} ({baseGung.group})</span>
                <p className="text-gray-400 text-[12px] mt-1 font-light">신랑의 본명궁에 맞추어 신혼집의 출입구와 침대 방향을 설정하십시오.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-widest border-b border-emerald-900/30 pb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 사길방 (배치 권장)
                </h3>
                {Object.entries(dirs.good).map(([name, data], idx) => (
                  <div key={idx} className="bg-emerald-950/10 border border-emerald-900/20 p-3 rounded flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-300 font-bold text-[13px]">{name}</span>
                      <span className="text-emerald-500 font-black text-[11px] bg-emerald-950 px-2 py-0.5 rounded">{data.dir}</span>
                    </div>
                    <p className="text-gray-400 text-[12px] leading-relaxed mt-1 font-light">{data.advice}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-widest border-b border-rose-900/30 pb-2">
                  <ShieldAlert className="w-3.5 h-3.5" /> 사흉방 (배치 금지)
                </h3>
                {Object.entries(dirs.bad).map(([name, data], idx) => (
                  <div key={idx} className="bg-rose-950/10 border border-rose-900/20 p-3 rounded flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-rose-300 font-bold text-[13px]">{name}</span>
                      <span className="text-rose-500 font-black text-[11px] bg-rose-950 px-2 py-0.5 rounded">{data.dir}</span>
                    </div>
                    <p className="text-gray-400 text-[12px] leading-relaxed mt-1 font-light">{data.advice}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GunghapScanner;