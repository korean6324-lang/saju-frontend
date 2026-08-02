import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // 분리된 프리미엄 스타일 적용

// 💡 통합 사전 데이터 (기존 로직 완벽 보존)
const TERMS_DICT = {
  "비견": "독립심, 주체성, 자존심을 상징하며 형제, 친구, 동료와의 동등한 관계를 의미합니다.", "겁재": "경쟁심, 투쟁력, 승부욕을 상징하며 재물을 둘러싼 경쟁이나 대인관계의 뺏고 빼앗김을 의미합니다.", "식신": "창의력, 의식주의 풍요, 전문성, 탐구심을 상징하며 온화하고 베푸는 성향을 의미합니다.", "상관": "뛰어난 표현력, 사교성, 기득권 타파를 상징하며, 틀에 얽매이지 않는 자유로운 발상과 언변을 의미합니다.", "편재": "유동적인 큰 재물, 사업 수완, 공간 지각력, 인맥 관리와 넓은 활동 영역을 의미합니다.", "정재": "고정적이고 안정적인 수입, 성실함, 꼼꼼함, 책임감과 알뜰한 저축심을 의미합니다.", "편관": "카리스마, 권력, 강한 인내심과 돌파력을 상징하며, 위험을 감수하는 리더십과 명예욕을 의미합니다.", "정관": "합리성, 보수적 원칙, 준법정신, 책임감을 상징하며 안정적인 직장과 바른 길을 의미합니다.", "편인": "직관력, 눈치, 특수한 기술이나 예술/종교/철학적 재능, 비대중적인 학문을 의미합니다.", "정인": "학문, 도덕성, 수용력, 인내심을 상징하며 어머니의 사랑과 문서(자격증, 부동산) 운을 의미합니다.", "일간": "사주팔자에서 '나 자신'을 의미하는 기준점입니다.",
  "목": "성장과 추진력, 창조적인 에너지를 상징하며, 어질고(仁) 위로 곧게 뻗어나가는 기운입니다.", "화": "열정과 명랑함, 확산하는 에너지를 상징하며, 예의(禮)를 중시하고 타오르는 불의 기운입니다.", "토": "중재와 포용력, 안정감을 상징하며, 신용(信)을 바탕으로 만물을 품는 대지의 기운입니다.", "금": "결단력과 원칙, 맺고 끊음을 상징하며, 의리(義)를 중시하고 단단하게 결실을 맺는 기운입니다.", "수": "지혜와 유연성, 수용력을 상징하며, 상황에 맞게 대처하고 만물을 적셔주는(智) 물의 기운입니다.",
  "갑": "큰 나무(陽木). 강한 생명력과 추진력, 리더십과 우두머리 기질을 상징합니다.", "을": "화초나 덩굴(陰木). 유연함과 환경 적응력, 끈질긴 생명력과 사교성을 상징합니다.", "병": "태양(陽火). 밝고 화려하며, 열정적이고 명랑하게 만물을 비추는 기운을 상징합니다.", "정": "촛불, 달빛(陰火). 은은한 온기와 희생정신, 섬세하고 따뜻한 감수성을 상징합니다.", "무": "큰 산(陽土). 듬직하고 포용력이 넓으며, 만물을 중재하고 믿음을 주는 기운입니다.", "기": "평야, 논밭(陰土). 어머니 같은 수용력, 실속을 챙기며 다정다감한 기운입니다.", "경": "바위, 무쇠(陽金). 원칙과 결단력, 강한 의리와 카리스마를 상징합니다.", "신": "보석, 정밀한 칼(陰金). 예민한 감수성과 정교함, 완벽주의와 날카로움을 상징합니다.", "임": "바다, 강물(陽水). 지혜롭고 융통성이 뛰어나며, 모든 것을 포용하는 넓은 스케일을 의미합니다.", "계": "이슬비, 옹달샘(陰水). 부드럽고 다정하며, 섬세한 지혜와 기획력을 상징합니다.",
  "자": "쥐(수). 어둠 속의 비밀스러운 활동, 강한 번식력과 뛰어난 지혜를 의미합니다.", "축": "소(토). 묵묵한 끈기와 성실함, 속을 알 수 없는 뚝심을 의미합니다.", "인": "호랑이(목). 강한 독립심과 개척 정신, 명예욕과 권력을 향한 의지를 의미합니다.", "묘": "토끼(목). 부드럽고 다정함, 섬세한 감수성과 예술적 재능을 의미합니다.", "진": "용(토). 이상향과 야망, 스케일이 크고 변화무쌍한 에너지를 의미합니다.", "사": "뱀(화). 강한 집념과 열정, 화려함과 빠른 두뇌 회전을 의미합니다.", "오": "말(화). 활달하고 진취적이며, 솔직하고 사교적인 확산의 에너지를 의미합니다.", "미": "양(토). 온순해 보이나 강한 고집, 희생정신과 철학/예술적 성향을 의미합니다.", "신": "원숭이(금). 다재다능하고 재주가 많으며, 임기응변과 결단력이 뛰어납니다.", "유": "닭(금). 섬세하고 예민하며, 맺고 끊음이 정확한 완벽주의 성향을 의미합니다.", "술": "개(토). 충직함과 강한 책임감, 직관력이 뛰어나고 방어적인 성향을 의미합니다.", "해": "돼지(수). 온화함과 넓은 포용력, 풍요로움과 지적 호기심을 의미합니다.",
  "지살": "새로운 시작, 이동, 개척을 의미합니다.", "년살(도화살)": "매력과 인기, 사교성을 상징합니다.", "월살": "메마르고 막힌 환경, 또는 뜻밖의 상속을 의미합니다.", "망신살": "비밀이 드러나거나 나서다가 실수함을 주의해야 합니다.", "장성살": "무리의 중심이자 리더십, 권위를 상징합니다.", "반안살": "출세와 안정, 편안한 지위를 의미합니다.", "역마살": "이동, 분주함, 통신과 무역, 넓은 활동 반경을 상징합니다.", "육해살": "피곤함이나 스트레스, 영감과 직관력을 의미합니다.", "화개살": "예술, 종교, 철학, 학문적 성취와 침잠을 뜻합니다.", "겁살": "강제적인 압박이나 빼앗김, 강한 경쟁심을 요합니다.", "재살": "꾀가 많고 두뇌 회전이 빠르며 위기 대처 능력이 뛰어납니다.", "천살": "불가항력적인 상황이나 높은 이상, 정신적 수양을 상징합니다.",
  "백호대살": "강렬하고 폭발적인 에너지, 강한 프로 의식을 의미합니다.", "괴강살": "우두머리 기질, 카리스마, 강한 돌파력을 상징합니다.", "천을귀인": "명리학 최고의 길신(수호천사)입니다. 흉살을 길하게 변화시키며 위기에서 구합니다.", "홍염살": "타인에게 은근하고 친근한 매력을 발산하여 호감을 주는 기운입니다.",
  "공망": "천간과 지지의 짝이 맞지 않아 비어있음을 뜻합니다. 작용력이 반감됩니다.", "장생": "탄생, 후원, 순수함, 길한 시작 에너지입니다.", "목욕": "호기심, 멋내기, 불안정하고 반복적인 변화입니다.", "관대": "제복, 고집, 독립, 뻗어나가는 힘입니다.", "건록": "자수성가, 안정, 독립적 실행력입니다.", "제왕": "절정, 카리스마, 독단성, 가장 강한 에너지입니다.", "쇠": "노련함, 보수성, 물러남의 기운입니다.", "병": "예민함, 동정심, 감수성입니다.", "사": "정지, 사색, 한 가지에 몰두하는 에너지입니다.", "묘": "저축, 은둔, 안정적인 추구입니다.", "절": "단절, 무(無)의 상태, 극단적 변화입니다.", "태": "잉태, 조심스럽지만 무한한 가능성입니다.", "양": "양육, 보호, 길러지는 기운입니다.",
  "신강(身强)": "나를 돕는 기운이 커서 주관이 뚜렷하고 추진력이 강한 상태입니다.", "신약(身弱)": "나의 기운이 약해 환경에 순응력이 좋으나 휘둘리기 쉬운 상태입니다.", "용희신": "내 사주의 불균형을 해소하고 나에게 이로움을 주는 긍정적인 운입니다.", "기구신": "내 사주의 불균형을 심화시키고 나에게 불리하게 작용하는 주의할 운입니다.", "지장간": "지지에 숨겨진 천간으로, 사람의 내면적 잠재력, 속마음을 나타냅니다.", "일진": "오늘 하루의 운세를 나타내는 기운으로 원국과 상호작용합니다.", "미상": "태어난 시간을 알 수 없어 파악할 수 없습니다.", "?": "태어난 시간 미상",
  "지지삼합": "세 지지가 모여 거대한 오행 세력을 형성합니다. 사회적/직업적 연대와 폭발적 성장을 뜻합니다.", "지지방합": "같은 계절에 해당하는 지지들이 모인 형제/가족 같은 끈끈한 혈연적/지역적 결속력입니다.", "지지반합": "삼합 중 두 글자만 모여 해당 오행을 뚜렷하게 지향하는 연대를 뜻합니다.", "천간합화(合化)": "두 천간이 합을 이룰 때, 태어난 계절의 조건이 맞아 완전히 새로운 오행으로 변화하는 강력한 결합입니다.", "천간합(기반)": "두 천간이 합을 하였으나 계절을 얻지 못해 성질이 변하지 않고 묶여있는 상태로, 다정함 또는 일의 지연을 뜻합니다.", "천간충": "천간의 두 기운이 부딪히는 것으로, 정신적인 스트레스나 가치관의 대립, 투쟁을 의미합니다.", "지지육합": "두 지지가 비밀스럽고 다정하게 묶이는 현상으로, 남모르는 유대감이나 안정감을 의미합니다.", "지지충": "지지 두 글자가 강하게 충돌하는 현상으로, 이사, 이직, 분리, 사고 등 현실적인 환경의 급격한 변화를 암시합니다.", "지지원진": "가까이 있으면 밉고 떨어져 있으면 보고 싶은 애증, 예민함, 감정 소모를 유발하는 관계성입니다.", "지지형": "깎고 다듬어 맞추는 과정으로, 수술, 조정, 관재수, 혹은 법/의료/기술적 직업 재능을 의미합니다.", "지지자형": "같은 글자가 두 번 겹쳐 발생하는 스스로에 대한 강박, 내면적 스트레스, 고집을 의미합니다.", "교운기": "10년마다 바뀌는 대운(큰 환경)이 교차하는 시점입니다. 이 시기 전후로 가치관이나 환경의 큰 변화를 겪게 됩니다.", "통관용신(通關用神)": "사주 내 두 세력이 팽팽하게 싸울 때, 그 사이를 부드럽게 소통시키고 이어주는 가장 중요한 중재 기운입니다.", "병약용신(病藥用神)": "한 오행이 지나치게 많아 사주에 병(病)이 들었을 때, 그 병을 강력하게 억누르고 치료하는 약(藥)이 되는 기운입니다."
};

const getElementColor = (text) => {
  if (['목','갑','을','인','묘'].includes(text)) return '#10b981'; 
  if (['화','병','정','사','오'].includes(text)) return '#ef4444'; 
  if (['토','무','기','진','술','축','미'].includes(text)) return '#f59e0b'; 
  if (['금','경','신','유'].includes(text)) return '#94a3b8'; 
  if (['수','임','계','자','해'].includes(text)) return '#3b82f6'; 
  if (text === '?') return '#cbd5e1'; 
  return '#333';
};

const formatDate = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const formatTime = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;


// ==========================================
// 🚀 [신규] 확장성 고려: 광고 배너 컴포넌트
// ==========================================
const AdBanner = ({ format = 'horizontal', id }) => {
  return (
    <div className={`ad-wrapper ad-${format}`} data-ad-id={id}>
      <span className="ad-placeholder-text">Sponsored Ad ({format})</span>
      {/* 
        추후 여기에 구글 애드센스 코드를 넣으면 됩니다.
        예: <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXX" ...></ins>
      */}
    </div>
  );
};


// ==========================================
// 🚀 [신규] 2x4 사주 원국표 (바둑판) 컴포넌트
// ==========================================
const SajuBoard = ({ pillars, openModal }) => {
  // 실제 명리학 앱처럼 우측부터 년주->월주->일주->시주 순서로 배치 (전통 방식)
  const displayOrder = [
    { key: '시주', label: '시(시간)' },
    { key: '일주', label: '일(나)' },
    { key: '월주', label: '월(부모/사회)' },
    { key: '년주', label: '년(조상/근본)' }
  ];

  return (
    <div className="saju-board-container">
      <div className="saju-board-grid">
        {displayOrder.map((col, idx) => {
          const data = pillars[col.key];
          const isUnknown = data.ganji[0] === '?';
          
          return (
            <div key={idx} className={`saju-pillar-col ${isUnknown ? 'unknown-pillar' : ''}`}>
              {/* 기둥 라벨 */}
              <div className="pillar-header">{col.key}</div>
              
              {/* 천간 (위) */}
              <div className="pillar-cell heaven-cell">
                <div className="sipseong" onClick={() => !isUnknown && openModal(data.sipseong[0])}>
                  {data.sipseong[0]}
                </div>
                <div 
                  className="hanja" 
                  style={{ color: getElementColor(data.ganji[0]) }}
                  onClick={() => !isUnknown && openModal(data.ganji[0])}
                >
                  {data.ganji[0]}
                </div>
              </div>

              {/* 지지 (아래) */}
              <div className="pillar-cell earth-cell">
                <div 
                  className="hanja" 
                  style={{ color: data.is_gongmang ? '#ef4444' : getElementColor(data.ganji[1]) }}
                  onClick={() => !isUnknown && openModal(data.ganji[1])}
                >
                  {data.ganji[1]}
                </div>
                <div className="sipseong" onClick={() => !isUnknown && openModal(data.sipseong[1])}>
                  {data.sipseong[1]}
                </div>
              </div>

              {/* 부가 정보 (지장간, 십이운성, 신살) */}
              {!isUnknown && (
                <div className="pillar-footer">
                  <div className="jijanggan" onClick={() => openModal("지장간")}>
                    {data.jijanggan?.map((gan, i) => <span key={i} onClick={(e) => { e.stopPropagation(); openModal(gan); }}>{gan}</span>)}
                  </div>
                  {data.shipi && data.shipi !== "-" && (
                    <span className="shipi-badge" onClick={() => openModal(data.shipi)}>{data.shipi}</span>
                  )}
                  {data.is_gongmang && (
                    <span className="gongmang-badge" onClick={() => openModal("공망")}>공망</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ==========================================
// 🌟 메인 애플리케이션 (레이아웃 & 로직)
// ==========================================
export default function SajuCalculator() {
  const [activeTab, setActiveTab] = useState('saju');

  // 1. 개인 사주 상태
  const [formData, setFormData] = useState({ 
    year: 1990, month: 5, day: 15, hour: 14, minute: 30, gender: 'M', is_lunar: false, is_leap_month: false 
  });
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [result, setResult] = useState(null);
  
  // 2. 궁합 상태
  const [gunghapData, setGunghapData] = useState({
    me: { year: 1990, month: 5, day: 15, hour: 14, minute: 30, gender: 'M', is_lunar: false, is_leap_month: false, is_time_unknown: false },
    partner: { year: 1995, month: 8, day: 20, hour: 10, minute: 0, gender: 'F', is_lunar: false, is_leap_month: false, is_time_unknown: false }
  });
  const [gunghapResult, setGunghapResult] = useState(null);

  // 공통 UI 상태
  const [showRectifyModal, setShowRectifyModal] = useState(false);
  const [rectifyData, setRectifyData] = useState({ q1: 'A', q2: 'A' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalInfo, setModalInfo] = useState(null);

  const currentYear = new Date().getFullYear();

  // === 이벤트 핸들러 ===
  const handleSajuSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const response = await axios.post('https://saju-backend-ffum.onrender.com/api/saju', { ...formData, is_time_unknown: isTimeUnknown });
      setResult(response.data);
    } catch (err) { 
      setError(err.response?.data?.detail || '서버 연결 에러가 발생했습니다.'); 
    } finally { setLoading(false); }
  };

  const handleGunghapSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setGunghapResult(null);
    try {
      const response = await axios.post('https://saju-backend-ffum.onrender.com/api/gunghap', gunghapData);
      setGunghapResult(response.data);
    } catch (err) { 
      setError(err.response?.data?.detail || '서버 연결 에러가 발생했습니다.'); 
    } finally { setLoading(false); }
  };

  const handleGunghapChange = (person, e) => {
    const { name, value, type, checked } = e.target;
    setGunghapData(prev => ({
      ...prev,
      [person]: { ...prev[person], [name]: type === 'checkbox' ? checked : value }
    }));
  };

  const handleRectifySubmit = async () => {
    try {
      setLoading(true);
      const payload = { ...formData, q1_trait: rectifyData.q1, q2_time: rectifyData.q2 };
      const response = await axios.post('https://saju-backend-ffum.onrender.com/api/rectify_time', payload);
      setFormData(prev => ({ ...prev, hour: response.data.estimated_hour, minute: 30 }));
      setIsTimeUnknown(false); setShowRectifyModal(false);
      alert(`🔮 역산 결과: ${response.data.estimated_pillar}시로 추정되었습니다.\n\n${response.data.reason}\n\n입력창에 시간이 자동 적용되었습니다.`);
    } catch (err) { 
      alert("생시 역산 중 오류가 발생했습니다."); 
    } finally { setLoading(false); }
  };

  const openModal = (keyword) => {
    if (!keyword) return;
    let lookupKeyword = keyword.includes('합화') ? '천간합화(合化)' : keyword.includes('천간합') ? '천간합(기반)' : keyword;
    if (TERMS_DICT[lookupKeyword]) {
      setModalInfo({ title: lookupKeyword, desc: TERMS_DICT[lookupKeyword] });
    } else {
      setModalInfo({ title: keyword, desc: "명리학적 상호작용 기운입니다. (해당 단어의 상세 데이터가 준비 중입니다.)" });
    }
  };

  const groupedDynamic = result?.dynamic_relations ? Object.values(result.dynamic_relations.reduce((acc, rel) => {
    const key = `${rel.name}_${rel.target_pillar}`;
    if (!acc[key]) acc[key] = { ...rel, un_types: [rel.un_type] };
    else if (!acc[key].un_types.includes(rel.un_type)) acc[key].un_types.push(rel.un_type);
    return acc;
  }, {})) : [];

  return (
    <div className="app-container">
      
      {/* 🌟 프리미엄 헤더 */}
      <header className="header">
        <h1 className="title-serif">명리(命理) PRO</h1>
        <p className="subtitle">초정밀 직업·재물·궁합 통변 엔진</p>
      </header>

      {/* 🚀 반응형 대시보드 레이아웃 (PC: 2단 / 모바일: 1단) */}
      <main className="dashboard-layout">
        
        {/* =======================================
            [좌측 패널] 입력 및 컨트롤 (Sticky 고정)
        ======================================== */}
        <aside className="input-panel">
          <div className="panel-inner">
            
            {/* 탭 전환 */}
            <div className="tab-container">
              <button 
                className={`tab-btn ${activeTab === 'saju' ? 'active saju' : ''}`}
                onClick={() => {setActiveTab('saju'); setError('');}} 
              >👤 사주 분석</button>
              <button 
                className={`tab-btn ${activeTab === 'gunghap' ? 'active gunghap' : ''}`}
                onClick={() => {setActiveTab('gunghap'); setError('');}} 
              >💑 궁합 보기</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* 1. 사주 분석 폼 */}
            {activeTab === 'saju' && (
              <form onSubmit={handleSajuSubmit} className="input-form fade-in">
                
                <div className="input-row">
                  <div className="input-box">
                    <label>성별</label>
                    <div className="radio-group">
                      <label><input type="radio" name="gender" value="M" checked={formData.gender === 'M'} onChange={(e)=>setFormData({...formData, gender: e.target.value})} /> 남</label>
                      <label><input type="radio" name="gender" value="F" checked={formData.gender === 'F'} onChange={(e)=>setFormData({...formData, gender: e.target.value})} /> 여</label>
                    </div>
                  </div>
                  <div className="input-box">
                    <label>역법</label>
                    <select className="premium-input" onChange={(e) => setFormData({ ...formData, is_lunar: e.target.value.includes('lunar'), is_leap_month: e.target.value === 'lunar_leap' })} value={!formData.is_lunar ? 'solar' : formData.is_leap_month ? 'lunar_leap' : 'lunar'}>
                      <option value="solar">양력</option>
                      <option value="lunar">음력 (평달)</option>
                      <option value="lunar_leap">음력 (윤달)</option>
                    </select>
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-box fill-width">
                    <label>생년월일</label>
                    <input type="date" className="premium-input" required value={formatDate(formData.year, formData.month, formData.day)} onChange={(e) => {
                      if(!e.target.value) return;
                      const [y, m, d] = e.target.value.split('-');
                      setFormData({...formData, year: parseInt(y), month: parseInt(m), day: parseInt(d)});
                    }} />
                  </div>
                  <div className={`input-box fill-width ${isTimeUnknown ? 'disabled' : ''}`}>
                    <label>태어난 시간</label>
                    <input type="time" className="premium-input" disabled={isTimeUnknown} value={formatTime(formData.hour, formData.minute)} onChange={(e) => {
                      if(!e.target.value) return;
                      const [h, min] = e.target.value.split(':');
                      setFormData({...formData, hour: parseInt(h), minute: parseInt(min)});
                    }} />
                  </div>
                </div>

                <div className="form-options">
                  <button type="button" className="action-btn" onClick={() => setShowRectifyModal(true)}>🔮 생시 역추적하기</button>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={isTimeUnknown} onChange={(e) => setIsTimeUnknown(e.target.checked)} /> 시간 모름
                  </label>
                </div>

                <button type="submit" disabled={loading} className="premium-button">
                  {loading ? '운명 분석 중...' : '사주 분석하기'}
                </button>
              </form>
            )}

            {/* 2. 궁합 분석 폼 */}
            {activeTab === 'gunghap' && (
              <form onSubmit={handleGunghapSubmit} className="input-form fade-in">
                {/* 👤 나의 정보 */}
                <div className="gunghap-section mine">
                  <h4 className="section-title">👤 나의 정보</h4>
                  <div className="input-row">
                    <select className="premium-input" name="gender" value={gunghapData.me.gender} onChange={(e) => handleGunghapChange('me', e)}>
                      <option value="M">남성</option><option value="F">여성</option>
                    </select>
                    <select className="premium-input" onChange={(e) => {
                      const val = e.target.value; setGunghapData(prev => ({...prev, me: {...prev.me, is_lunar: val.includes('lunar'), is_leap_month: val === 'lunar_leap'}}))
                    }} value={!gunghapData.me.is_lunar ? 'solar' : gunghapData.me.is_leap_month ? 'lunar_leap' : 'lunar'}>
                      <option value="solar">양력</option><option value="lunar">음력</option>
                    </select>
                  </div>
                  <div className="input-row">
                    <input type="date" className="premium-input" value={formatDate(gunghapData.me.year, gunghapData.me.month, gunghapData.me.day)} onChange={(e) => {
                      if(!e.target.value) return; const [y, m, d] = e.target.value.split('-'); setGunghapData(prev => ({...prev, me: {...prev.me, year: parseInt(y), month: parseInt(m), day: parseInt(d)}}));
                    }} />
                    <input type="time" className="premium-input" disabled={gunghapData.me.is_time_unknown} value={formatTime(gunghapData.me.hour, gunghapData.me.minute)} onChange={(e) => {
                      if(!e.target.value) return; const [h, min] = e.target.value.split(':'); setGunghapData(prev => ({...prev, me: {...prev.me, hour: parseInt(h), minute: parseInt(min)}}));
                    }} />
                  </div>
                  <div className="checkbox-align-right">
                    <label className="checkbox-label"><input type="checkbox" name="is_time_unknown" checked={gunghapData.me.is_time_unknown} onChange={(e) => handleGunghapChange('me', e)} /> 시간 모름</label>
                  </div>
                </div>

                {/* 💖 상대방 정보 */}
                <div className="gunghap-section partner mt-10">
                  <h4 className="section-title">💖 상대방 정보</h4>
                  <div className="input-row">
                    <select className="premium-input partner-input" name="gender" value={gunghapData.partner.gender} onChange={(e) => handleGunghapChange('partner', e)}>
                      <option value="F">여성</option><option value="M">남성</option>
                    </select>
                    <select className="premium-input partner-input" onChange={(e) => {
                      const val = e.target.value; setGunghapData(prev => ({...prev, partner: {...prev.partner, is_lunar: val.includes('lunar'), is_leap_month: val === 'lunar_leap'}}))
                    }} value={!gunghapData.partner.is_lunar ? 'solar' : gunghapData.partner.is_leap_month ? 'lunar_leap' : 'lunar'}>
                      <option value="solar">양력</option><option value="lunar">음력</option>
                    </select>
                  </div>
                  <div className="input-row">
                    <input type="date" className="premium-input partner-input" value={formatDate(gunghapData.partner.year, gunghapData.partner.month, gunghapData.partner.day)} onChange={(e) => {
                      if(!e.target.value) return; const [y, m, d] = e.target.value.split('-'); setGunghapData(prev => ({...prev, partner: {...prev.partner, year: parseInt(y), month: parseInt(m), day: parseInt(d)}}));
                    }} />
                    <input type="time" className="premium-input partner-input" disabled={gunghapData.partner.is_time_unknown} value={formatTime(gunghapData.partner.hour, gunghapData.partner.minute)} onChange={(e) => {
                      if(!e.target.value) return; const [h, min] = e.target.value.split(':'); setGunghapData(prev => ({...prev, partner: {...prev.partner, hour: parseInt(h), minute: parseInt(min)}}));
                    }} />
                  </div>
                  <div className="checkbox-align-right">
                    <label className="checkbox-label"><input type="checkbox" name="is_time_unknown" checked={gunghapData.partner.is_time_unknown} onChange={(e) => handleGunghapChange('partner', e)} /> 시간 모름</label>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="premium-button gunghap-btn">
                  {loading ? '궁합 연결 중...' : '궁합 점수 확인하기'}
                </button>
              </form>
            )}

            {/* 🚀 광고 배너 (사이드바 고정형) */}
            <div className="sidebar-ad mt-20">
              <AdBanner format="rectangle" id="ad-sidebar" />
            </div>

          </div>
        </aside>

        {/* =======================================
            [우측 패널] 결과 출력 및 그리드 (밀도 높음)
        ======================================== */}
        <section className="result-panel">
          
          {/* 상태 1: 대기 화면 */}
          {!loading && !result && !gunghapResult && (
            <div className="empty-state fade-in">
              <div className="empty-icon">☯️</div>
              <h3 className="title-serif">당신의 고유한 바코드를 해독합니다</h3>
              <p>좌측에 정보를 입력하시면, 수천 년간 누적된 명리학 데이터를<br/>바탕으로 당신만의 운명 보고서가 이곳에 펼쳐집니다.</p>
            </div>
          )}

          {/* 상태 2: 로딩 중 */}
          {loading && (
            <div className="loading-state fade-in">
              <div className="oriental-spinner"></div>
              <p className="loading-text">명식과 대운의 흐름을 분석하고 있습니다...</p>
            </div>
          )}

          {/* 🌟 결과 1: 개인 사주 (그리드 레이아웃) */}
          {!loading && result && activeTab === 'saju' && (
            <div className="result-grid fade-in">
              
              {/* [카드 1: 사주 원국표 2x4 바둑판] 전체 너비 차지 */}
              <div className="result-card full-width">
                <h3 className="card-title title-serif">📌 나의 사주 원국 (팔자)</h3>
                <SajuBoard pillars={result.pillars} openModal={openModal} />
              </div>

              {/* [카드 2: 일진 / 오행] */}
              <div className="result-card">
                 <h3 className="card-title title-serif">📊 오행 분포도</h3>
                 <div className="elements-visual">
                    {Object.entries(result.elements_ratio).map(([element, ratio]) => (
                      <div key={element} className="element-bar-row">
                        <strong onClick={() => openModal(element)} style={{ color: getElementColor(element) }}>{element}</strong>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${ratio}%`, backgroundColor: getElementColor(element) }}></div>
                        </div>
                        <span>{ratio}%</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="result-card bg-highlight">
                <h3 className="card-title title-serif">📅 오늘의 운세 (일진)</h3>
                <div className="iljin-box">
                  <div className="iljin-date">{result.iljin.date}</div>
                  <div className="iljin-chars">
                    <div className="char-col">
                      <span className="char" style={{ color: getElementColor(result.iljin.ganji[0]) }} onClick={() => openModal(result.iljin.ganji[0])}>{result.iljin.ganji[0]}</span>
                      <span className="sip" onClick={() => openModal(result.iljin.sipseong[0])}>{result.iljin.sipseong[0]}</span>
                    </div>
                    <div className="char-col">
                      <span className="char" style={{ color: result.iljin.is_gongmang ? '#ef4444' : getElementColor(result.iljin.ganji[1]) }} onClick={() => openModal(result.iljin.ganji[1])}>{result.iljin.ganji[1]}</span>
                      <span className="sip" onClick={() => openModal(result.iljin.sipseong[1])}>{result.iljin.sipseong[1]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🚀 광고 배너 (인피드 가로형) 전체 너비 */}
              <div className="infeed-ad full-width">
                <AdBanner format="horizontal" id="ad-infeed" />
              </div>

              {/* [카드 3: 스토리텔링] 전체 너비 */}
              <div className="result-card full-width storytelling-card">
                <h3 className="card-title title-serif">📖 심층 운명 분석 스토리</h3>
                <div className="story-content">
                  <h4>🔹 타고난 오행의 기운</h4>
                  <p>{result.interpretation.five_elements_desc}</p>
                  <h4>🔹 활동성과 이동 (역마)</h4>
                  <p>{result.interpretation.movement_luck}</p>
                  <h4>💼 직업 및 재물운 분석</h4>
                  <p>{result.interpretation.job_wealth_desc}</p>
                </div>
              </div>

            </div>
          )}

          {/* 🌟 결과 2: 궁합 보기 (그리드 레이아웃) */}
          {!loading && gunghapResult && activeTab === 'gunghap' && (
            <div className="result-grid fade-in">
              <div className="result-card full-width text-center score-card">
                <h3 className="card-title justify-center title-serif text-pink">두 사람의 찰떡 궁합도는?</h3>
                <div className="score-display">
                  {gunghapResult.score}<span>점</span>
                </div>
                <div className="score-summary">"{gunghapResult.summary}"</div>
              </div>
              
              <div className="result-card full-width">
                 <h4 className="card-title">☯️ 기운의 조화 (오행 보완)</h4>
                 <p className="card-desc">{gunghapResult.element_complement}</p>
              </div>
              
              <div className="infeed-ad full-width">
                <AdBanner format="horizontal" id="ad-infeed-gunghap" />
              </div>

              <div className="result-card">
                 <h4 className="card-title">🧠 마음과 생각 (천간)</h4>
                 <p className="card-desc">{gunghapResult.heavenly_desc}</p>
              </div>
              <div className="result-card">
                 <h4 className="card-title">🏡 현실적 환경 (지지)</h4>
                 <p className="card-desc">{gunghapResult.earthly_desc}</p>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* ===================== [공통 모달창 영역 (기존 로직 보존)] ===================== */}
      {showRectifyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🔮 생시 역추적 시스템</h3>
            <p>태어난 연/월/일을 기반으로 가장 확률이 높은 시간을 찾아냅니다.</p>
            <div className="modal-form-group">
              <label>Q1. 평소 성향이나 방향은?</label>
              <select className="premium-input" value={rectifyData.q1} onChange={(e) => setRectifyData({...rectifyData, q1: e.target.value})}>
                <option value="A">독립심이 강하고 주체적이다</option>
                <option value="B">창의적이고 베푸는 것을 좋아한다</option>
                <option value="C">현실적이고 결과와 재물을 중시한다</option>
                <option value="D">원칙과 명예를 중시한다</option>
                <option value="E">직관력이 뛰어나며 사색을 즐긴다</option>
              </select>
            </div>
            <div className="modal-form-group mt-15">
              <label>Q2. 에너지가 편안한 시간은?</label>
              <select className="premium-input" value={rectifyData.q2} onChange={(e) => setRectifyData({...rectifyData, q2: e.target.value})}>
                <option value="A">새벽 ~ 아침</option>
                <option value="B">낮 ~ 늦은 오후</option>
                <option value="C">해 질 녘 ~ 초저녁</option>
                <option value="D">늦은 밤 ~ 심야</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowRectifyModal(false)} className="action-btn-outline">취소</button>
              <button onClick={handleRectifySubmit} className="action-btn-primary">생시 추정하기</button>
            </div>
          </div>
        </div>
      )}

      {modalInfo && (
        <div className="modal-overlay" onClick={() => setModalInfo(null)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalInfo.title}</h3>
              <button onClick={() => setModalInfo(null)} className="close-btn">&times;</button>
            </div>
            <p className="modal-desc">{modalInfo.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}