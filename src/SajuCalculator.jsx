import React, { useState } from 'react';
import axios from 'axios';

// 💡 통합 사전 데이터 (생략 없음)
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
  if (['목','갑','을','인','묘'].includes(text)) return '#10b981'; // 청량한 그린
  if (['화','병','정','사','오'].includes(text)) return '#ef4444'; // 열정의 레드
  if (['토','무','기','진','술','축','미'].includes(text)) return '#d97706'; // 묵직한 골드브라운
  if (['금','경','신','유'].includes(text)) return '#64748b'; // 세련된 스틸그레이
  if (['수','임','계','자','해'].includes(text)) return '#3b82f6'; // 깊은 블루
  if (text === '?') return '#cbd5e1'; 
  return '#333';
};

const formatDate = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const formatTime = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

// 🌟 프리미엄 글로벌 CSS 스타일링 내장
const globalStyles = `
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  
  body {
    background-color: #F8F7F4; /* 따뜻하고 고급스러운 아이보리 배경 */
    margin: 0;
    font-family: 'Pretendard', -apple-system, sans-serif;
    color: #2C303A;
  }
  
  /* 부드러운 등장 애니메이션 */
  .fade-in {
    animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* 고급스러운 카드 UI */
  .premium-card {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    border: 1px solid #EFECE6;
    margin-bottom: 20px;
  }

  /* 모바일 최적화 큼직한 인풋 창 */
  .input-field {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #E2DED5;
    border-radius: 10px;
    font-size: 16px; /* iOS 자동확대 방지 */
    background-color: #FAFAFA;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  .input-field:focus {
    border-color: #B59960;
    background-color: #FFF;
    outline: none;
    box-shadow: 0 0 0 3px rgba(181, 153, 96, 0.15);
  }

  /* 라벨 텍스트 */
  .label-text {
    font-size: 0.85em;
    color: #6B7280;
    margin-bottom: 6px;
    display: block;
    font-weight: 600;
  }

  /* 프리미엄 골드/네이비 버튼 */
  .btn-primary {
    background: linear-gradient(135deg, #1C2536 0%, #111827 100%);
    color: #F3E8D0;
    padding: 16px;
    border: none;
    border-radius: 12px;
    font-size: 1.1em;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s;
    box-shadow: 0 4px 15px rgba(17, 24, 39, 0.2);
  }
  .btn-primary:active {
    transform: scale(0.98);
  }
  .btn-primary:disabled {
    background: #9CA3AF;
    box-shadow: none;
    cursor: not-allowed;
  }

  /* 로딩 스피너 */
  .spinner {
    border: 3px solid rgba(243, 232, 208, 0.3);
    border-top-color: #F3E8D0;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function SajuCalculator() {
  const [activeTab, setActiveTab] = useState('saju');

  // 1. 개인 사주 상태 (이름, 출생지 추가)
  const [formData, setFormData] = useState({ 
    name: '', birthPlace: '대한민국 (서울 기준)',
    year: 1990, month: 5, day: 15, hour: 14, minute: 30, gender: 'M', is_lunar: false, is_leap_month: false 
  });
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [result, setResult] = useState(null);
  
  // 2. 궁합 상태 (이름, 출생지 추가)
  const [gunghapData, setGunghapData] = useState({
    me: { name: '', birthPlace: '대한민국', year: 1990, month: 5, day: 15, hour: 14, minute: 30, gender: 'M', is_lunar: false, is_leap_month: false, is_time_unknown: false },
    partner: { name: '', birthPlace: '대한민국', year: 1995, month: 8, day: 20, hour: 10, minute: 0, gender: 'F', is_lunar: false, is_leap_month: false, is_time_unknown: false }
  });
  const [gunghapResult, setGunghapResult] = useState(null);

  // 공통 UI 상태
  const [showRectifyModal, setShowRectifyModal] = useState(false);
  const [rectifyData, setRectifyData] = useState({ q1: 'A', q2: 'A' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalInfo, setModalInfo] = useState(null);

  const currentYear = new Date().getFullYear();

  // === API 통신 핸들러 ===
  const handleSajuSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      // 🚀 변경사항: 백엔드로 보낼 때 name, birthPlace 데이터를 함께 묶어서 전송 (미래 백엔드 확장 대비)
      const payload = { ...formData, is_time_unknown: isTimeUnknown };
      const response = await axios.post('https://saju-backend-ffum.onrender.com/api/saju', payload);
      setResult(response.data);
    } catch (err) { 
      setError(err.response?.data?.detail || '서버 연결 에러가 발생했습니다.'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleGunghapSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setGunghapResult(null);
    try {
      const response = await axios.post('https://saju-backend-ffum.onrender.com/api/gunghap', gunghapData);
      setGunghapResult(response.data);
    } catch (err) { 
      setError(err.response?.data?.detail || '서버 연결 에러가 발생했습니다.'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleGunghapChange = (person, e) => {
    const { name, value, type, checked } = e.target;
    setGunghapData(prev => ({
      ...prev,
      [person]: { 
        ...prev[person], 
        [name]: type === 'checkbox' ? checked : type === 'number' ? (parseInt(value, 10) || 0) : value 
      }
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
    } finally { 
      setLoading(false); 
    }
  };

  const openModal = (keyword) => {
    if (!keyword) return;
    let lookupKeyword = keyword.includes('합화') ? '천간합화(合化)' : keyword.includes('천간합') ? '천간합(기반)' : keyword;
    if (TERMS_DICT[lookupKeyword]) setModalInfo({ title: lookupKeyword, desc: TERMS_DICT[lookupKeyword] });
    else setModalInfo({ title: keyword, desc: "해당 단어의 상세 사전 데이터가 준비 중입니다." });
  };

  return (
    <>
      {/* 스타일 주입 */}
      <style>{globalStyles}</style>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', paddingBottom: '60px' }}>
        
        {/* 🌟 프리미엄 헤더 영역 */}
        <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '2em', color: '#1C2536', fontWeight: '800', letterSpacing: '-0.5px' }}>
            운명의 <span style={{ color: '#B59960' }}>나침반</span>
          </h2>
          <p style={{ margin: '8px 0 20px', color: '#6B7280', fontSize: '0.95em' }}>
            글로벌 초정밀 사주 & 궁합 분석 엔진
          </p>
          
          {/* 모던 탭 버튼 */}
          <div style={{ display: 'flex', backgroundColor: '#EFECE6', borderRadius: '12px', padding: '6px' }}>
            <button 
              onClick={() => {setActiveTab('saju'); setError('');}} 
              style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '1em', backgroundColor: activeTab === 'saju' ? '#FFFFFF' : 'transparent', color: activeTab === 'saju' ? '#1C2536' : '#9CA3AF', boxShadow: activeTab === 'saju' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}
            >
              👤 개인 사주 분석
            </button>
            <button 
              onClick={() => {setActiveTab('gunghap'); setError('');}} 
              style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '1em', backgroundColor: activeTab === 'gunghap' ? '#FFFFFF' : 'transparent', color: activeTab === 'gunghap' ? '#B59960' : '#9CA3AF', boxShadow: activeTab === 'gunghap' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}
            >
              💑 프리미엄 궁합
            </button>
          </div>
        </div>

        {error && <div className="fade-in" style={{ padding: '16px', backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', color: '#991B1B', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>{error}</div>}

        {/* ===================== [1. 개인 사주 탭] ===================== */}
        {activeTab === 'saju' && (
          <div className="fade-in">
            <form onSubmit={handleSajuSubmit} className="premium-card">
              
              {/* 이름 및 출생지 (글로벌 확장) */}
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label className="label-text">이름 (닉네임)</label>
                  <input type="text" className="input-field" placeholder="홍길동" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label-text">성별</label>
                  <div style={{ display: 'flex', gap: '5px', height: '49px' }}>
                    <button type="button" onClick={() => setFormData({...formData, gender: 'M'})} style={{ flex: 1, borderRadius: '8px', border: formData.gender === 'M' ? '2px solid #1C2536' : '1px solid #E2DED5', background: formData.gender === 'M' ? '#F3F4F6' : '#FAFAFA', fontWeight: formData.gender === 'M' ? '700' : '500', color: formData.gender === 'M' ? '#1C2536' : '#9CA3AF', cursor: 'pointer' }}>남성</button>
                    <button type="button" onClick={() => setFormData({...formData, gender: 'F'})} style={{ flex: 1, borderRadius: '8px', border: formData.gender === 'F' ? '2px solid #1C2536' : '1px solid #E2DED5', background: formData.gender === 'F' ? '#F3F4F6' : '#FAFAFA', fontWeight: formData.gender === 'F' ? '700' : '500', color: formData.gender === 'F' ? '#1C2536' : '#9CA3AF', cursor: 'pointer' }}>여성</button>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className="label-text">태어난 국가/도시 (경도 보정용)</label>
                <input type="text" className="input-field" placeholder="예: 대한민국 서울, 미국 뉴욕" value={formData.birthPlace} onChange={(e) => setFormData({...formData, birthPlace: e.target.value})} />
              </div>

              {/* 생년월일 & 시간 (모바일 최적화 터치 휠) */}
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: '1.2' }}>
                  <label className="label-text">생년월일</label>
                  <input 
                    type="date" className="input-field" required
                    value={formatDate(formData.year, formData.month, formData.day)} 
                    onChange={(e) => {
                      if(!e.target.value) return;
                      const [y, m, d] = e.target.value.split('-');
                      setFormData({...formData, year: parseInt(y), month: parseInt(m), day: parseInt(d)});
                    }} 
                  />
                </div>
                <div style={{ flex: '1', opacity: isTimeUnknown ? 0.4 : 1, transition: 'opacity 0.3s' }}>
                  <label className="label-text">태어난 시간</label>
                  <input 
                    type="time" className="input-field" disabled={isTimeUnknown}
                    value={formatTime(formData.hour, formData.minute)} 
                    onChange={(e) => {
                      if(!e.target.value) return;
                      const [h, min] = e.target.value.split(':');
                      setFormData({...formData, hour: parseInt(h), minute: parseInt(min)});
                    }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', padding: '12px', backgroundColor: '#F9F8F6', borderRadius: '10px' }}>
                <label style={{ fontSize: '0.9em', color: '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                  <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#B59960' }} checked={isTimeUnknown} onChange={(e) => setIsTimeUnknown(e.target.checked)} /> 
                  시간을 정확히 모릅니다
                </label>
                <button type="button" onClick={() => setShowRectifyModal(true)} style={{ padding: '8px 16px', backgroundColor: '#FFF', color: '#B59960', border: '1px solid #D4AF37', borderRadius: '8px', fontSize: '0.85em', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 5px rgba(212,175,55,0.1)' }}>
                  🔮 생시 추론하기
                </button>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <><div className="spinner"></div> 운명을 해독하는 중...</> : '내 사주 원국 분석하기'}
              </button>
            </form>

            {/* 결과 화면 렌더링 (애니메이션 적용) */}
            {result && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 📌 사주 팔자 (원국) 카드 */}
                <div className="premium-card">
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2em', color: '#1C2536', borderBottom: '2px solid #F0ECE1', paddingBottom: '10px' }}>
                    <span style={{ color: '#B59960' }}>{formData.name || '고객'}</span>님의 사주 원국표
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                    {['년주', '월주', '일주', '시주'].map((pillarKey) => {
                      const data = result.pillars[pillarKey];
                      const isUnknown = data.ganji[0] === '?';
                      return (
                        <div key={pillarKey} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#FDFCFB', padding: '20px 5px', borderRadius: '12px', border: '1px solid #EFECE6', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                          <div style={{ fontSize: '0.8em', color: '#9CA3AF', fontWeight: '700', marginBottom: '12px' }}>{pillarKey}</div>
                          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                            <div onClick={() => !isUnknown && openModal(data.ganji[0])} style={{ fontSize: '2em', fontWeight: '900', color: getElementColor(data.ganji[0]), cursor: isUnknown ? 'default' : 'pointer', lineHeight: '1.1' }}>{data.ganji[0]}</div>
                            <div onClick={() => !isUnknown && openModal(data.sipseong[0])} style={{ fontSize: '0.8em', color: '#6B7280', cursor: isUnknown ? 'default' : 'pointer', marginTop: '6px' }}>{data.sipseong[0]}</div>
                          </div>
                          <div style={{ width: '40px', height: '1px', backgroundColor: '#E5E0D8', margin: '5px 0 15px 0' }} />
                          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                            <div onClick={() => !isUnknown && openModal(data.ganji[1])} style={{ fontSize: '2em', fontWeight: '900', color: data.is_gongmang ? '#EF4444' : getElementColor(data.ganji[1]), cursor: isUnknown ? 'default' : 'pointer', lineHeight: '1.1' }}>{data.ganji[1]}</div>
                            <div onClick={() => !isUnknown && openModal(data.sipseong[1])} style={{ fontSize: '0.8em', color: '#6B7280', cursor: isUnknown ? 'default' : 'pointer', marginTop: '6px' }}>{data.sipseong[1]}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 📖 심층 스토리텔링 카드 */}
                <div className="premium-card">
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2em', color: '#1C2536', borderBottom: '2px solid #F0ECE1', paddingBottom: '10px' }}>📖 심층 스토리텔링</h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#B59960', fontSize: '1em' }}>타고난 성향과 에너지</h4>
                    <p style={{ margin: 0, fontSize: '0.95em', color: '#4B5563', lineHeight: '1.7' }}>{result.interpretation.five_elements_desc}</p>
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#B59960', fontSize: '1em' }}>직업 및 재물운 흐름</h4>
                    <p style={{ margin: 0, fontSize: '0.95em', color: '#4B5563', lineHeight: '1.7' }}>{result.interpretation.job_wealth_desc}</p>
                  </div>

                  <div style={{ backgroundColor: '#F9F8F6', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #B59960' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#1C2536', fontSize: '0.95em' }}>🍀 나만의 행운 솔루션</h4>
                    <p style={{ margin: 0, fontSize: '0.9em', color: '#4B5563', lineHeight: '1.6' }}>
                      <strong>행운의 색상:</strong> {result.interpretation.lucky_color} <br/>
                      <strong>길한 방향:</strong> {result.interpretation.lucky_direction} <br/>
                      <strong>추천 아이템:</strong> {result.interpretation.lucky_item}
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ===================== [2. 궁합 보기 탭] ===================== */}
        {activeTab === 'gunghap' && (
          <div className="fade-in">
            <form onSubmit={handleGunghapSubmit} className="premium-card">
              
              {/* 👤 나의 정보 */}
              <div style={{ backgroundColor: '#F9F8F6', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #EFECE6' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#1C2536', fontSize: '1.1em' }}>👤 나의 정보</h4>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}><input type="text" className="input-field" placeholder="내 이름" name="name" value={gunghapData.me.name} onChange={(e) => handleGunghapChange('me', e)} /></div>
                  <div style={{ flex: 1 }}>
                    <select className="input-field" name="gender" value={gunghapData.me.gender} onChange={(e) => handleGunghapChange('me', e)}>
                      <option value="M">남성</option>
                      <option value="F">여성</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input type="date" className="input-field" style={{ flex: '1.2' }} value={formatDate(gunghapData.me.year, gunghapData.me.month, gunghapData.me.day)} onChange={(e) => {
                    if(!e.target.value) return; const [y, m, d] = e.target.value.split('-');
                    setGunghapData(prev => ({...prev, me: {...prev.me, year: parseInt(y), month: parseInt(m), day: parseInt(d)}}));
                  }} />
                  <input type="time" className="input-field" style={{ flex: 1 }} value={formatTime(gunghapData.me.hour, gunghapData.me.minute)} onChange={(e) => {
                    if(!e.target.value) return; const [h, min] = e.target.value.split(':');
                    setGunghapData(prev => ({...prev, me: {...prev.me, hour: parseInt(h), minute: parseInt(min)}}));
                  }} />
                </div>
              </div>

              {/* 💖 상대방 정보 */}
              <div style={{ backgroundColor: '#FFF5F7', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #FCE7F3' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#BE185D', fontSize: '1.1em' }}>💖 상대방 정보</h4>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}><input type="text" className="input-field" style={{ borderColor: '#FBCFE8' }} placeholder="상대방 이름" name="name" value={gunghapData.partner.name} onChange={(e) => handleGunghapChange('partner', e)} /></div>
                  <div style={{ flex: 1 }}>
                    <select className="input-field" style={{ borderColor: '#FBCFE8' }} name="gender" value={gunghapData.partner.gender} onChange={(e) => handleGunghapChange('partner', e)}>
                      <option value="F">여성</option>
                      <option value="M">남성</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input type="date" className="input-field" style={{ flex: '1.2', borderColor: '#FBCFE8' }} value={formatDate(gunghapData.partner.year, gunghapData.partner.month, gunghapData.partner.day)} onChange={(e) => {
                    if(!e.target.value) return; const [y, m, d] = e.target.value.split('-');
                    setGunghapData(prev => ({...prev, partner: {...prev.partner, year: parseInt(y), month: parseInt(m), day: parseInt(d)}}));
                  }} />
                  <input type="time" className="input-field" style={{ flex: 1, borderColor: '#FBCFE8' }} value={formatTime(gunghapData.partner.hour, gunghapData.partner.minute)} onChange={(e) => {
                    if(!e.target.value) return; const [h, min] = e.target.value.split(':');
                    setGunghapData(prev => ({...prev, partner: {...prev.partner, hour: parseInt(h), minute: parseInt(min)}}));
                  }} />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #BE185D 0%, #9D174D 100%)', color: '#FFF' }} disabled={loading}>
                {loading ? <><div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#FFF' }}></div> 인연의 끈 분석 중...</> : '궁합 점수 확인하기'}
              </button>
            </form>

            {gunghapResult && (
              <div className="fade-in premium-card" style={{ textAlign: 'center', borderColor: '#FCE7F3', boxShadow: '0 10px 30px rgba(190,24,93,0.05)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#831843', fontSize: '1.3em' }}>두 사람의 찰떡 궁합도는?</h3>
                <div style={{ fontSize: '5em', fontWeight: '900', color: '#DB2777', textShadow: '2px 2px 0px #FDF2F8' }}>
                  {gunghapResult.score}<span style={{ fontSize: '0.4em', color: '#F472B6' }}>점</span>
                </div>
                <div style={{ marginTop: '20px', backgroundColor: '#FDF2F8', padding: '20px', borderRadius: '12px', color: '#9D174D', fontWeight: '600', lineHeight: '1.6' }}>
                  "{gunghapResult.summary}"
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 🔮 생시 역추적 모달 (생략 없이 유지) */}
      {showRectifyModal && (
        <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '20px', maxWidth: '400px', width: '100%' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#B59960', fontSize: '1.3em' }}>🔮 생시 추론 시스템</h3>
            <p style={{ margin: '0 0 25px 0', fontSize: '0.95em', color: '#6B7280', lineHeight: '1.5' }}>성향과 에너지 사이클을 분석하여 가장 확률이 높은 태어난 시간을 찾아냅니다.</p>
            
            <div style={{ marginBottom: '20px' }}>
              <label className="label-text" style={{ color: '#1C2536' }}>Q1. 당신의 핵심 성향은?</label>
              <select value={rectifyData.q1} onChange={(e) => setRectifyData({...rectifyData, q1: e.target.value})} className="input-field">
                <option value="A">독립적이고 주관이 뚜렷하다</option>
                <option value="B">창의적이고 표현하기를 좋아한다</option>
                <option value="C">현실적이고 결과/재물을 중시한다</option>
                <option value="D">원칙과 명예, 책임감을 중시한다</option>
                <option value="E">직관력이 뛰어나고 생각이 깊다</option>
              </select>
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label className="label-text" style={{ color: '#1C2536' }}>Q2. 하루 중 가장 에너지가 넘치는 시간은?</label>
              <select value={rectifyData.q2} onChange={(e) => setRectifyData({...rectifyData, q2: e.target.value})} className="input-field">
                <option value="A">새벽 ~ 아침 (03시 ~ 09시)</option>
                <option value="B">낮 ~ 늦은 오후 (09시 ~ 15시)</option>
                <option value="C">해 질 녘 ~ 초저녁 (15시 ~ 21시)</option>
                <option value="D">늦은 밤 ~ 심야 (21시 ~ 03시)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowRectifyModal(false)} style={{ flex: 1, padding: '14px', backgroundColor: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>취소</button>
              <button onClick={handleRectifySubmit} disabled={loading} style={{ flex: 2, padding: '14px', backgroundColor: '#B59960', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>{loading ? '분석 중...' : '시간 추론하기'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ℹ️ 용어 설명 모달 */}
      {modalInfo && (
        <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setModalInfo(null)}>
          <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '20px', maxWidth: '340px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #F0ECE1', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#1C2536', fontSize: '1.4em', fontWeight: '800' }}>{modalInfo.title}</h3>
              <button onClick={() => setModalInfo(null)} style={{ background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer', color: '#9CA3AF' }}>&times;</button>
            </div>
            <p style={{ margin: 0, lineHeight: '1.7', color: '#4B5563', fontSize: '1em', wordBreak: 'keep-all' }}>{modalInfo.desc}</p>
          </div>
        </div>
      )}
    </>
  );
}