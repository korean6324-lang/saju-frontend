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
  if (['목','갑','을','인','묘'].includes(text)) return '#10b981'; 
  if (['화','병','정','사','오'].includes(text)) return '#ef4444'; 
  if (['토','무','기','진','술','축','미'].includes(text)) return '#f59e0b'; 
  if (['금','경','신','유'].includes(text)) return '#94a3b8'; 
  if (['수','임','계','자','해'].includes(text)) return '#3b82f6'; 
  if (text === '?') return '#cbd5e1'; 
  return '#333';
};

export default function SajuCalculator() {
  const [activeTab, setActiveTab] = useState('saju'); // 'saju' or 'gunghap'

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
    setLoading(true); 
    setError(''); 
    setResult(null);
    try {
      const response = await axios.post('hhttps://saju-backend-ffum.onrender.com/api/saju', { ...formData, is_time_unknown: isTimeUnknown });
      setResult(response.data);
    } catch (err) { 
      setError(err.response?.data?.detail || '서버 연결 에러가 발생했습니다.'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleGunghapSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError(''); 
    setGunghapResult(null);
    try {
      const response = await axios.post('https://saju-backend-ffum.onrender.com/api/saju', gunghapData);
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
      const response = await axios.post('https://saju-backend-ffum.onrender.com/api/saju', payload);
      setFormData(prev => ({ ...prev, hour: response.data.estimated_hour, minute: 30 }));
      setIsTimeUnknown(false); 
      setShowRectifyModal(false);
      alert(`🔮 역산 결과: ${response.data.estimated_pillar}시로 추정되었습니다.\n\n${response.data.reason}\n\n입력창에 시간이 자동 적용되었습니다. '사주 분석하기'를 눌러주세요.`);
    } catch (err) { 
      alert("생시 역산 중 오류가 발생했습니다."); 
    } finally { 
      setLoading(false); 
    }
  };

  const openModal = (keyword) => {
    if (!keyword) return;
    let lookupKeyword = keyword.includes('합화') ? '천간합화(合化)' : keyword.includes('천간합') ? '천간합(기반)' : keyword;
    if (TERMS_DICT[lookupKeyword]) {
      setModalInfo({ title: lookupKeyword, desc: TERMS_DICT[lookupKeyword] });
    } else {
      setModalInfo({ title: keyword, desc: "명리학적 상호작용 기운입니다. (해당 단어의 상세 사전 데이터가 준비 중입니다.)" });
    }
  };

  const groupedDynamic = result?.dynamic_relations ? Object.values(result.dynamic_relations.reduce((acc, rel) => {
    const key = `${rel.name}_${rel.target_pillar}`;
    if (!acc[key]) acc[key] = { ...rel, un_types: [rel.un_type] };
    else if (!acc[key].un_types.includes(rel.un_type)) acc[key].un_types.push(rel.un_type);
    return acc;
  }, {})) : [];

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '20px', fontFamily: "'Pretendard', sans-serif", color: '#1e293b' }}>
      
      {/* 🌟 헤더 및 탭 전환 */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '1.8em', color: '#0f172a', fontWeight: '800' }}>초정밀 사주 엔진 PRO</h2>
        <p style={{ margin: '5px 0 20px', color: '#64748b', fontSize: '0.9em' }}>직업 재물 통변 & 파트너 궁합 분석</p>
        
        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '12px', padding: '5px', gap: '5px' }}>
          <button 
            onClick={() => {setActiveTab('saju'); setError('');}} 
            style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'saju' ? '#ffffff' : 'transparent', color: activeTab === 'saju' ? '#0f172a' : '#64748b', boxShadow: activeTab === 'saju' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
          >
            👤 개인 사주 분석
          </button>
          <button 
            onClick={() => {setActiveTab('gunghap'); setError('');}} 
            style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'gunghap' ? '#ffffff' : 'transparent', color: activeTab === 'gunghap' ? '#ec4899' : '#64748b', boxShadow: activeTab === 'gunghap' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
          >
            💑 궁합 보기
          </button>
        </div>
      </div>

      {error && <div style={{ padding: '12px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

      {/* ===================== [1. 개인 사주 탭 영역] ===================== */}
      {activeTab === 'saju' && (
        <>
          <form onSubmit={handleSajuSubmit} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '30px' }}>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: '1 1 45%', display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                <span style={{ fontWeight: '600', marginRight: '15px', fontSize: '0.9em' }}>성별</span>
                <label style={{ marginRight: '10px', fontSize: '0.9em', cursor: 'pointer' }}>
                  <input type="radio" name="gender" value="M" checked={formData.gender === 'M'} onChange={(e)=>setFormData({...formData, gender: e.target.value})} /> 남
                </label>
                <label style={{ fontSize: '0.9em', cursor: 'pointer' }}>
                  <input type="radio" name="gender" value="F" checked={formData.gender === 'F'} onChange={(e)=>setFormData({...formData, gender: e.target.value})} /> 여
                </label>
              </div>
              <div style={{ flex: '1 1 45%', display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                <span style={{ fontWeight: '600', marginRight: '15px', fontSize: '0.9em' }}>역법</span>
                <select 
                  style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9em', flex: 1 }} 
                  onChange={(e) => setFormData({ ...formData, is_lunar: e.target.value.includes('lunar'), is_leap_month: e.target.value === 'lunar_leap' })} 
                  value={!formData.is_lunar ? 'solar' : formData.is_leap_month ? 'lunar_leap' : 'lunar'}
                >
                  <option value="solar">양력</option>
                  <option value="lunar">음력 (평달)</option>
                  <option value="lunar_leap">음력 (윤달)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {['year', 'month', 'day'].map(field => (
                <div key={field} style={{ flex: '1 1 15%', minWidth: '60px', display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.75em', color: '#64748b', marginBottom: '4px' }}>
                    {field === 'year' ? '년' : field === 'month' ? '월' : '일'}
                  </label>
                  <input type="number" name={field} value={formData[field]} onChange={(e) => setFormData({...formData, [field]: parseInt(e.target.value)||0})} required style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95em', textAlign: 'center', width: '100%', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ flex: '1 1 15%', minWidth: '60px', display: 'flex', flexDirection: 'column', opacity: isTimeUnknown ? 0.4 : 1 }}>
                <label style={{ fontSize: '0.75em', color: '#64748b', marginBottom: '4px' }}>시</label>
                <input type="number" name="hour" value={formData.hour} onChange={(e) => setFormData({...formData, hour: parseInt(e.target.value)||0})} disabled={isTimeUnknown} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95em', textAlign: 'center', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: '1 1 15%', minWidth: '60px', display: 'flex', flexDirection: 'column', opacity: isTimeUnknown ? 0.4 : 1 }}>
                <label style={{ fontSize: '0.75em', color: '#64748b', marginBottom: '4px' }}>분</label>
                <input type="number" name="minute" value={formData.minute} onChange={(e) => setFormData({...formData, minute: parseInt(e.target.value)||0})} disabled={isTimeUnknown} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95em', textAlign: 'center', width: '100%', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setShowRectifyModal(true)} style={{ padding: '8px 12px', backgroundColor: '#ede9fe', color: '#6d28d9', border: '1px solid #c4b5fd', borderRadius: '6px', fontSize: '0.85em', fontWeight: 'bold', cursor: 'pointer' }}>🔮 생시 역추적하기</button>
              <label style={{ fontSize: '0.85em', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="checkbox" checked={isTimeUnknown} onChange={(e) => setIsTimeUnknown(e.target.checked)} /> 시간 모름
              </label>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', marginTop: '15px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1em', fontWeight: '600' }}>
              {loading ? '운명 분석 중...' : '개인 사주 분석하기'}
            </button>
          </form>

          {/* 개인 사주 분석 결과 렌더링 */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* 일진 */}
              <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#0369a1', marginBottom: '4px', cursor: 'pointer' }} onClick={() => openModal("일진")}>📅 오늘의 운세 (일진)</div>
                  <div style={{ fontSize: '1.2em', fontWeight: '800', color: '#0f172a' }}>{result.iljin.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div onClick={() => openModal(result.iljin.ganji[0])} style={{ fontSize: '1.6em', fontWeight: '900', color: getElementColor(result.iljin.ganji[0]), cursor: 'pointer', lineHeight: '1.2' }}>{result.iljin.ganji[0]}</div>
                    <div onClick={() => openModal(result.iljin.sipseong[0])} style={{ fontSize: '0.75em', color: '#64748b', cursor: 'pointer' }}>{result.iljin.sipseong[0]}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div onClick={() => openModal(result.iljin.ganji[1])} style={{ fontSize: '1.6em', fontWeight: '900', color: result.iljin.is_gongmang ? '#ef4444' : getElementColor(result.iljin.ganji[1]), cursor: 'pointer', lineHeight: '1.2' }}>{result.iljin.ganji[1]}</div>
                    <div onClick={() => openModal(result.iljin.sipseong[1])} style={{ fontSize: '0.75em', color: '#64748b', cursor: 'pointer' }}>{result.iljin.sipseong[1]}</div>
                  </div>
                </div>
              </div>

              {/* 격국 및 용신 블록 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#64748b' }}>타고난 그릇 (격국)</span>
                    <span style={{ fontSize: '1.2em', fontWeight: '800', color: '#d97706' }}>{result.gyeokguk.name}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95em', color: '#334155', lineHeight: '1.5' }}>{result.gyeokguk.description}</p>
                </div>

                {/* 특수 용신 (병약/통관) UI */}
                {result.yongshin.special_type && (
                  <div style={{ backgroundColor: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.1em' }}>🚨</span>
                      <span style={{ fontSize: '0.95em', fontWeight: 'bold', color: '#6d28d9', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => openModal(result.yongshin.special_type)}>
                        {result.yongshin.special_type} 발견!
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85em', color: '#4c1d95', lineHeight: '1.4' }}>{result.yongshin.special_desc}</p>
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                  {/* 억부 용신 */}
                  <div style={{ flex: '1 1 45%', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95em', color: '#1e293b' }}>⚖️ 억부 용신 <span style={{ fontSize: '0.75em', color: '#64748b', fontWeight: 'normal' }}>(세력 밸런스)</span></h4>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ flex: 1, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '0.75em', fontWeight: 'bold', color: '#166534', marginBottom: '5px' }}>용희신</div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {result.yongshin.yong_hee.map((el, i) => <span key={i} onClick={() => openModal(el)} style={{ cursor: 'pointer', fontWeight: 'bold', color: getElementColor(el), fontSize: '1.1em' }}>{el}</span>)}
                        </div>
                      </div>
                      <div style={{ flex: 1, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '0.75em', fontWeight: 'bold', color: '#991b1b', marginBottom: '5px' }}>기구신</div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {result.yongshin.gi_gu.map((el, i) => <span key={i} onClick={() => openModal(el)} style={{ cursor: 'pointer', fontWeight: 'bold', color: getElementColor(el), fontSize: '1.1em' }}>{el}</span>)}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85em', color: '#475569', lineHeight: '1.4' }}>
                      <strong onClick={() => openModal(result.yongshin.strength)} style={{ cursor: 'pointer', textDecoration: 'underline', color: '#1e293b' }}>{result.yongshin.strength}</strong>: {result.yongshin.description}
                    </div>
                  </div>
                  
                  {/* 조후 용신 */}
                  <div style={{ flex: '1 1 45%', backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', padding: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95em', color: '#9a3412' }}>🌡️ 조후 용신 <span style={{ fontSize: '0.75em', color: '#fdba74', fontWeight: 'normal' }}>(온도 밸런스)</span></h4>
                    <div style={{ backgroundColor: '#ffedd5', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.75em', fontWeight: 'bold', color: '#9a3412', marginBottom: '5px' }}>조후 용희신</div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {result.johu.yong_hee.length > 0 ? (
                          result.johu.yong_hee.map((el, i) => <span key={i} onClick={() => openModal(el)} style={{ cursor: 'pointer', fontWeight: 'bold', color: getElementColor(el), fontSize: '1.1em' }}>{el}</span>)
                        ) : (<span style={{ fontSize: '0.9em', color: '#ea580c' }}>산출 불가</span>)}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85em', color: '#9a3412', lineHeight: '1.4' }}>{result.johu.description}</p>
                  </div>
                </div>
              </div>

              {/* 맞춤 개운법 */}
              <div style={{ background: 'linear-gradient(to right, #ecfdf5, #f0fdfa)', padding: '20px', borderRadius: '12px', border: '1px solid #a7f3d0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1em', display: 'flex', alignItems: 'center', gap: '8px', color: '#047857' }}>
                  <span style={{ fontSize: '1.2em' }}>🍀</span> 나만의 맞춤 개운법 (행운 팁)
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 30%', backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #d1fae5', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75em', color: '#059669', fontWeight: 'bold', marginBottom: '5px' }}>행운의 컬러 🎨</div>
                    <div style={{ fontSize: '0.95em', color: '#064e3b', fontWeight: 'bold' }}>{result.interpretation.lucky_color}</div>
                  </div>
                  <div style={{ flex: '1 1 30%', backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #d1fae5', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75em', color: '#059669', fontWeight: 'bold', marginBottom: '5px' }}>행운의 방향 🧭</div>
                    <div style={{ fontSize: '0.95em', color: '#064e3b', fontWeight: 'bold' }}>{result.interpretation.lucky_direction}</div>
                  </div>
                  <div style={{ flex: '1 1 100%', backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #d1fae5' }}>
                    <div style={{ fontSize: '0.75em', color: '#059669', fontWeight: 'bold', marginBottom: '5px' }}>추천하는 행동 & 아이템 ✨</div>
                    <div style={{ fontSize: '0.95em', color: '#064e3b', fontWeight: '500' }}>{result.interpretation.lucky_item}</div>
                  </div>
                </div>
              </div>

              {/* 사주 팔자(원국) */}
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1em', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '1.2em' }}>📌</span> 사주 팔자 (원국)</h3>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                  {['년주', '월주', '일주', '시주'].map((pillarKey) => {
                    const data = result.pillars[pillarKey];
                    const isUnknown = data.ganji[0] === '?';
                    return (
                      <div key={pillarKey} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f8fafc', padding: '15px 5px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '0.75em', color: '#94a3b8', fontWeight: 'bold', marginBottom: '8px' }}>{pillarKey}</div>
                        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                          <div onClick={() => !isUnknown && openModal(data.ganji[0])} style={{ fontSize: '1.8em', fontWeight: '900', color: getElementColor(data.ganji[0]), cursor: isUnknown ? 'default' : 'pointer', lineHeight: '1' }}>{data.ganji[0]}</div>
                          <div onClick={() => !isUnknown && openModal(data.sipseong[0])} style={{ fontSize: '0.75em', color: '#64748b', cursor: isUnknown ? 'default' : 'pointer', marginTop: '4px' }}>{data.sipseong[0]}</div>
                        </div>
                        <div style={{ width: '30px', height: '1px', backgroundColor: '#e2e8f0', margin: '5px 0 10px 0' }} />
                        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                          <div onClick={() => !isUnknown && openModal(data.ganji[1])} style={{ fontSize: '1.8em', fontWeight: '900', color: data.is_gongmang ? '#ef4444' : getElementColor(data.ganji[1]), cursor: isUnknown ? 'default' : 'pointer', lineHeight: '1' }}>{data.ganji[1]}</div>
                          <div onClick={() => !isUnknown && openModal(data.sipseong[1])} style={{ fontSize: '0.75em', color: '#64748b', cursor: isUnknown ? 'default' : 'pointer', marginTop: '4px' }}>{data.sipseong[1]}</div>
                        </div>
                        {!isUnknown && (
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '10px', cursor: 'pointer' }} title="지장간">
                            <span style={{ fontSize: '0.65em', color: '#94a3b8' }} onClick={() => openModal("지장간")}>[</span>
                            {data.jijanggan?.map((gan, idx) => <span key={idx} onClick={() => openModal(gan)} style={{ fontSize: '0.75em', color: '#64748b', fontWeight: '500' }}>{gan}</span>)}
                            <span style={{ fontSize: '0.65em', color: '#94a3b8' }} onClick={() => openModal("지장간")}>]</span>
                          </div>
                        )}
                        {!isUnknown && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', alignItems: 'center' }}>
                            {data.shipi && data.shipi !== "-" && <span onClick={() => openModal(data.shipi)} style={{ fontSize: '0.65em', padding: '2px 6px', backgroundColor: '#e0f2fe', color: '#1e3a8a', borderRadius: '4px', cursor: 'pointer', width: 'max-content' }}>{data.shipi}</span>}
                            {data.is_gongmang && <span onClick={() => openModal("공망")} style={{ fontSize: '0.65em', padding: '2px 6px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', cursor: 'pointer', width: 'max-content' }}>공망</span>}
                            {data.sinsal.map((sal, idx) => {
                              let bg = '#f3f4f6', color = '#475569', border = '#e2e8f0';
                              if (sal.includes('대살') || sal.includes('괴강')) { bg = '#ffebee'; color = '#c62828'; border = '#ffcdd2'; }
                              else if (sal.includes('천을귀인')) { bg = '#fff8e1'; color = '#f57f17'; border = '#ffecb3'; } 
                              else if (sal.includes('홍염')) { bg = '#fce4ec'; color = '#c2185b'; border = '#f8bbd0'; } 
                              return <span key={idx} onClick={() => openModal(sal)} style={{ fontSize: '0.65em', padding: '2px 6px', backgroundColor: bg, color: color, borderRadius: '4px', border: `1px solid ${border}`, cursor: 'pointer', width: 'max-content', textAlign: 'center' }}>{sal}</span>;
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 오행 분포도 */}
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1em', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '1.2em' }}>📊</span> 오행 분포도</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(result.elements_ratio).map(([element, ratio]) => (
                    <div key={element} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong onClick={() => openModal(element)} style={{ cursor: 'pointer', width: '20px', color: getElementColor(element) }}>{element}</strong>
                      <div style={{ flex: 1, backgroundColor: '#f1f5f9', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${ratio}%`, backgroundColor: getElementColor(element), height: '100%', borderRadius: '5px', transition: 'width 0.5s ease-in-out' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85em', color: '#64748b', width: '35px', textAlign: 'right' }}>{ratio}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 스토리텔링 */}
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2em' }}>📖</span> 사주 심층 스토리텔링
                </h3>
                <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '0.95em' }}>🔹 타고난 오행의 기운</h4>
                  <p style={{ lineHeight: '1.6', margin: '0 0 15px 0', fontSize: '0.9em', color: '#475569' }}>{result.interpretation.five_elements_desc}</p>
                  
                  <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '0.95em' }}>🔹 활동성과 이동 (역마)</h4>
                  <p style={{ lineHeight: '1.6', margin: '0 0 15px 0', fontSize: '0.9em', color: '#475569' }}>{result.interpretation.movement_luck}</p>

                  <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '0.95em' }}>💼 직업 및 재물운 분석</h4>
                  <p style={{ lineHeight: '1.6', margin: 0, fontSize: '0.9em', color: '#475569' }}>{result.interpretation.job_wealth_desc}</p>
                </div>

                <h4 style={{ margin: '5px 0 5px 0', fontSize: '1em', color: '#334155' }}>⚡ 원국 내 상호작용 (합화/기반 정밀 판별)</h4>
                {result.relations && result.relations.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.relations.map((rel, idx) => {
                      const isHaphwa = rel.type.includes('합화');
                      return (
                        <div key={idx} style={{ borderLeft: `3px solid ${isHaphwa ? '#8b5cf6' : rel.name.includes('합') ? '#10b981' : '#ef4444'}`, padding: '10px 12px', backgroundColor: isHaphwa ? '#f5f3ff' : '#f8fafc', borderRadius: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <strong onClick={() => openModal(rel.type)} style={{ fontSize: '0.95em', color: isHaphwa ? '#5b21b6' : '#1e293b', cursor: 'pointer', textDecoration: 'underline' }}>
                              {rel.name} <span style={{ fontSize: '0.8em', color: '#64748b', fontWeight: 'normal', textDecoration: 'none' }}>({rel.type})</span>
                            </strong>
                            <span style={{ fontSize: '0.85em', color: '#3b82f6', fontWeight: '600' }}>[{rel.positions.join(' ↔ ')}]</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.85em', color: '#475569', lineHeight: '1.4' }}>{rel.description}</p>
                        </div>
                      )
                    })}
                  </div>
                ) : (<p style={{ margin: 0, fontSize: '0.9em', color: '#94a3b8' }}>뚜렷한 상호작용이 없습니다.</p>)}
              </div>

              {/* 운세 변화 알림 */}
              {groupedDynamic.length > 0 && (
                <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1em', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🔔 지금 주목해야 할 운세 변화
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {groupedDynamic.map((rel, idx) => {
                      const hasIljin = rel.un_types.includes('오늘 일진');
                      const hasWolun = rel.un_types.includes('이달의 월운');
                      const isHighlight = hasIljin || hasWolun;
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: isHighlight ? '#eff6ff' : 'rgba(255,255,255,0.7)', border: isHighlight ? '1px solid #bfdbfe' : 'none', padding: '12px', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span onClick={() => openModal(rel.type)} style={{ fontSize: '0.85em', fontWeight: 'bold', color: isHighlight ? '#0369a1' : '#92400e', cursor: 'pointer', textDecoration: 'underline' }}>{rel.name}</span>
                            <span style={{ fontSize: '0.7em', padding: '2px 6px', backgroundColor: isHighlight ? '#dbeafe' : '#fef3c7', color: isHighlight ? '#1d4ed8' : '#b45309', borderRadius: '4px', border: `1px solid ${isHighlight ? '#93c5fd' : '#fde68a'}` }}>
                              {rel.un_types.join(' & ')}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.9em', color: '#451a03', lineHeight: '1.4' }}>
                            <strong style={{ color: isHighlight ? '#0284c7' : '#d97706' }}>[{rel.target_pillar}]</strong> {rel.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 운세 흐름 (월운/세운/대운) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                {/* 월운 */}
                {result.wolun && (
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1em', color: '#334155' }}>🌙 이달의 운세 (올해의 월운)</h3>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '10px', scrollbarWidth: 'thin' }}>
                      {result.wolun.map((wun, idx) => (
                        <div key={idx} style={{ minWidth: '55px', padding: '10px 4px', border: wun.is_current ? '2px solid #8b5cf6' : '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center', backgroundColor: wun.is_current ? '#f5f3ff' : '#ffffff' }}>
                          <div style={{ fontSize: '0.7em', color: '#64748b', marginBottom: '6px', fontWeight: wun.is_current ? 'bold' : 'normal' }}>{wun.month}월</div>
                          <div onClick={() => openModal(wun.ganji[0])} style={{ fontSize: '1.1em', fontWeight: 'bold', color: getElementColor(wun.ganji[0]), cursor: 'pointer' }}>{wun.ganji[0]}</div>
                          <div onClick={() => openModal(wun.ganji[1])} style={{ fontSize: '1.1em', fontWeight: 'bold', color: wun.is_gongmang ? '#ef4444' : getElementColor(wun.ganji[1]), cursor: 'pointer', marginBottom: '4px' }}>{wun.ganji[1]}</div>
                          <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginBottom: '4px' }}>
                            {wun.jijanggan?.map((gan, i) => <span key={i} onClick={() => openModal(gan)} style={{ fontSize: '0.65em', color: '#94a3b8', cursor: 'pointer' }}>{gan}</span>)}
                          </div>
                          <div onClick={() => openModal(wun.shipi)} style={{ fontSize: '0.65em', color: '#64748b', cursor: 'pointer' }}>{wun.shipi}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #f1f5f9' }}/>

                {/* 세운 */}
                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1em', color: '#334155' }}>📅 1년 단위 현실 (세운)</h3>
                  <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '10px', scrollbarWidth: 'thin' }}>
                    {result.seun.map((wun, idx) => {
                      const isCurrent = wun.year === currentYear;
                      return (
                        <div key={idx} style={{ minWidth: '55px', padding: '10px 4px', border: isCurrent ? '2px solid #10b981' : '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center', backgroundColor: isCurrent ? '#ecfdf5' : '#ffffff' }}>
                          <div style={{ fontSize: '0.7em', color: '#64748b', marginBottom: '2px' }}>{wun.year}</div>
                          <div style={{ fontSize: '0.8em', fontWeight: 'bold', color: '#ef4444', marginBottom: '6px' }}>{wun.age}세</div>
                          <div onClick={() => openModal(wun.ganji[0])} style={{ fontSize: '1.1em', fontWeight: 'bold', color: getElementColor(wun.ganji[0]), cursor: 'pointer' }}>{wun.ganji[0]}</div>
                          <div onClick={() => openModal(wun.ganji[1])} style={{ fontSize: '1.1em', fontWeight: 'bold', color: wun.is_gongmang ? '#ef4444' : getElementColor(wun.ganji[1]), cursor: 'pointer', marginBottom: '4px' }}>{wun.ganji[1]}</div>
                          <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginBottom: '4px' }}>
                            {wun.jijanggan?.map((gan, i) => <span key={i} onClick={() => openModal(gan)} style={{ fontSize: '0.65em', color: '#94a3b8', cursor: 'pointer' }}>{gan}</span>)}
                          </div>
                          <div onClick={() => openModal(wun.shipi)} style={{ fontSize: '0.65em', color: '#64748b', cursor: 'pointer' }}>{wun.shipi}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #f1f5f9' }}/>

                {/* 대운 */}
                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1em', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                    <span>🛤️ 10년 단위 큰 환경 (대운)</span>
                    <span style={{ fontSize: '0.75em', color: '#6366f1', fontWeight: 'normal', cursor: 'pointer' }} onClick={() => openModal("교운기")}>💡 교운기란?</span>
                  </h3>
                  <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '10px', scrollbarWidth: 'thin' }}>
                    {result.daewun.map((wun, idx) => {
                      const isCurrent = result.seun.find(s => s.year === currentYear)?.age >= wun.age && result.seun.find(s => s.year === currentYear)?.age < wun.age + 10;
                      return (
                        <div key={idx} style={{ minWidth: '60px', padding: '10px 4px', border: isCurrent ? '2px solid #3b82f6' : '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center', backgroundColor: isCurrent ? '#eff6ff' : '#ffffff', opacity: wun.age > 90 ? 0.6 : 1 }}>
                          <div style={{ fontSize: '0.75em', fontWeight: 'bold', color: isCurrent ? '#1d4ed8' : '#ef4444', marginBottom: '2px' }}>{wun.age}세</div>
                          <div onClick={() => openModal(wun.ganji[0])} style={{ fontSize: '1.1em', fontWeight: 'bold', color: getElementColor(wun.ganji[0]), cursor: 'pointer' }}>{wun.ganji[0]}</div>
                          <div onClick={() => openModal(wun.ganji[1])} style={{ fontSize: '1.1em', fontWeight: 'bold', color: wun.is_gongmang ? '#ef4444' : getElementColor(wun.ganji[1]), cursor: 'pointer', marginBottom: '4px' }}>{wun.ganji[1]}</div>
                          <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginBottom: '4px' }}>
                            {wun.jijanggan?.map((gan, i) => <span key={i} onClick={() => openModal(gan)} style={{ fontSize: '0.65em', color: '#94a3b8', cursor: 'pointer' }}>{gan}</span>)}
                          </div>
                          <div onClick={() => openModal(wun.shipi)} style={{ fontSize: '0.65em', color: '#64748b', cursor: 'pointer', marginBottom: '6px' }}>{wun.shipi}</div>
                          <div style={{ fontSize: '0.6em', color: '#4338ca', backgroundColor: '#e0e7ff', padding: '2px', borderRadius: '4px' }} title="대운 진입(교운기) 날짜">
                            {wun.start_date.substring(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}
        </>
      )}

      {/* ===================== [2. 궁합 보기 탭 영역] ===================== */}
      {activeTab === 'gunghap' && (
        <>
          <form onSubmit={handleGunghapSubmit} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '30px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              
              {/* 👤 나의 정보 입력 */}
              <div style={{ flex: '1 1 45%', minWidth: '280px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#334155' }}>👤 나의 정보</h4>
                
                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                  <select 
                    style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85em' }} 
                    name="gender" 
                    value={gunghapData.me.gender} 
                    onChange={(e) => handleGunghapChange('me', e)}
                  >
                    <option value="M">남성</option>
                    <option value="F">여성</option>
                  </select>
                  <select 
                    style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85em' }} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setGunghapData(prev => ({...prev, me: {...prev.me, is_lunar: val.includes('lunar'), is_leap_month: val === 'lunar_leap'}}))
                    }} 
                    value={!gunghapData.me.is_lunar ? 'solar' : gunghapData.me.is_leap_month ? 'lunar_leap' : 'lunar'}
                  >
                    <option value="solar">양력</option>
                    <option value="lunar">음력(평달)</option>
                    <option value="lunar_leap">음력(윤달)</option>
                  </select>
                </div>

                {/* 🌟 년/월/일/시/분 한 줄(1 Row) 병합 UI 적용 */}
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '10px' }}>
                  {['year', 'month', 'day'].map(field => (
                    <div key={field} style={{ flex: '1 1 15%', minWidth: '40px', display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.7em', color: '#64748b', marginBottom: '2px' }}>
                        {field === 'year' ? '년' : field === 'month' ? '월' : '일'}
                      </span>
                      <input 
                        type="number" 
                        name={field} 
                        value={gunghapData.me[field]} 
                        onChange={(e) => handleGunghapChange('me', e)} 
                        style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }} 
                      />
                    </div>
                  ))}
                  <div style={{ flex: '1 1 15%', minWidth: '40px', display: 'flex', flexDirection: 'column', opacity: gunghapData.me.is_time_unknown ? 0.4 : 1 }}>
                    <span style={{ fontSize: '0.7em', color: '#64748b', marginBottom: '2px' }}>시</span>
                    <input 
                      type="number" 
                      name="hour" 
                      value={gunghapData.me.hour} 
                      onChange={(e) => handleGunghapChange('me', e)} 
                      disabled={gunghapData.me.is_time_unknown} 
                      style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }} 
                    />
                  </div>
                  <div style={{ flex: '1 1 15%', minWidth: '40px', display: 'flex', flexDirection: 'column', opacity: gunghapData.me.is_time_unknown ? 0.4 : 1 }}>
                    <span style={{ fontSize: '0.7em', color: '#64748b', marginBottom: '2px' }}>분</span>
                    <input 
                      type="number" 
                      name="minute" 
                      value={gunghapData.me.minute} 
                      onChange={(e) => handleGunghapChange('me', e)} 
                      disabled={gunghapData.me.is_time_unknown} 
                      style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }} 
                    />
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <label style={{ fontSize: '0.8em', color: '#64748b', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      name="is_time_unknown" 
                      checked={gunghapData.me.is_time_unknown} 
                      onChange={(e) => handleGunghapChange('me', e)} 
                    /> 시간 모름 (삼주육자)
                  </label>
                </div>
              </div>

              {/* 💖 상대방 정보 입력 */}
              <div style={{ flex: '1 1 45%', minWidth: '280px', backgroundColor: '#fff1f2', padding: '15px', borderRadius: '10px', border: '1px solid #fce7f3' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#be185d' }}>💖 상대방 정보</h4>
                
                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                  <select 
                    style={{ flex: 1, padding: '8px', border: '1px solid #fbcfe8', borderRadius: '6px', fontSize: '0.85em' }} 
                    name="gender" 
                    value={gunghapData.partner.gender} 
                    onChange={(e) => handleGunghapChange('partner', e)}
                  >
                    <option value="F">여성</option>
                    <option value="M">남성</option>
                  </select>
                  <select 
                    style={{ flex: 1, padding: '8px', border: '1px solid #fbcfe8', borderRadius: '6px', fontSize: '0.85em' }} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setGunghapData(prev => ({...prev, partner: {...prev.partner, is_lunar: val.includes('lunar'), is_leap_month: val === 'lunar_leap'}}))
                    }} 
                    value={!gunghapData.partner.is_lunar ? 'solar' : gunghapData.partner.is_leap_month ? 'lunar_leap' : 'lunar'}
                  >
                    <option value="solar">양력</option>
                    <option value="lunar">음력(평달)</option>
                    <option value="lunar_leap">음력(윤달)</option>
                  </select>
                </div>

                {/* 🌟 년/월/일/시/분 한 줄(1 Row) 병합 UI 적용 */}
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '10px' }}>
                  {['year', 'month', 'day'].map(field => (
                    <div key={field} style={{ flex: '1 1 15%', minWidth: '40px', display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.7em', color: '#9d174d', marginBottom: '2px' }}>
                        {field === 'year' ? '년' : field === 'month' ? '월' : '일'}
                      </span>
                      <input 
                        type="number" 
                        name={field} 
                        value={gunghapData.partner[field]} 
                        onChange={(e) => handleGunghapChange('partner', e)} 
                        style={{ padding: '8px', border: '1px solid #fbcfe8', borderRadius: '6px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }} 
                      />
                    </div>
                  ))}
                  <div style={{ flex: '1 1 15%', minWidth: '40px', display: 'flex', flexDirection: 'column', opacity: gunghapData.partner.is_time_unknown ? 0.4 : 1 }}>
                    <span style={{ fontSize: '0.7em', color: '#9d174d', marginBottom: '2px' }}>시</span>
                    <input 
                      type="number" 
                      name="hour" 
                      value={gunghapData.partner.hour} 
                      onChange={(e) => handleGunghapChange('partner', e)} 
                      disabled={gunghapData.partner.is_time_unknown} 
                      style={{ padding: '8px', border: '1px solid #fbcfe8', borderRadius: '6px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }} 
                    />
                  </div>
                  <div style={{ flex: '1 1 15%', minWidth: '40px', display: 'flex', flexDirection: 'column', opacity: gunghapData.partner.is_time_unknown ? 0.4 : 1 }}>
                    <span style={{ fontSize: '0.7em', color: '#9d174d', marginBottom: '2px' }}>분</span>
                    <input 
                      type="number" 
                      name="minute" 
                      value={gunghapData.partner.minute} 
                      onChange={(e) => handleGunghapChange('partner', e)} 
                      disabled={gunghapData.partner.is_time_unknown} 
                      style={{ padding: '8px', border: '1px solid #fbcfe8', borderRadius: '6px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }} 
                    />
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <label style={{ fontSize: '0.8em', color: '#9d174d', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      name="is_time_unknown" 
                      checked={gunghapData.partner.is_time_unknown} 
                      onChange={(e) => handleGunghapChange('partner', e)} 
                    /> 시간 모름 (삼주육자)
                  </label>
                </div>
              </div>

            </div>
            
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', marginTop: '20px', backgroundColor: '#db2777', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em' }}>
              {loading ? '궁합 연결 중...' : '궁합 점수 확인하기'}
            </button>
          </form>

          {/* 🌟 궁합 결과 렌더링 🌟 */}
          {gunghapResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* 점수 요약 카드 */}
              <div style={{ backgroundColor: '#ffffff', border: '2px solid #fbcfe8', borderRadius: '16px', padding: '30px 20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(219,39,119,0.1)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#831843', fontSize: '1.2em' }}>두 사람의 찰떡 궁합도는?</h3>
                <div style={{ fontSize: '4em', fontWeight: '900', color: '#db2777', textShadow: '2px 2px 0px #fce7f3' }}>
                  {gunghapResult.score}<span style={{ fontSize: '0.5em', color: '#f472b6' }}>점</span>
                </div>
                <div style={{ marginTop: '15px', backgroundColor: '#fdf2f8', padding: '15px', borderRadius: '8px', color: '#9d174d', fontWeight: 'bold', lineHeight: '1.5' }}>
                  "{gunghapResult.summary}"
                </div>
              </div>

              {/* 세부 분석 카드 */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{fontSize:'1.2em'}}>☯️</span> 기운의 조화 (오행 보완)
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.95em', color: '#475569', lineHeight: '1.6' }}>
                    {gunghapResult.element_complement}
                  </p>
                </div>
                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{fontSize:'1.2em'}}>🧠</span> 마음과 생각의 끌림 (천간)
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.95em', color: '#475569', lineHeight: '1.6' }}>
                    {gunghapResult.heavenly_desc}
                  </p>
                </div>
                <div style={{ padding: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{fontSize:'1.2em'}}>🏡</span> 현실적 환경과 속궁합 (지지)
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.95em', color: '#475569', lineHeight: '1.6' }}>
                    {gunghapResult.earthly_desc}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ===================== [공통 모달창 영역] ===================== */}
      
      {/* 🔮 생시 역추적 모달 */}
      {showRectifyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#4c1d95', fontSize: '1.3em' }}>🔮 생시 역추적 시스템</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.9em', color: '#64748b', lineHeight: '1.5' }}>
              태어난 연/월/일을 기반으로, 고객님의 평소 성향과 바이오리듬을 분석하여 가장 확률이 높은 시간을 찾아냅니다.
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <strong style={{ display: 'block', marginBottom: '10px', color: '#1e293b', fontSize: '0.95em' }}>Q1. 평소 성향이나 추구하는 삶의 방향은?</strong>
              <select value={rectifyData.q1} onChange={(e) => setRectifyData({...rectifyData, q1: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9em' }}>
                <option value="A">독립심이 강하고 내 방식대로 하는 게 편하다 (주체성)</option>
                <option value="B">무언가를 만들고 표현하며 베푸는 것을 좋아한다 (창의성)</option>
                <option value="C">현실적이고 결과와 재물을 중시한다 (현실성)</option>
                <option value="D">원칙과 규칙을 중시하며 명예를 중요하게 생각한다 (책임감)</option>
                <option value="E">생각이 깊고 직관력이 뛰어나며 공부/사색을 즐긴다 (수용성)</option>
              </select>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <strong style={{ display: 'block', marginBottom: '10px', color: '#1e293b', fontSize: '0.95em' }}>Q2. 하루 중 에너지가 가장 넘치거나 편안한 시간은?</strong>
              <select value={rectifyData.q2} onChange={(e) => setRectifyData({...rectifyData, q2: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9em' }}>
                <option value="A">새벽 ~ 아침 (03시 ~ 09시)</option>
                <option value="B">낮 ~ 늦은 오후 (09시 ~ 15시)</option>
                <option value="C">해 질 녘 ~ 초저녁 (15시 ~ 21시)</option>
                <option value="D">늦은 밤 ~ 심야 (21시 ~ 03시)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowRectifyModal(false)} 
                style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                취소
              </button>
              <button 
                onClick={handleRectifySubmit} 
                disabled={loading} 
                style={{ flex: 2, padding: '12px', backgroundColor: '#6d28d9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {loading ? '역산 중...' : '생시 추정하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ℹ️ 용어 설명 팝업 모달 */}
      {modalInfo && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box' }} onClick={() => setModalInfo(null)}>
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', maxWidth: '320px', width: '100%', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3em', fontWeight: '800' }}>{modalInfo.title}</h3>
              <button onClick={() => setModalInfo(null)} style={{ background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
            </div>
            <p style={{ margin: 0, lineHeight: '1.6', color: '#475569', fontSize: '0.95em', wordBreak: 'keep-all' }}>{modalInfo.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}