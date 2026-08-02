import React, { useState } from 'react';
import axios from 'axios';

// 💡 통합 사전 데이터 (절대 수정/삭제 금지)
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

// 🌍 글로벌 출생지 데이터 (경도, 표준시 내장) - 프론트에서 자체 처리
const GLOBAL_LOCATIONS = [
  { id: 'KR_SEO', label: '🇰🇷 대한민국 (서울/표준)', lon: 126.97, tz: 9 },
  { id: 'KR_BUS', label: '🇰🇷 대한민국 (부산/경상)', lon: 129.07, tz: 9 },
  { id: 'US_NYC', label: '🇺🇸 미국 (뉴욕/동부)', lon: -74.00, tz: -5 },
  { id: 'US_LAX', label: '🇺🇸 미국 (LA/서부)', lon: -118.24, tz: -8 },
  { id: 'JP_TOK', label: '🇯🇵 일본 (도쿄)', lon: 139.69, tz: 9 },
  { id: 'CN_BEI', label: '🇨🇳 중국 (베이징)', lon: 116.40, tz: 8 },
  { id: 'GB_LON', label: '🇬🇧 영국 (런던)', lon: -0.12, tz: 0 },
  { id: 'AU_SYD', label: '🇦🇺 호주 (시드니)', lon: 151.20, tz: 10 },
  { id: 'CA_TOR', label: '🇨🇦 캐나다 (토론토)', lon: -79.38, tz: -5 },
  { id: 'FR_PAR', label: '🇫🇷 프랑스 (파리)', lon: 2.35, tz: 1 },
];

const getElementColor = (text) => {
  if (['목','갑','을','인','묘'].includes(text)) return '#10b981';
  if (['화','병','정','사','오'].includes(text)) return '#ef4444';
  if (['토','무','기','진','술','축','미'].includes(text)) return '#d97706';
  if (['금','경','신','유'].includes(text)) return '#64748b';
  if (['수','임','계','자','해'].includes(text)) return '#3b82f6';
  if (text === '?') return '#cbd5e1'; 
  return '#333';
};

const formatDate = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const formatTime = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

// 🌟 프리미엄 글로벌 CSS 스타일링 & 메뉴 애니메이션
const globalStyles = `
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  
  body {
    background-color: #F8F7F4; margin: 0; font-family: 'Pretendard', -apple-system, sans-serif; color: #2C303A; overflow-x: hidden;
  }
  
  .fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .premium-card {
    background: #FFFFFF; border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03); border: 1px solid #EFECE6; margin-bottom: 20px;
  }

  .input-field {
    width: 100%; padding: 14px 16px; border: 1px solid #E2DED5; border-radius: 10px; font-size: 16px; background-color: #FAFAFA; transition: all 0.2s; box-sizing: border-box;
  }
  .input-field:focus { border-color: #B59960; background-color: #FFF; outline: none; box-shadow: 0 0 0 3px rgba(181, 153, 96, 0.15); }

  .label-text { font-size: 0.85em; color: #6B7280; margin-bottom: 6px; display: block; font-weight: 600; }

  .btn-primary {
    background: linear-gradient(135deg, #1C2536 0%, #111827 100%); color: #F3E8D0; padding: 16px; border: none; border-radius: 12px; font-size: 1.1em; font-weight: 700; cursor: pointer; width: 100%; transition: all 0.2s; box-shadow: 0 4px 15px rgba(17, 24, 39, 0.2);
  }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { background: #9CA3AF; box-shadow: none; cursor: not-allowed; }

  .spinner {
    border: 3px solid rgba(243, 232, 208, 0.3); border-top-color: #F3E8D0; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  
  .horizontal-scroll { display: flex; overflow-x: auto; gap: 8px; padding-bottom: 10px; scrollbar-width: thin; }
  .horizontal-scroll::-webkit-scrollbar { height: 6px; }
  .horizontal-scroll::-webkit-scrollbar-thumb { background-color: #CBD5E1; border-radius: 10px; }

  /* 메뉴바 정밀 구조화 CSS */
  .menu-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(17, 24, 39, 0.6); backdrop-filter: blur(2px); z-index: 2000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
  .menu-overlay.open { opacity: 1; pointer-events: auto; }
  .side-menu { position: fixed; top: 0; right: -320px; width: 300px; height: 100%; background-color: #FFFFFF; z-index: 2100; box-shadow: -5px 0 30px rgba(0,0,0,0.15); transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; padding: 0; box-sizing: border-box; overflow-y: auto; }
  .side-menu.open { right: 0; }
  .menu-header { display: flex; justify-content: space-between; align-items: center; padding: 25px 20px; border-bottom: 1px solid #EFECE6; background-color: #F8F7F4; }
  .menu-nav-btn { display: flex; align-items: center; gap: 12px; width: 100%; padding: 18px 20px; background: none; border: none; border-bottom: 1px solid #F3F4F6; font-size: 1.05em; font-weight: 700; color: #1C2536; cursor: pointer; text-align: left; transition: background-color 0.2s; }
  .menu-nav-btn:hover { background-color: #F9FAFB; color: #B59960; }
  .menu-content { padding: 20px; flex-grow: 1; }
  .menu-box { margin-bottom: 20px; border-bottom: 1px solid #F3F4F6; padding-bottom: 15px; }
  .accordion-title { font-size: 0.95em; color: #1C2536; margin: 0; font-weight: 700; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
  .accordion-icon { transition: transform 0.3s ease; color: #9CA3AF; }
  .accordion-icon.open { transform: rotate(180deg); }
  .feature-list { list-style: none; padding: 0; margin: 15px 0 0 0; }
  .feature-list li { position: relative; padding-left: 20px; margin-bottom: 12px; font-size: 0.9em; color: #4B5563; line-height: 1.5; }
  .feature-list li::before { content: '•'; position: absolute; left: 0; top: 0; color: #B59960; font-size: 1.2em; font-weight: bold; }
  .subscribe-banner { background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); border: 1px solid #BAE6FD; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
  .subscribe-tag { display: inline-block; background-color: #0284C7; color: white; font-size: 0.7em; padding: 3px 8px; border-radius: 20px; font-weight: bold; margin-bottom: 8px; }
  .menu-footer { background-color: #F8FAFC; padding: 20px; border-top: 1px solid #EFECE6; font-size: 0.85em; color: #6B7280; }
  .contact-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
`;

export default function SajuCalculator() {
  const [activeTab, setActiveTab] = useState('saju');
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isWhyProOpen, setIsWhyProOpen] = useState(false); 

  // 1. 개인 사주 상태 (birthPlace를 GLOBAL_LOCATIONS id로 관리)
  const [formData, setFormData] = useState({ 
    name: '', birthPlace: 'KR_SEO', 
    year: 1990, month: 5, day: 15, hour: 14, minute: 30, gender: 'M', is_lunar: false, is_leap_month: false 
  });
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [result, setResult] = useState(null);
  
  // 2. 궁합 상태 
  const [gunghapData, setGunghapData] = useState({
    me: { name: '', birthPlace: 'KR_SEO', year: 1990, month: 5, day: 15, hour: 14, minute: 30, gender: 'M', is_lunar: false, is_leap_month: false, is_time_unknown: false },
    partner: { name: '', birthPlace: 'KR_SEO', year: 1995, month: 8, day: 20, hour: 10, minute: 0, gender: 'F', is_lunar: false, is_leap_month: false, is_time_unknown: false }
  });
  const [gunghapResult, setGunghapResult] = useState(null);

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
      // 선택된 지역의 실제 위경도 데이터 추출 후 전송
      const locData = GLOBAL_LOCATIONS.find(loc => loc.id === formData.birthPlace);
      const payload = { ...formData, is_time_unknown: isTimeUnknown, longitude: locData.lon, timezone: locData.tz };
      
      const response = await axios.post('https://saju-backend-ffum.onrender.com/api/saju', payload);
      setResult(response.data);
    } catch (err) { setError(err.response?.data?.detail || '서버 연결 에러가 발생했습니다.'); } finally { setLoading(false); }
  };

  const handleGunghapSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setGunghapResult(null);
    try {
      // 각각의 경도/시차 추출 후 전송 (백엔드 지원 시 활용 가능)
      const meLoc = GLOBAL_LOCATIONS.find(loc => loc.id === gunghapData.me.birthPlace);
      const ptLoc = GLOBAL_LOCATIONS.find(loc => loc.id === gunghapData.partner.birthPlace);
      const payload = {
        me: { ...gunghapData.me, longitude: meLoc.lon, timezone: meLoc.tz },
        partner: { ...gunghapData.partner, longitude: ptLoc.lon, timezone: ptLoc.tz }
      };

      const response = await axios.post('https://saju-backend-ffum.onrender.com/api/gunghap', payload);
      setGunghapResult(response.data);
    } catch (err) { setError(err.response?.data?.detail || '서버 연결 에러가 발생했습니다.'); } finally { setLoading(false); }
  };

  const handleGunghapChange = (person, e) => {
    const { name, value, type, checked } = e.target;
    setGunghapData(prev => ({ ...prev, [person]: { ...prev[person], [name]: type === 'checkbox' ? checked : type === 'number' ? (parseInt(value, 10) || 0) : value } }));
  };

  const handleRectifySubmit = async () => {
    try {
      setLoading(true);
      const locData = GLOBAL_LOCATIONS.find(loc => loc.id === formData.birthPlace);
      const payload = { ...formData, q1_trait: rectifyData.q1, q2_time: rectifyData.q2, longitude: locData.lon, timezone: locData.tz };
      const response = await axios.post('https://saju-backend-ffum.onrender.com/api/rectify_time', payload);
      setFormData(prev => ({ ...prev, hour: response.data.estimated_hour, minute: 30 }));
      setIsTimeUnknown(false); setShowRectifyModal(false);
      alert(`🔮 역산 결과: ${response.data.estimated_pillar}시로 추정되었습니다.\n\n${response.data.reason}\n\n입력창에 시간이 자동 적용되었습니다.`);
    } catch (err) { alert("생시 역산 중 오류가 발생했습니다."); } finally { setLoading(false); }
  };

  const openModal = (keyword) => {
    if (!keyword) return;
    let lookupKeyword = keyword.includes('합화') ? '천간합화(合化)' : keyword.includes('천간합') ? '천간합(기반)' : keyword;
    if (TERMS_DICT[lookupKeyword]) setModalInfo({ title: lookupKeyword, desc: TERMS_DICT[lookupKeyword] });
    else setModalInfo({ title: keyword, desc: "해당 단어의 상세 사전 데이터가 준비 중입니다." });
  };

  const groupedDynamic = result?.dynamic_relations ? Object.values(result.dynamic_relations.reduce((acc, rel) => {
    const key = `${rel.name}_${rel.target_pillar}`;
    if (!acc[key]) acc[key] = { ...rel, un_types: [rel.un_type] };
    else if (!acc[key].un_types.includes(rel.un_type)) acc[key].un_types.push(rel.un_type);
    return acc;
  }, {})) : [];

  return (
    <>
      <style>{globalStyles}</style>

      {/* 🌟 명리-PRO 사이드바 메뉴 🌟 */}
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2 style={{ margin: 0, fontSize: '1.5em', color: '#1C2536', fontWeight: '900' }}>명리<span style={{ color: '#B59960' }}>-PRO</span></h2>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div style={{ paddingBottom: '5px' }}>
          <button className="menu-nav-btn" onClick={() => { setActiveTab('saju'); setIsMenuOpen(false); }}><span style={{ fontSize: '1.2em' }}>👤</span> 개인 사주 분석</button>
          <button className="menu-nav-btn" onClick={() => { setActiveTab('gunghap'); setIsMenuOpen(false); }}><span style={{ fontSize: '1.2em' }}>💑</span> 프리미엄 궁합</button>
        </div>
        <div className="menu-content">
          <div className="menu-box">
            <h4 className="accordion-title" onClick={() => setIsWhyProOpen(!isWhyProOpen)}>
              <span>🔍 Why 명리-PRO?</span>
              <svg className={`accordion-icon ${isWhyProOpen ? 'open' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </h4>
            {isWhyProOpen && (
              <ul className="feature-list fade-in">
                <li><strong>진태양시 정밀 적용:</strong> 글로벌 출생지의 경도(Longitude)를 계산하여 시차와 1분 1초의 오차까지 보정합니다.</li>
                <li><strong>합화(合化) 정밀 판별:</strong> 단순 글자 합이 아닌 태어난 계절을 반영한 완벽한 기운 변화를 예측합니다.</li>
                <li><strong>통관/병약 용신 분석:</strong> 사주 내 병(病)과 약(藥)을 파악하는 최상위 전문가 로직을 탑재했습니다.</li>
              </ul>
            )}
          </div>
          <div className="subscribe-banner">
            <span className="subscribe-tag">COMING SOON</span>
            <h4 style={{ margin: '0 0 8px 0', color: '#0369A1', fontSize: '1em' }}>매일 운세 무료 구독 💌</h4>
            <p style={{ margin: 0, fontSize: '0.85em', color: '#0F172A', lineHeight: '1.5' }}>오늘의 운세와 이달의 운세를 매일 아침 전송해 드립니다.<br/><strong>👉 카카오톡 / 텔레그램 연동 예정</strong></p>
          </div>
        </div>
        <div className="menu-footer">
          <div style={{ fontWeight: '700', color: '#4B5563', marginBottom: '12px' }}>플랫폼 제공 및 문의</div>
          <div className="contact-item"><span>📧</span> abc@gmail.com</div>
          <div className="contact-item"><span>💬</span> 카카오톡: myeongri_pro</div>
          <div className="contact-item"><span>✈️</span> 텔레그램: @myeongri_pro</div>
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px', paddingBottom: '60px' }}>
        
        {/* 메인 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px', marginBottom: '25px' }}>
          <div style={{ flex: 1 }}></div>
          <div style={{ textAlign: 'center', flex: 2 }}>
            <h2 style={{ margin: 0, fontSize: '2em', color: '#1C2536', fontWeight: '900', letterSpacing: '-0.5px' }}>명리<span style={{ color: '#B59960' }}>-PRO</span></h2>
            <p style={{ margin: '8px 0 0', color: '#6B7280', fontSize: '0.85em', fontWeight: '600' }}>글로벌 초정밀 사주 & 궁합 엔진</p>
          </div>
          <div style={{ flex: 1, textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setIsMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 5px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1C2536" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', backgroundColor: '#EFECE6', borderRadius: '12px', padding: '6px', marginBottom: '20px' }}>
          <button onClick={() => {setActiveTab('saju'); setError('');}} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '1em', backgroundColor: activeTab === 'saju' ? '#FFFFFF' : 'transparent', color: activeTab === 'saju' ? '#1C2536' : '#9CA3AF', boxShadow: activeTab === 'saju' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}>👤 개인 사주 분석</button>
          <button onClick={() => {setActiveTab('gunghap'); setError('');}} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '1em', backgroundColor: activeTab === 'gunghap' ? '#FFFFFF' : 'transparent', color: activeTab === 'gunghap' ? '#B59960' : '#9CA3AF', boxShadow: activeTab === 'gunghap' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}>💑 프리미엄 궁합</button>
        </div>

        {error && <div className="fade-in" style={{ padding: '16px', backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', color: '#991B1B', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>{error}</div>}

        {/* ========================================================
            [1] 개인 사주 탭
        ======================================================== */}
        {activeTab === 'saju' && (
          <div className="fade-in">
            <form onSubmit={handleSajuSubmit} className="premium-card">
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label className="label-text">이름 (닉네임)</label><input type="text" className="input-field" placeholder="홍길동" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                <div style={{ flex: 1 }}><label className="label-text">성별</label>
                  <div style={{ display: 'flex', gap: '5px', height: '49px' }}>
                    <button type="button" onClick={() => setFormData({...formData, gender: 'M'})} style={{ flex: 1, borderRadius: '8px', border: formData.gender === 'M' ? '2px solid #1C2536' : '1px solid #E2DED5', background: formData.gender === 'M' ? '#F3F4F6' : '#FAFAFA', fontWeight: formData.gender === 'M' ? '700' : '500', color: formData.gender === 'M' ? '#1C2536' : '#9CA3AF', cursor: 'pointer' }}>남성</button>
                    <button type="button" onClick={() => setFormData({...formData, gender: 'F'})} style={{ flex: 1, borderRadius: '8px', border: formData.gender === 'F' ? '2px solid #1C2536' : '1px solid #E2DED5', background: formData.gender === 'F' ? '#F3F4F6' : '#FAFAFA', fontWeight: formData.gender === 'F' ? '700' : '500', color: formData.gender === 'F' ? '#1C2536' : '#9CA3AF', cursor: 'pointer' }}>여성</button>
                  </div>
                </div>
              </div>

              {/* 🚨 드롭다운 방식으로 변경된 글로벌 출생지 선택 */}
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}><label className="label-text">역법 (양/음력)</label>
                  <select className="input-field" onChange={(e) => setFormData({ ...formData, is_lunar: e.target.value.includes('lunar'), is_leap_month: e.target.value === 'lunar_leap' })} value={!formData.is_lunar ? 'solar' : formData.is_leap_month ? 'lunar_leap' : 'lunar'}>
                    <option value="solar">양력</option><option value="lunar">음력(평달)</option><option value="lunar_leap">음력(윤달)</option>
                  </select>
                </div>
                <div style={{ flex: 2 }}><label className="label-text">출생 국가/도시 (경도 자동반영)</label>
                  <select className="input-field" value={formData.birthPlace} onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}>
                    {GLOBAL_LOCATIONS.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: '1.2' }}><label className="label-text">생년월일</label><input type="date" className="input-field" required value={formatDate(formData.year, formData.month, formData.day)} onChange={(e) => {
                  if(!e.target.value) return; const [y, m, d] = e.target.value.split('-'); setFormData({...formData, year: parseInt(y), month: parseInt(m), day: parseInt(d)});
                }} /></div>
                <div style={{ flex: '1', opacity: isTimeUnknown ? 0.4 : 1, transition: 'opacity 0.3s' }}><label className="label-text">태어난 시간</label><input type="time" className="input-field" disabled={isTimeUnknown} value={formatTime(formData.hour, formData.minute)} onChange={(e) => {
                  if(!e.target.value) return; const [h, min] = e.target.value.split(':'); setFormData({...formData, hour: parseInt(h), minute: parseInt(min)});
                }} /></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', padding: '12px', backgroundColor: '#F9F8F6', borderRadius: '10px' }}>
                <label style={{ fontSize: '0.9em', color: '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                  <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#B59960' }} checked={isTimeUnknown} onChange={(e) => setIsTimeUnknown(e.target.checked)} /> 시간을 정확히 모릅니다
                </label>
                <button type="button" onClick={() => setShowRectifyModal(true)} style={{ padding: '8px 16px', backgroundColor: '#FFF', color: '#B59960', border: '1px solid #D4AF37', borderRadius: '8px', fontSize: '0.85em', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 5px rgba(212,175,55,0.1)' }}>🔮 생시 추론하기</button>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>{loading ? <><div className="spinner"></div> 명리-PRO 엔진 가동 중...</> : '명리-PRO 원국 분석하기'}</button>
            </form>

            {/* 결과 화면 (이하 코드 변동 없음 - 100% 원본 유지) */}
            {result && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="premium-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                  <div>
                    <div style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#0369A1', marginBottom: '4px', cursor: 'pointer' }} onClick={() => openModal("일진")}>📅 오늘의 운세 (일진)</div>
                    <div style={{ fontSize: '1.2em', fontWeight: '800', color: '#0F172A' }}>{result.iljin.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div onClick={() => openModal(result.iljin.ganji[0])} style={{ fontSize: '1.6em', fontWeight: '900', color: getElementColor(result.iljin.ganji[0]), cursor: 'pointer', lineHeight: '1.2' }}>{result.iljin.ganji[0]}</div>
                      <div onClick={() => openModal(result.iljin.sipseong[0])} style={{ fontSize: '0.75em', color: '#64748B', cursor: 'pointer' }}>{result.iljin.sipseong[0]}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div onClick={() => openModal(result.iljin.ganji[1])} style={{ fontSize: '1.6em', fontWeight: '900', color: result.iljin.is_gongmang ? '#EF4444' : getElementColor(result.iljin.ganji[1]), cursor: 'pointer', lineHeight: '1.2' }}>{result.iljin.ganji[1]}</div>
                      <div onClick={() => openModal(result.iljin.sipseong[1])} style={{ fontSize: '0.75em', color: '#64748B', cursor: 'pointer' }}>{result.iljin.sipseong[1]}</div>
                    </div>
                  </div>
                </div>

                <div className="premium-card">
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2em', color: '#1C2536', borderBottom: '2px solid #F0ECE1', paddingBottom: '10px' }}>
                    <span style={{ color: '#B59960' }}>{formData.name || '고객'}</span>님의 사주 원국표
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                    {['년주', '월주', '일주', '시주'].map((pillarKey) => {
                      const data = result.pillars[pillarKey]; const isUnknown = data.ganji[0] === '?';
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
                          {!isUnknown && (
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '10px', cursor: 'pointer' }} title="지장간">
                              <span style={{ fontSize: '0.65em', color: '#94A3B8' }} onClick={() => openModal("지장간")}>[</span>
                              {data.jijanggan?.map((gan, idx) => <span key={idx} onClick={() => openModal(gan)} style={{ fontSize: '0.75em', color: '#6B7280', fontWeight: '600' }}>{gan}</span>)}
                              <span style={{ fontSize: '0.65em', color: '#94A3B8' }} onClick={() => openModal("지장간")}>]</span>
                            </div>
                          )}
                          {!isUnknown && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', alignItems: 'center' }}>
                              {data.shipi && data.shipi !== "-" && <span onClick={() => openModal(data.shipi)} style={{ fontSize: '0.65em', padding: '3px 8px', backgroundColor: '#E0F2FE', color: '#1E3A8A', borderRadius: '4px', cursor: 'pointer' }}>{data.shipi}</span>}
                              {data.is_gongmang && <span onClick={() => openModal("공망")} style={{ fontSize: '0.65em', padding: '3px 8px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '4px', cursor: 'pointer' }}>공망</span>}
                              {data.sinsal.map((sal, idx) => {
                                let bg = '#F3F4F6', color = '#475569', border = '#E2E8F0';
                                if (sal.includes('대살') || sal.includes('괴강')) { bg = '#FFEBEE'; color = '#C62828'; border = '#FFCDD2'; }
                                else if (sal.includes('천을귀인')) { bg = '#FFF8E1'; color = '#F57F17'; border = '#FFECB3'; } 
                                return <span key={idx} onClick={() => openModal(sal)} style={{ fontSize: '0.65em', padding: '3px 8px', backgroundColor: bg, color: color, borderRadius: '4px', border: `1px solid ${border}`, cursor: 'pointer' }}>{sal}</span>;
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="premium-card">
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2em', color: '#1C2536' }}>📊 오행 밸런스 및 타고난 그릇</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
                    {Object.entries(result.elements_ratio).map(([element, ratio]) => (
                      <div key={element} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong onClick={() => openModal(element)} style={{ cursor: 'pointer', width: '20px', color: getElementColor(element) }}>{element}</strong>
                        <div style={{ flex: 1, backgroundColor: '#F1F5F9', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{ width: `${ratio}%`, backgroundColor: getElementColor(element), height: '100%', borderRadius: '5px', transition: 'width 0.8s ease' }}></div>
                        </div>
                        <span style={{ fontSize: '0.85em', color: '#64748B', width: '35px', textAlign: 'right' }}>{ratio}%</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ backgroundColor: '#FDFBFB', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#64748B' }}>타고난 그릇 (격국)</span>
                      <span style={{ fontSize: '1.2em', fontWeight: '800', color: '#D97706' }}>{result.gyeokguk.name}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95em', color: '#334155', lineHeight: '1.5' }}>{result.gyeokguk.description}</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ flex: '1 1 45%', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '15px' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95em', color: '#1E293B' }}>⚖️ 억부 용신 <span style={{ fontSize: '0.75em', color: '#64748B', fontWeight: 'normal' }}>(세력 밸런스)</span></h4>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ flex: 1, backgroundColor: '#F0FDF4', borderRadius: '8px', padding: '10px' }}>
                          <div style={{ fontSize: '0.75em', fontWeight: 'bold', color: '#166534', marginBottom: '5px' }}>용희신</div>
                          <div style={{ display: 'flex', gap: '5px' }}>{result.yongshin.yong_hee.map((el, i) => <span key={i} onClick={() => openModal(el)} style={{ cursor: 'pointer', fontWeight: 'bold', color: getElementColor(el), fontSize: '1.1em' }}>{el}</span>)}</div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#FEF2F2', borderRadius: '8px', padding: '10px' }}>
                          <div style={{ fontSize: '0.75em', fontWeight: 'bold', color: '#991B1B', marginBottom: '5px' }}>기구신</div>
                          <div style={{ display: 'flex', gap: '5px' }}>{result.yongshin.gi_gu.map((el, i) => <span key={i} onClick={() => openModal(el)} style={{ cursor: 'pointer', fontWeight: 'bold', color: getElementColor(el), fontSize: '1.1em' }}>{el}</span>)}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.85em', color: '#475569', lineHeight: '1.4' }}><strong onClick={() => openModal(result.yongshin.strength)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{result.yongshin.strength}</strong>: {result.yongshin.description}</div>
                    </div>
                    <div style={{ flex: '1 1 45%', backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '12px', padding: '15px' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95em', color: '#9A3412' }}>🌡️ 조후 용신 <span style={{ fontSize: '0.75em', color: '#FDBA74', fontWeight: 'normal' }}>(온도 밸런스)</span></h4>
                      <div style={{ backgroundColor: '#FFEDD5', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.75em', fontWeight: 'bold', color: '#9A3412', marginBottom: '5px' }}>조후 용희신</div>
                        <div style={{ display: 'flex', gap: '5px' }}>{result.johu.yong_hee.length > 0 ? (result.johu.yong_hee.map((el, i) => <span key={i} onClick={() => openModal(el)} style={{ cursor: 'pointer', fontWeight: 'bold', color: getElementColor(el), fontSize: '1.1em' }}>{el}</span>)) : (<span style={{ fontSize: '0.9em', color: '#EA580C' }}>산출 불가</span>)}</div>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85em', color: '#9A3412', lineHeight: '1.4' }}>{result.johu.description}</p>
                    </div>
                  </div>
                </div>

                <div className="premium-card">
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2em', color: '#1C2536', borderBottom: '2px solid #F0ECE1', paddingBottom: '10px' }}>📖 심층 스토리텔링</h3>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#B59960', fontSize: '1em' }}>타고난 성향과 에너지</h4>
                    <p style={{ margin: 0, fontSize: '0.95em', color: '#4B5563', lineHeight: '1.7' }}>{result.interpretation.five_elements_desc}</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#B59960', fontSize: '1em' }}>활동성과 직업/재물운</h4>
                    <p style={{ margin: 0, fontSize: '0.95em', color: '#4B5563', lineHeight: '1.7' }}>{result.interpretation.movement_luck} <br/><br/> {result.interpretation.job_wealth_desc}</p>
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

                <div className="premium-card">
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2em', color: '#1C2536' }}>⚡ 원국 내 상호작용 및 주의할 운세</h3>
                  <div style={{ marginBottom: '20px' }}>
                    {result.relations && result.relations.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {result.relations.map((rel, idx) => {
                          const isHaphwa = rel.type.includes('합화');
                          return (
                            <div key={idx} style={{ borderLeft: `4px solid ${isHaphwa ? '#8B5CF6' : rel.name.includes('합') ? '#10B981' : '#EF4444'}`, padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <strong onClick={() => openModal(rel.type)} style={{ fontSize: '0.95em', color: '#1E293B', cursor: 'pointer', textDecoration: 'underline' }}>{rel.name} <span style={{ fontSize: '0.8em', color: '#64748B', fontWeight: 'normal', textDecoration: 'none' }}>({rel.type})</span></strong>
                                <span style={{ fontSize: '0.85em', color: '#3B82F6', fontWeight: '700' }}>[{rel.positions.join(' ↔ ')}]</span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.9em', color: '#475569', lineHeight: '1.4' }}>{rel.description}</p>
                            </div>
                          )
                        })}
                      </div>
                    ) : (<p style={{ margin: 0, fontSize: '0.9em', color: '#9CA3AF' }}>뚜렷한 상호작용이 없습니다.</p>)}
                  </div>

                  {groupedDynamic.length > 0 && (
                    <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '12px', padding: '16px' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '1em', color: '#B45309', display: 'flex', alignItems: 'center', gap: '6px' }}>🔔 지금 주목해야 할 운세 변화</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {groupedDynamic.map((rel, idx) => {
                          const isHighlight = rel.un_types.includes('오늘 일진') || rel.un_types.includes('이달의 월운');
                          return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: isHighlight ? '#EFF6FF' : '#FFF', border: isHighlight ? '1px solid #BFDBFE' : '1px solid #FEF3C7', padding: '12px', borderRadius: '8px' }}>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span onClick={() => openModal(rel.type)} style={{ fontSize: '0.85em', fontWeight: 'bold', color: isHighlight ? '#0369A1' : '#92400E', cursor: 'pointer', textDecoration: 'underline' }}>{rel.name}</span>
                                <span style={{ fontSize: '0.7em', padding: '3px 8px', backgroundColor: isHighlight ? '#DBEAFE' : '#FEF3C7', color: isHighlight ? '#1D4ED8' : '#B45309', borderRadius: '4px' }}>{rel.un_types.join(' & ')}</span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.9em', color: '#451A03', lineHeight: '1.4' }}><strong style={{ color: isHighlight ? '#0284C7' : '#D97706' }}>[{rel.target_pillar}]</strong> {rel.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="premium-card">
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2em', color: '#1C2536' }}>🛤️ 운명의 흐름 (대/세/월운)</h3>
                  {result.wolun && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '1em', color: '#4B5563' }}>🌙 이달의 운세 (올해의 월운)</h4>
                      <div className="horizontal-scroll">
                        {result.wolun.map((wun, idx) => (
                          <div key={idx} style={{ minWidth: '65px', padding: '12px 4px', border: wun.is_current ? '2px solid #8B5CF6' : '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center', backgroundColor: wun.is_current ? '#F5F3FF' : '#FFF' }}>
                            <div style={{ fontSize: '0.75em', color: '#64748B', marginBottom: '6px', fontWeight: wun.is_current ? 'bold' : 'normal' }}>{wun.month}월</div>
                            <div onClick={() => openModal(wun.ganji[0])} style={{ fontSize: '1.2em', fontWeight: 'bold', color: getElementColor(wun.ganji[0]), cursor: 'pointer' }}>{wun.ganji[0]}</div>
                            <div onClick={() => openModal(wun.ganji[1])} style={{ fontSize: '1.2em', fontWeight: 'bold', color: wun.is_gongmang ? '#EF4444' : getElementColor(wun.ganji[1]), cursor: 'pointer', marginBottom: '4px' }}>{wun.ganji[1]}</div>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '6px' }}>{wun.jijanggan?.map((gan, i) => <span key={i} onClick={() => openModal(gan)} style={{ fontSize: '0.65em', color: '#9CA3AF', cursor: 'pointer' }}>{gan}</span>)}</div>
                            <div onClick={() => openModal(wun.shipi)} style={{ fontSize: '0.7em', color: '#6B7280', cursor: 'pointer' }}>{wun.shipi}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1em', color: '#4B5563' }}>📅 1년 단위 현실 (세운)</h4>
                    <div className="horizontal-scroll">
                      {result.seun.map((wun, idx) => {
                        const isCurrent = wun.year === currentYear;
                        return (
                          <div key={idx} style={{ minWidth: '65px', padding: '12px 4px', border: isCurrent ? '2px solid #10B981' : '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center', backgroundColor: isCurrent ? '#ECFDF5' : '#FFF' }}>
                            <div style={{ fontSize: '0.75em', color: '#64748B', marginBottom: '2px' }}>{wun.year}</div>
                            <div style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#EF4444', marginBottom: '6px' }}>{wun.age}세</div>
                            <div onClick={() => openModal(wun.ganji[0])} style={{ fontSize: '1.2em', fontWeight: 'bold', color: getElementColor(wun.ganji[0]), cursor: 'pointer' }}>{wun.ganji[0]}</div>
                            <div onClick={() => openModal(wun.ganji[1])} style={{ fontSize: '1.2em', fontWeight: 'bold', color: wun.is_gongmang ? '#EF4444' : getElementColor(wun.ganji[1]), cursor: 'pointer', marginBottom: '4px' }}>{wun.ganji[1]}</div>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '6px' }}>{wun.jijanggan?.map((gan, i) => <span key={i} onClick={() => openModal(gan)} style={{ fontSize: '0.65em', color: '#9CA3AF', cursor: 'pointer' }}>{gan}</span>)}</div>
                            <div onClick={() => openModal(wun.shipi)} style={{ fontSize: '0.7em', color: '#6B7280', cursor: 'pointer' }}>{wun.shipi}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, fontSize: '1em', color: '#4B5563' }}>🛤️ 10년 단위 큰 환경 (대운)</h4>
                      <span style={{ fontSize: '0.75em', color: '#6366F1', cursor: 'pointer' }} onClick={() => openModal("교운기")}>💡 교운기란?</span>
                    </div>
                    <div className="horizontal-scroll">
                      {result.daewun.map((wun, idx) => {
                        const isCurrent = result.seun.find(s => s.year === currentYear)?.age >= wun.age && result.seun.find(s => s.year === currentYear)?.age < wun.age + 10;
                        return (
                          <div key={idx} style={{ minWidth: '70px', padding: '12px 4px', border: isCurrent ? '2px solid #3B82F6' : '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center', backgroundColor: isCurrent ? '#EFF6FF' : '#FFF', opacity: wun.age > 90 ? 0.6 : 1 }}>
                            <div style={{ fontSize: '0.85em', fontWeight: 'bold', color: isCurrent ? '#1D4ED8' : '#EF4444', marginBottom: '6px' }}>{wun.age}세</div>
                            <div onClick={() => openModal(wun.ganji[0])} style={{ fontSize: '1.2em', fontWeight: 'bold', color: getElementColor(wun.ganji[0]), cursor: 'pointer' }}>{wun.ganji[0]}</div>
                            <div onClick={() => openModal(wun.ganji[1])} style={{ fontSize: '1.2em', fontWeight: 'bold', color: wun.is_gongmang ? '#EF4444' : getElementColor(wun.ganji[1]), cursor: 'pointer', marginBottom: '4px' }}>{wun.ganji[1]}</div>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '6px' }}>{wun.jijanggan?.map((gan, i) => <span key={i} onClick={() => openModal(gan)} style={{ fontSize: '0.65em', color: '#9CA3AF', cursor: 'pointer' }}>{gan}</span>)}</div>
                            <div onClick={() => openModal(wun.shipi)} style={{ fontSize: '0.7em', color: '#6B7280', cursor: 'pointer', marginBottom: '8px' }}>{wun.shipi}</div>
                            <div style={{ fontSize: '0.65em', color: '#4338CA', backgroundColor: '#E0E7FF', padding: '4px', borderRadius: '4px' }} title="대운 진입(교운기) 날짜">{wun.start_date.substring(2)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ========================================================
            [2] 궁합 보기 탭
        ======================================================== */}
        {activeTab === 'gunghap' && (
          <div className="fade-in">
            <form onSubmit={handleGunghapSubmit} className="premium-card">
              <div style={{ backgroundColor: '#F9F8F6', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #EFECE6' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#1C2536', fontSize: '1.1em' }}>👤 나의 정보</h4>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}><label className="label-text">이름 (닉네임)</label><input type="text" className="input-field" placeholder="내 이름" name="name" value={gunghapData.me.name} onChange={(e) => handleGunghapChange('me', e)} /></div>
                  <div style={{ flex: 1 }}><label className="label-text">성별</label><select className="input-field" name="gender" value={gunghapData.me.gender} onChange={(e) => handleGunghapChange('me', e)}><option value="M">남성</option><option value="F">여성</option></select></div>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}><label className="label-text">역법 (양/음력)</label>
                    <select className="input-field" onChange={(e) => { const val = e.target.value; setGunghapData(prev => ({...prev, me: {...prev.me, is_lunar: val.includes('lunar'), is_leap_month: val === 'lunar_leap'}})) }} value={!gunghapData.me.is_lunar ? 'solar' : gunghapData.me.is_leap_month ? 'lunar_leap' : 'lunar'}>
                      <option value="solar">양력</option><option value="lunar">음력(평달)</option><option value="lunar_leap">음력(윤달)</option>
                    </select>
                  </div>
                  <div style={{ flex: 2 }}><label className="label-text">출생 국가/도시 (경도)</label>
                    <select className="input-field" value={gunghapData.me.birthPlace} onChange={(e) => setGunghapData(prev => ({...prev, me: {...prev.me, birthPlace: e.target.value}}))}>
                      {GLOBAL_LOCATIONS.map(loc => ( <option key={loc.id} value={loc.id}>{loc.label}</option> ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: '1.2' }}><label className="label-text">생년월일</label><input type="date" className="input-field" value={formatDate(gunghapData.me.year, gunghapData.me.month, gunghapData.me.day)} onChange={(e) => { if(!e.target.value) return; const [y, m, d] = e.target.value.split('-'); setGunghapData(prev => ({...prev, me: {...prev.me, year: parseInt(y), month: parseInt(m), day: parseInt(d)}})); }} /></div>
                  <div style={{ flex: 1, opacity: gunghapData.me.is_time_unknown ? 0.4 : 1 }}><label className="label-text">태어난 시간</label><input type="time" className="input-field" disabled={gunghapData.me.is_time_unknown} value={formatTime(gunghapData.me.hour, gunghapData.me.minute)} onChange={(e) => { if(!e.target.value) return; const [h, min] = e.target.value.split(':'); setGunghapData(prev => ({...prev, me: {...prev.me, hour: parseInt(h), minute: parseInt(min)}})); }} /></div>
                </div>
                <div style={{ textAlign: 'right' }}><label style={{ fontSize: '0.85em', color: '#4B5563', cursor: 'pointer', fontWeight: '500' }}><input type="checkbox" name="is_time_unknown" checked={gunghapData.me.is_time_unknown} onChange={(e) => handleGunghapChange('me', e)} style={{ accentColor: '#B59960' }} /> 시간을 정확히 모름</label></div>
              </div>

              <div style={{ backgroundColor: '#FFF5F7', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #FCE7F3' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#BE185D', fontSize: '1.1em' }}>💖 상대방 정보</h4>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}><label className="label-text">이름 (닉네임)</label><input type="text" className="input-field" style={{ borderColor: '#FBCFE8' }} placeholder="상대방 이름" name="name" value={gunghapData.partner.name} onChange={(e) => handleGunghapChange('partner', e)} /></div>
                  <div style={{ flex: 1 }}><label className="label-text">성별</label><select className="input-field" style={{ borderColor: '#FBCFE8' }} name="gender" value={gunghapData.partner.gender} onChange={(e) => handleGunghapChange('partner', e)}><option value="F">여성</option><option value="M">남성</option></select></div>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}><label className="label-text">역법 (양/음력)</label>
                    <select className="input-field" style={{ borderColor: '#FBCFE8' }} onChange={(e) => { const val = e.target.value; setGunghapData(prev => ({...prev, partner: {...prev.partner, is_lunar: val.includes('lunar'), is_leap_month: val === 'lunar_leap'}})) }} value={!gunghapData.partner.is_lunar ? 'solar' : gunghapData.partner.is_leap_month ? 'lunar_leap' : 'lunar'}>
                      <option value="solar">양력</option><option value="lunar">음력(평달)</option><option value="lunar_leap">음력(윤달)</option>
                    </select>
                  </div>
                  <div style={{ flex: 2 }}><label className="label-text">출생 국가/도시 (경도)</label>
                    <select className="input-field" style={{ borderColor: '#FBCFE8' }} value={gunghapData.partner.birthPlace} onChange={(e) => setGunghapData(prev => ({...prev, partner: {...prev.partner, birthPlace: e.target.value}}))}>
                      {GLOBAL_LOCATIONS.map(loc => ( <option key={loc.id} value={loc.id}>{loc.label}</option> ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: '1.2' }}><label className="label-text">생년월일</label><input type="date" className="input-field" style={{ borderColor: '#FBCFE8' }} value={formatDate(gunghapData.partner.year, gunghapData.partner.month, gunghapData.partner.day)} onChange={(e) => { if(!e.target.value) return; const [y, m, d] = e.target.value.split('-'); setGunghapData(prev => ({...prev, partner: {...prev.partner, year: parseInt(y), month: parseInt(m), day: parseInt(d)}})); }} /></div>
                  <div style={{ flex: 1, opacity: gunghapData.partner.is_time_unknown ? 0.4 : 1 }}><label className="label-text">태어난 시간</label><input type="time" className="input-field" style={{ borderColor: '#FBCFE8' }} disabled={gunghapData.partner.is_time_unknown} value={formatTime(gunghapData.partner.hour, gunghapData.partner.minute)} onChange={(e) => { if(!e.target.value) return; const [h, min] = e.target.value.split('-'); setGunghapData(prev => ({...prev, partner: {...prev.partner, hour: parseInt(h), minute: parseInt(min)}})); }} /></div>
                </div>
                <div style={{ textAlign: 'right' }}><label style={{ fontSize: '0.85em', color: '#BE185D', cursor: 'pointer', fontWeight: '500' }}><input type="checkbox" name="is_time_unknown" checked={gunghapData.partner.is_time_unknown} onChange={(e) => handleGunghapChange('partner', e)} style={{ accentColor: '#BE185D' }} /> 시간을 정확히 모름</label></div>
              </div>

              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #BE185D 0%, #9D174D 100%)', color: '#FFF' }} disabled={loading}>{loading ? <><div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#FFF' }}></div> 명리-PRO 궁합 분석 중...</> : '명리-PRO 궁합 확인'}</button>
            </form>

            {gunghapResult && (
              <div className="fade-in premium-card" style={{ textAlign: 'center', borderColor: '#FCE7F3', boxShadow: '0 10px 30px rgba(190,24,93,0.05)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#831843', fontSize: '1.3em' }}>두 사람의 찰떡 궁합도는?</h3>
                <div style={{ fontSize: '5em', fontWeight: '900', color: '#DB2777', textShadow: '2px 2px 0px #FDF2F8' }}>{gunghapResult.score}<span style={{ fontSize: '0.4em', color: '#F472B6' }}>점</span></div>
                <div style={{ marginTop: '20px', backgroundColor: '#FDF2F8', padding: '20px', borderRadius: '12px', color: '#9D174D', fontWeight: '600', lineHeight: '1.6' }}>"{gunghapResult.summary}"</div>
                <div style={{ marginTop: '25px', textAlign: 'left', borderTop: '1px solid #FBCFE8', paddingTop: '20px' }}>
                  <div style={{ marginBottom: '15px' }}><h4 style={{ margin: '0 0 8px 0', color: '#9D174D', fontSize: '1.05em' }}>☯️ 오행 조화</h4><p style={{ margin: 0, fontSize: '0.9em', color: '#4B5563', lineHeight: '1.6' }}>{gunghapResult.element_complement}</p></div>
                  <div style={{ marginBottom: '15px' }}><h4 style={{ margin: '0 0 8px 0', color: '#9D174D', fontSize: '1.05em' }}>🧠 마음의 끌림 (천간)</h4><p style={{ margin: 0, fontSize: '0.9em', color: '#4B5563', lineHeight: '1.6' }}>{gunghapResult.heavenly_desc}</p></div>
                  <div><h4 style={{ margin: '0 0 8px 0', color: '#9D174D', fontSize: '1.05em' }}>🏡 현실과 속궁합 (지지)</h4><p style={{ margin: 0, fontSize: '0.9em', color: '#4B5563', lineHeight: '1.6' }}>{gunghapResult.earthly_desc}</p></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🔮 생시 역추적 모달 */}
      {showRectifyModal && (
        <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '20px', maxWidth: '400px', width: '100%' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#B59960', fontSize: '1.3em' }}>🔮 생시 추론 시스템</h3>
            <p style={{ margin: '0 0 25px 0', fontSize: '0.95em', color: '#6B7280', lineHeight: '1.5' }}>성향과 에너지 사이클을 분석하여 가장 확률이 높은 태어난 시간을 찾아냅니다.</p>
            <div style={{ marginBottom: '20px' }}>
              <label className="label-text" style={{ color: '#1C2536' }}>Q1. 당신의 핵심 성향은?</label>
              <select value={rectifyData.q1} onChange={(e) => setRectifyData({...rectifyData, q1: e.target.value})} className="input-field">
                <option value="A">독립적이고 주관이 뚜렷하다</option><option value="B">창의적이고 표현하기를 좋아한다</option><option value="C">현실적이고 결과/재물을 중시한다</option><option value="D">원칙과 명예, 책임감을 중시한다</option><option value="E">직관력이 뛰어나고 생각이 깊다</option>
              </select>
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label className="label-text" style={{ color: '#1C2536' }}>Q2. 하루 중 가장 에너지가 넘치는 시간은?</label>
              <select value={rectifyData.q2} onChange={(e) => setRectifyData({...rectifyData, q2: e.target.value})} className="input-field">
                <option value="A">새벽 ~ 아침 (03시 ~ 09시)</option><option value="B">낮 ~ 늦은 오후 (09시 ~ 15시)</option><option value="C">해 질 녘 ~ 초저녁 (15시 ~ 21시)</option><option value="D">늦은 밤 ~ 심야 (21시 ~ 03시)</option>
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