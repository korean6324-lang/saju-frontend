import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// 💡 Supabase 클라이언트 초기화 (VITE 전용)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 💡 통합 사전 데이터
const TERMS_DICT = {
  "비견": "독립심, 주체성, 자존심을 상징하며 형제, 친구, 동료와의 동등한 관계를 의미합니다.",
  "겁재": "경쟁심, 투쟁력, 승부욕을 상징하며 재물을 둘러싼 경쟁이나 대인관계의 뺏고 빼앗김을 의미합니다.",
  "식신": "창의력, 의식주의 풍요, 전문성, 탐구심을 상징하며 온화하고 베푸는 성향을 의미합니다.",
  "상관": "뛰어난 표현력, 사교성, 기득권 타파를 상징하며, 틀에 얽매이지 않는 자유로운 발상과 언변을 의미합니다.",
  "편재": "유동적인 큰 재물, 사업 수완, 공간 지각력, 인맥 관리와 넓은 활동 영역을 의미합니다.",
  "정재": "고정적이고 안정적인 수입, 성실함, 꼼꼼함, 책임감과 알뜰한 저축심을 의미합니다.",
  "편관": "카리스마, 권력, 강한 인내심과 돌파력을 상징하며, 위험을 감수하는 리더십과 명예욕을 의미합니다.",
  "정관": "합리성, 보수적 원칙, 준법정신, 책임감을 상징하며 안정적인 직장과 바른 길을 의미합니다.",
  "편인": "직관력, 눈치, 특수한 기술이나 예술/종교/철학적 재능, 비대중적인 학문을 의미합니다.",
  "정인": "학문, 도덕성, 수용력, 인내심을 상징하며 어머니의 사랑과 문서(자격증, 부동산) 운을 의미합니다.",
  "일간": "사주팔자에서 '나 자신'을 의미하는 기준점입니다.",
  "목": "성장과 추진력, 창조적인 에너지를 상징하며, 어질고(仁) 위로 곧게 뻗어나가는 기운입니다.",
  "화": "열정과 명랑함, 확산하는 에너지를 상징하며, 예의(禮)를 중시하고 타오르는 불의 기운입니다.",
  "토": "중재와 포용력, 안정감을 상징하며, 신용(信)을 바탕으로 만물을 품는 대지의 기운입니다.",
  "금": "결단력과 원칙, 맺고 끊음을 상징하며, 의리(義)를 중시하고 단단하게 결실을 맺는 기운입니다.",
  "수": "지혜와 유연성, 수용력을 상징하며, 상황에 맞게 대처하고 만물을 적셔주는(智) 물의 기운입니다.",
  "갑": "큰 나무(陽木). 강한 생명력과 추진력, 리더십과 우두머리 기질을 상징합니다.",
  "을": "화초나 덩굴(陰木). 유연함과 환경 적응력, 끈질긴 생명력과 사교성을 상징합니다.",
  "병": "태양(陽火). 밝고 화려하며, 열정적이고 명랑하게 만물을 비추는 기운을 상징합니다.",
  "정": "촛불, 달빛(陰火). 은은한 온기와 희생정신, 섬세하고 따뜻한 감수성을 상징합니다.",
  "무": "큰 산(陽土). 듬직하고 포용력이 넓으며, 만물을 중재하고 믿음을 주는 기운입니다.",
  "기": "평야, 논밭(陰土). 어머니 같은 수용력, 실속을 챙기며 다정다감한 기운입니다.",
  "경": "바위, 무쇠(陽金). 원칙과 결단력, 강한 의리와 카리스마를 상징합니다.",
  "신": "보석, 정밀한 칼(陰金). 예민한 감수성과 정교함, 완벽주의와 날카로움을 상징합니다.",
  "임": "바다, 강물(陽水). 지혜롭고 융통성이 뛰어나며, 모든 것을 포용하는 넓은 스케일을 의미합니다.",
  "계": "이슬비, 옹달샘(陰水). 부드럽고 다정하며, 섬세한 지혜와 기획력을 상징합니다.",
  "자": "쥐(수). 어둠 속의 비밀스러운 활동, 강한 번식력과 뛰어난 지혜를 의미합니다.",
  "축": "소(토). 묵묵한 끈기와 성실함, 속을 알 수 없는 뚝심을 의미합니다.",
  "인": "호랑이(목). 강한 독립심과 개척 정신, 명예욕과 권력을 향한 의지를 의미합니다.",
  "묘": "토끼(목). 부드럽고 다정함, 섬세한 감수성과 예술적 재능을 의미합니다.",
  "진": "용(토). 이상향과 야망, 스케일이 크고 변화무쌍한 에너지를 의미합니다.",
  "사": "뱀(화). 강한 집념과 열정, 화려함과 빠른 두뇌 회전을 의미합니다.",
  "오": "말(화). 활달하고 진취적이며, 솔직하고 사교적인 확산의 에너지를 의미합니다.",
  "미": "양(토). 온순해 보이나 강한 고집, 희생정신과 철학/예술적 성향을 의미합니다.",
  "신": "원숭이(금). 다재다능하고 재주가 많으며, 임기응변과 결단력이 뛰어납니다.",
  "유": "닭(금). 섬세하고 예민하며, 맺고 끊음이 정확한 완벽주의 성향을 의미합니다.",
  "술": "개(토). 충직함과 강한 책임감, 직관력이 뛰어나고 방어적인 성향을 의미합니다.",
  "해": "돼지(수). 온화함과 넓은 포용력, 풍요로움과 지적 호기심을 의미합니다.",
  "백호대살": "강렬하고 폭발적인 에너지, 강한 프로 의식을 의미합니다.",
  "원진살": "이유 없는 미움과 원망이 교차하는 기운. 대인관계에서 예민함이 증폭됩니다.",
  "천라지망": "하늘과 땅에 그물이 쳐진 형국으로, 섣불리 움직이면 그물에 얽매이기 쉽습니다.",
  "통근": "천간의 글자가 지지에 뿌리를 내려 기운이 매우 실하고 강한 상태를 의미합니다.",
  "허투": "천간의 글자가 지지에 뿌리를 내리지 못해 기운이 허공에 뜬 불안정한 상태입니다.",
  "공망": "천간과 지지의 짝이 맞지 않아 비어있음을 뜻합니다. 작용력이 반감됩니다.",
  "교운기": "10년마다 바뀌는 대운(큰 환경)이 교차하는 시점입니다. 이 시기 전후로 가치관이나 환경의 큰 변화를 겪게 됩니다."
};

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

const UI = {
  ko: {
    appTitle: "명리", appSubtitle: "글로벌 초정밀 사주 & 궁합 엔진", tabSaju: "👤 개인 사주 분석", tabGunghap: "💑 프리미엄 궁합",
    name: "이름 (닉네임)", gender: "성별", male: "남성", female: "여성", cal: "역법 (양/음력)", solar: "양력", lunar: "음력 (평달)", lunarLeap: "음력 (윤달)",
    loc: "국가/도시 (경도 자동반영)", bDate: "생년월일", bTime: "태어난 시간", timeUnk: "시간을 정확히 모릅니다", btnRect: "🔮 생시 추론하기",
    btnSaju: "명리-PRO 원국 분석하기", btnGunghap: "명리-PRO 궁합 확인", loading: "명리-PRO 엔진 가동 중...", myInfo: "👤 나의 정보", ptInfo: "💖 상대방 정보",
    menuWhy: "🔍 Why 명리-PRO?", menuSub: "매일 운세 무료 구독 💌", menuContact: "플랫폼 제공 및 문의",
    menuCalendar: "📅 간지 달력 (만세력)", calTitle: "월 만세력", 
    tierTrial: "✅ 7일 무료 체험중", tierExpired: "⚠️ 무료 체험 만료", tierPremium: "👑 프리미엄 구독중",
    expertTitle: "👑 전문가 1:1 심층 사주풀이", expertDesc: "모든 가중치와 살, 합/충을 종합하여 고객님만을 위한 가장 명확하고 구체적인 해설과 개운법을 제공합니다.",
    lockMsgExpired: "무료 체험이 만료되었습니다.\n프리미엄 결제 후 모든 심층 분석을 확인하세요.", 
    lockMsgExpert: "프리미엄 결제 전용 콘텐츠입니다.\n추상적인 말을 배제한 명확한 해석을 확인하세요.",
    btnPay: "프리미엄 결제하고 확인하기", loginKakao: "카카오 로그인", loginNaver: "네이버 로그인", loginGoogle: "Google 로그인", loginApple: "Apple로 로그인",
    loginMsg: "1초만에 가입하고 7일 무료 체험을 시작하세요!"
  }
};

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

const globalStyles = `
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  body { background-color: #F8F7F4; margin: 0; font-family: 'Pretendard', -apple-system, sans-serif; color: #2C303A; overflow-x: hidden; }
  .fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .premium-card { background: #FFFFFF; border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03); border: 1px solid #EFECE6; margin-bottom: 20px; }
  .input-field { width: 100%; padding: 14px 12px; border: 1px solid #E2DED5; border-radius: 10px; font-size: 16px; color: #1C2536 !important; background-color: #FAFAFA; transition: all 0.2s; box-sizing: border-box; min-width: 0; }
  .input-field::placeholder { color: #9CA3AF; opacity: 1; }
  .input-field:focus { border-color: #B59960; background-color: #FFF; outline: none; box-shadow: 0 0 0 3px rgba(181, 153, 96, 0.15); }
  .label-text { font-size: 0.85em; color: #6B7280; margin-bottom: 6px; display: block; font-weight: 600; }
  .btn-primary { background: linear-gradient(135deg, #1C2536 0%, #111827 100%); color: #F3E8D0; padding: 16px; border: none; border-radius: 12px; font-size: 1.1em; font-weight: 700; cursor: pointer; width: 100%; transition: all 0.2s; box-shadow: 0 4px 15px rgba(17, 24, 39, 0.2); }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { background: #9CA3AF; box-shadow: none; cursor: not-allowed; }
  .spinner { border: 3px solid rgba(243, 232, 208, 0.3); border-top-color: #F3E8D0; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .horizontal-scroll { display: flex; overflow-x: auto; gap: 8px; padding-bottom: 10px; scrollbar-width: thin; }
  .horizontal-scroll::-webkit-scrollbar { height: 6px; }
  .horizontal-scroll::-webkit-scrollbar-thumb { background-color: #CBD5E1; border-radius: 10px; }
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
  .social-btn { display: flex; align-items: center; justify-content: center; width: 100%; padding: 15px; border-radius: 12px; font-size: 1.05em; font-weight: 700; cursor: pointer; margin-bottom: 12px; border: none; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: transform 0.2s; }
  .social-btn:active { transform: scale(0.98); }
  .btn-kakao { background-color: #FEE500; color: #000000; }
  .btn-naver { background-color: #03C75A; color: #FFFFFF; }
  .btn-google { background-color: #FFFFFF; color: #000000; border: 1px solid #E2DED5; }
  .btn-apple { background-color: #000000; color: #FFFFFF; }  
  .btn-github { background-color: #24292e; color: #FFFFFF; }
  .locked-section { position: relative; border-radius: 16px; overflow: hidden; }
  .locked-blur { filter: blur(6px); opacity: 0.5; pointer-events: none; user-select: none; }
  .locked-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(248, 247, 244, 0.6); z-index: 10; text-align: center; padding: 20px; box-sizing: border-box; }
  .btn-upgrade { background: linear-gradient(135deg, #D4AF37 0%, #AA771C 100%); color: #FFF; padding: 14px 28px; border-radius: 30px; font-weight: 800; font-size: 1.1em; border: none; cursor: pointer; box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4); margin-top: 15px; transition: transform 0.2s; }
  .btn-upgrade:active { transform: scale(0.95); }
  .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(17, 24, 39, 0.65); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 5000; padding: 20px; box-sizing: border-box; }
`;

export default function SajuCalculator() {
  const [lang, setLang] = useState('ko'); 
  const t = UI[lang] || UI['ko']; 

  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [user, setUser] = useState(null);
  const [userTier, setUserTier] = useState('trial'); 

  const [activeTab, setActiveTab] = useState('saju');
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isWhyProOpen, setIsWhyProOpen] = useState(false); 

  const [formData, setFormData] = useState({ 
    name: '', birthPlace: 'KR_SEO', year: 1990, month: 5, day: 15, hour: 14, minute: 30, gender: 'M', is_lunar: false, is_leap_month: false 
  });
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [result, setResult] = useState(null);
  
  const [gunghapData, setGunghapData] = useState({
    me: { name: '', birthPlace: 'KR_SEO', year: 1990, month: 5, day: 15, hour: 14, minute: 30, gender: 'M', is_lunar: false, is_leap_month: false, is_time_unknown: false },
    partner: { name: '', birthPlace: 'KR_SEO', year: 1995, month: 8, day: 20, hour: 10, minute: 0, gender: 'F', is_lunar: false, is_leap_month: false, is_time_unknown: false }
  });
  const [gunghapResult, setGunghapResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalInfo, setModalInfo] = useState(null);

  // 🚀 앱 실행 시 로그인 상태 확인 및 DB 내역 자동 불러오기
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user || null;
      setIsLoggedIn(!!session);
      setUser(currentUser);
      if (currentUser) fetchMyBaziProfile(currentUser.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setIsLoggedIn(!!session);
      setUser(currentUser);
      if (currentUser) fetchMyBaziProfile(currentUser.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🚀 Supabase에서 내 사주 기록 가져오기 함수
  const fetchMyBaziProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_bazi_profiles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const profile = data[0];
        setResult(profile.bazi_result); 
        
        const bDate = new Date(profile.birth_date);
        setFormData(prev => ({
          ...prev,
          name: profile.name,
          gender: profile.gender,
          year: bDate.getFullYear(),
          month: bDate.getMonth() + 1,
          day: bDate.getDate(),
          hour: bDate.getHours(),
          minute: bDate.getMinutes()
        }));
      }
    } catch (err) {
      console.error("저장된 사주 정보를 불러오는 중 오류 발생:", err);
    }
  };

  const handleSocialLogin = async (providerName) => {
    try {
      const authOptions = { provider: providerName };
      if (providerName === 'kakao') {
        authOptions.options = { scopes: 'profile_nickname profile_image' };
      }
      const { error } = await supabase.auth.signInWithOAuth(authOptions);
      if (error) throw error;
    } catch (error) { alert(`로그인 중 오류가 발생했습니다: ${error.message}`); }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsLoggedIn(false); setIsMenuOpen(false);
    } catch (error) { alert(`로그아웃 오류: ${error.message}`); }
  };

  // 🚀 1. 도커 엔진(FastAPI) 연동 API 호출 모듈 (Saju)
  const handleSajuSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true); 
    setError(''); 
    setResult(null);

    try {
      const pad = (n) => String(n).padStart(2, '0');
      const birthDt = `${formData.year}-${pad(formData.month)}-${pad(formData.day)}T${pad(formData.hour)}:${pad(formData.minute)}:00`;
      
      const payload = { 
        birth_dt: birthDt, 
        gender: formData.gender,
        is_lunar: formData.is_lunar,           // 음력 여부 전송
        is_leap_month: formData.is_leap_month  // 윤달 여부 전송
      };

      const targetUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${targetUrl}/api/v1/engine/full-analysis`, payload);
      
      if (response.data.status === 'success') {
        const engineResult = response.data.data;
        setResult(engineResult); 

        if (user) {
          const { error: dbError } = await supabase
            .from('user_bazi_profiles')
            .insert([
              { 
                user_id: user.id, 
                name: formData.name || 'User',
                gender: formData.gender,
                birth_date: birthDt,
                bazi_result: engineResult 
              }
            ]);
            
          if (dbError) {
            console.error("DB 저장 중 에러 발생:", dbError);
          }
        }
      } else {
        throw new Error("엔진 연산 결과가 올바르지 않습니다.");
      }
    } catch (err) { 
      setError(err.response?.data?.detail || '초정밀 엔진 서버 통신 에러가 발생했습니다.'); 
    } finally { 
      setLoading(false); 
    }
  };

  // 🚀 2. 도커 엔진(FastAPI) 연동 API 호출 모듈 (Gunghap)
  const handleGunghapSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setGunghapResult(null);
    try {
      const targetUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const ghPayload = {
        my_birth_year: gunghapData.me.year,
        my_gender: gunghapData.me.gender,
        target_gua: 1 
      };

      const response = await axios.post(`${targetUrl}/api/v1/fengshui/match`, ghPayload);
      setGunghapResult(response.data);
    } catch (err) { setError(err.response?.data?.detail || '궁합 서버 연결 에러가 발생했습니다.'); } finally { setLoading(false); }
  };

  const openModal = (keyword) => {
    if (!keyword) return;
    if (TERMS_DICT[keyword]) setModalInfo({ title: keyword, desc: TERMS_DICT[keyword] });
    else setModalInfo({ title: keyword, desc: "해당 단어의 상세 사전 데이터가 준비 중입니다." });
  };

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px 20px', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <style>{globalStyles}</style>
        <div className="fade-in">
          <h1 style={{ fontSize: '3em', color: '#1C2536', margin: '0 0 10px 0', fontWeight: '900', letterSpacing: '-1px' }}>{t.appTitle}<span style={{ color: '#B59960' }}>-PRO</span></h1>
          <p style={{ color: '#6B7280', fontSize: '1em', marginBottom: '40px', fontWeight: '600' }}>{t.appSubtitle}</p>
          <div style={{ backgroundColor: '#F0F9FF', padding: '15px', borderRadius: '12px', border: '1px solid #BAE6FD', marginBottom: '30px' }}>
            <span style={{ fontSize: '1.2em' }}>🎁</span><br/>
            <strong style={{ color: '#0369A1' }}>{t.loginMsg}</strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="social-btn btn-github" onClick={() => handleSocialLogin('github')} style={{ marginBottom: '0' }}>🐙 깃허브로 로그인 (GitHub)</button>
            <button className="social-btn" style={{ backgroundColor: '#B59960', color: '#FFFFFF', marginTop: '10px', border: 'none', boxShadow: '0 4px 15px rgba(181, 153, 96, 0.4)' }} onClick={() => { setIsLoggedIn(true); setUserTier('premium'); alert('🛠️ 테스트 계정(프리미엄)으로 접속되었습니다!'); }}>⚡ 원클릭 테스트 로그인 (프리미엄 패스)</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>

      {/* 사이드바 메뉴 */}
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2 style={{ margin: 0, fontSize: '1.5em', color: '#1C2536', fontWeight: '900' }}>{t.appTitle}<span style={{ color: '#B59960' }}>-PRO</span></h2>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><span style={{ fontSize: '24px' }}>&times;</span></button>
        </div>
        <div style={{ paddingBottom: '5px' }}>
          <button className="menu-nav-btn" onClick={() => { setActiveTab('saju'); setIsMenuOpen(false); }}>{t.tabSaju}</button>
          <button className="menu-nav-btn" onClick={() => { setActiveTab('gunghap'); setIsMenuOpen(false); }}>{t.tabGunghap}</button>
        </div>
        <div className="menu-content">
          <div className="menu-box">
            <h4 className="accordion-title" onClick={() => setIsWhyProOpen(!isWhyProOpen)}><span>{t.menuWhy}</span></h4>
            {isWhyProOpen && (
              <ul className="feature-list fade-in">
                <li><strong>진태양시 정밀 적용:</strong> 글로벌 출생지의 경도 계산 및 진기 보정.</li>
                <li><strong>통근/허자 스캔:</strong> 눈에 보이지 않는 기운의 역동성 추적.</li>
                <li><strong>업상대체 DB:</strong> 전문가적 개운법 솔루션 탑재.</li>
              </ul>
            )}
          </div>
        </div>
        <div className="menu-footer">
          <div className="contact-item" style={{ marginTop: '20px', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleLogout}>🔓 로그아웃</div>
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px', paddingBottom: '60px' }}>
        
        {/* 권한 토글 (테스트용) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <button onClick={() => { setUserTier(userTier === 'trial' ? 'expired' : userTier === 'expired' ? 'premium' : 'trial'); }} style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.8em', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #CCC' }}>
            {userTier === 'premium' ? t.tierPremium : userTier === 'expired' ? t.tierExpired : t.tierTrial} (클릭 변경)
          </button>
        </div>

        {/* 상단 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px', marginBottom: '25px' }}>
          <div style={{ flex: 1 }}></div>
          <div style={{ textAlign: 'center', flex: 2 }}>
            <h2 style={{ margin: 0, fontSize: '2em', color: '#1C2536', fontWeight: '900', letterSpacing: '-0.5px' }}>{t.appTitle}<span style={{ color: '#B59960' }}>-PRO</span></h2>
            <p style={{ margin: '6px 0 0', color: '#6B7280', fontSize: '0.8em', fontWeight: '600' }}>{t.appSubtitle}</p>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setIsMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', fontSize: '24px' }}>≡</button>
          </div>
        </div>
        
        {/* 탭 버튼 */}
        <div style={{ display: 'flex', backgroundColor: '#EFECE6', borderRadius: '12px', padding: '6px', marginBottom: '20px' }}>
          <button onClick={() => {setActiveTab('saju'); setError('');}} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '1em', backgroundColor: activeTab === 'saju' ? '#FFFFFF' : 'transparent', color: activeTab === 'saju' ? '#1C2536' : '#9CA3AF', boxShadow: activeTab === 'saju' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>{t.tabSaju}</button>
          <button onClick={() => {setActiveTab('gunghap'); setError('');}} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '1em', backgroundColor: activeTab === 'gunghap' ? '#FFFFFF' : 'transparent', color: activeTab === 'gunghap' ? '#B59960' : '#9CA3AF', boxShadow: activeTab === 'gunghap' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>{t.tabGunghap}</button>
        </div>

        {error && <div className="fade-in" style={{ padding: '16px', backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', color: '#991B1B', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>{error}</div>}

        {/* 🔮 [1] 개인 사주 분석 탭 */}
        {activeTab === 'saju' && (
          <div className="fade-in">
            <form onSubmit={handleSajuSubmit} className="premium-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: '1 1 140px' }}><label className="label-text">{t.name}</label><input type="text" className="input-field" placeholder="홍길동" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                <div style={{ flex: '1 1 140px' }}><label className="label-text">{t.gender}</label>
                  <div style={{ display: 'flex', gap: '5px', height: '49px' }}>
                    <button type="button" onClick={() => setFormData({...formData, gender: 'M'})} style={{ flex: 1, borderRadius: '8px', border: formData.gender === 'M' ? '2px solid #1C2536' : '1px solid #E2DED5', background: formData.gender === 'M' ? '#F3F4F6' : '#FAFAFA', fontWeight: formData.gender === 'M' ? '700' : '500', color: formData.gender === 'M' ? '#1C2536' : '#9CA3AF', cursor: 'pointer' }}>{t.male}</button>
                    <button type="button" onClick={() => setFormData({...formData, gender: 'F'})} style={{ flex: 1, borderRadius: '8px', border: formData.gender === 'F' ? '2px solid #1C2536' : '1px solid #E2DED5', background: formData.gender === 'F' ? '#F3F4F6' : '#FAFAFA', fontWeight: formData.gender === 'F' ? '700' : '500', color: formData.gender === 'F' ? '#1C2536' : '#9CA3AF', cursor: 'pointer' }}>{t.female}</button>
                  </div>
                </div>
              </div>

              {/* ✨ 양력/음력 선택 UI 추가됨 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: '1 1 100%' }}>
                  <label className="label-text">{t.cal}</label>
                  <div style={{ display: 'flex', gap: '5px', height: '49px' }}>
                    <button type="button" onClick={() => setFormData({...formData, is_lunar: false, is_leap_month: false})} style={{ flex: 1, borderRadius: '8px', border: !formData.is_lunar ? '2px solid #1C2536' : '1px solid #E2DED5', background: !formData.is_lunar ? '#F3F4F6' : '#FAFAFA', fontWeight: !formData.is_lunar ? '700' : '500', color: !formData.is_lunar ? '#1C2536' : '#9CA3AF', cursor: 'pointer' }}>{t.solar}</button>
                    <button type="button" onClick={() => setFormData({...formData, is_lunar: true, is_leap_month: false})} style={{ flex: 1, borderRadius: '8px', border: (formData.is_lunar && !formData.is_leap_month) ? '2px solid #1C2536' : '1px solid #E2DED5', background: (formData.is_lunar && !formData.is_leap_month) ? '#F3F4F6' : '#FAFAFA', fontWeight: (formData.is_lunar && !formData.is_leap_month) ? '700' : '500', color: (formData.is_lunar && !formData.is_leap_month) ? '#1C2536' : '#9CA3AF', cursor: 'pointer' }}>{t.lunar}</button>
                    <button type="button" onClick={() => setFormData({...formData, is_lunar: true, is_leap_month: true})} style={{ flex: 1, borderRadius: '8px', border: formData.is_leap_month ? '2px solid #1C2536' : '1px solid #E2DED5', background: formData.is_leap_month ? '#F3F4F6' : '#FAFAFA', fontWeight: formData.is_leap_month ? '700' : '500', color: formData.is_leap_month ? '#1C2536' : '#9CA3AF', cursor: 'pointer' }}>{t.lunarLeap}</button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                <div style={{ flex: '1 1 140px' }}><label className="label-text">{t.bDate}</label><input type="date" className="input-field" required value={formatDate(formData.year, formData.month, formData.day)} onChange={(e) => { if(!e.target.value) return; const [y, m, d] = e.target.value.split('-'); setFormData({...formData, year: parseInt(y), month: parseInt(m), day: parseInt(d)}); }} /></div>
                <div style={{ flex: '1 1 120px' }}><label className="label-text">{t.bTime}</label><input type="time" className="input-field" value={formatTime(formData.hour, formData.minute)} onChange={(e) => { if(!e.target.value) return; const [h, min] = e.target.value.split(':'); setFormData({...formData, hour: parseInt(h), minute: parseInt(min)}); }} /></div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>{loading ? <><div className="spinner"></div> {t.loading}</> : t.btnSaju}</button>
              </div>
            </form>

            {/* 📊 결과 렌더링 (도커 엔진 연동판) */}
            {result && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. 사주 원국표 (Phase 1 엔진) */}
                <div className="premium-card">
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2em', color: '#1C2536', borderBottom: '2px solid #F0ECE1', paddingBottom: '10px' }}>
                    <span style={{ color: '#B59960' }}>{formData.name || 'User'}</span>님의 초정밀 명식표
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                    {[
                      { key: '시주', data: result.bazi_pillars?.hour_pillar },
                      { key: '일주', data: result.bazi_pillars?.day_pillar },
                      { key: '월주', data: result.bazi_pillars?.month_pillar },
                      { key: '년주', data: result.bazi_pillars?.year_pillar }
                    ].map((pillar) => (
                      <div key={pillar.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#FDFCFB', padding: '20px 5px', borderRadius: '12px', border: '1px solid #EFECE6', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize: '0.8em', color: '#9CA3AF', fontWeight: '700', marginBottom: '12px' }}>{pillar.key}</div>
                        <div onClick={() => openModal(pillar.data?.[0])} style={{ fontSize: '2em', fontWeight: '900', color: getElementColor(pillar.data?.[0]), cursor: 'pointer', marginBottom: '10px' }}>
                          {pillar.data ? pillar.data[0] : '?'}
                        </div>
                        <div style={{ width: '30px', height: '1px', backgroundColor: '#E5E0D8', margin: '5px 0 10px 0' }} />
                        <div onClick={() => openModal(pillar.data?.[1])} style={{ fontSize: '2em', fontWeight: '900', color: getElementColor(pillar.data?.[1]), cursor: 'pointer' }}>
                          {pillar.data ? pillar.data[1] : '?'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. 역학 딥다이브 (Phase 2 & 3 엔진) */}
                <div className="premium-card">
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2em', color: '#1C2536' }}>⚡ 기운의 역동성 (Mechanics)</h3>
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#4B5563' }}>천간의 통근력 (뿌리)</h4>
                    {result.mechanics?.tonggeun?.map((tg, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <strong style={{ color: getElementColor(tg.stem), width: '25px', fontSize: '1.2em' }}>{tg.stem}</strong>
                        <div style={{ flex: 1, backgroundColor: '#F1F5F9', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(tg.power_score * 2.5, 100)}%`, backgroundColor: tg.is_tonggeun ? '#10B981' : '#CBD5E1', height: '100%', borderRadius: '6px' }}></div>
                        </div>
                        <span onClick={() => openModal(tg.meta?.term)} style={{ fontSize: '0.75em', cursor: 'pointer', padding: '3px 8px', backgroundColor: tg.is_tonggeun ? '#ECFDF5' : '#F8FAFC', color: tg.is_tonggeun ? '#059669' : '#64748B', borderRadius: '4px' }}>
                          {tg.meta?.term || (tg.is_tonggeun ? '통근' : '허투')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                     <div style={{ flex: 1, backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                       <strong style={{ color: '#6366F1', display: 'block', marginBottom: '6px', fontSize: '0.9em' }}>보이지 않는 기운 (허자)</strong>
                       <div style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
                         {result.mechanics?.heoja_gonghyeop?.length > 0 ? result.mechanics.heoja_gonghyeop.join(', ') : '발견되지 않음'}
                       </div>
                     </div>
                     <div style={{ flex: 1, backgroundColor: '#FFF5F5', padding: '12px', borderRadius: '8px', border: '1px solid #FED7D7' }}>
                       <strong style={{ color: '#E53E3E', display: 'block', marginBottom: '6px', fontSize: '0.9em' }}>충돌하는 기운 (충)</strong>
                       <div style={{ fontSize: '0.9em', color: '#C53030' }}>
                         {result.mechanics?.clash_analysis?.length > 0 
                           ? result.mechanics.clash_analysis.map(c => c.target).join(', ') 
                           : '충(沖) 없음 안전함'}
                       </div>
                     </div>
                  </div>
                </div>

                {/* 3. 풍수 방위학 (Phase 4 엔진) */}
                <div className="premium-card" style={{ backgroundColor: '#FDFBFB', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2em', color: '#1C2536' }}>🧭 공간 에너지 및 방위 (Feng Shui)</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.9em', color: '#64748B', marginBottom: '5px' }}>나의 본명궁 (행운의 방향)</div>
                      <div style={{ fontSize: '1.5em', fontWeight: '800', color: '#D97706' }}>
                        {result.fengshui_profile?.gua_number}백성 {result.fengshui_profile?.gua_name}
                      </div>
                    </div>
                    <div style={{ padding: '10px 20px', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '30px', fontWeight: '900', fontSize: '1.1em' }}>
                      {result.fengshui_profile?.house_group}
                    </div>
                  </div>
                </div>

                {/* 4. 전문가 처방 DB (Phase 5 엔진: 프리미엄 전용) */}
                <div className="locked-section">
                  <div className={userTier !== 'premium' ? 'locked-blur' : ''}>
                    <div className="premium-card" style={{ border: '2px solid #D4AF37', background: 'linear-gradient(to bottom, #FFFCF5, #FFFFFF)' }}>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3em', color: '#AA771C' }}>{t.expertTitle} (업상대체)</h3>
                      
                      {result.expert_prescription?.length > 0 ? (
                        result.expert_prescription.map((rx, idx) => (
                          <div key={idx} style={{ marginBottom: '20px', borderBottom: idx !== result.expert_prescription.length -1 ? '1px dashed #E5E0D8' : 'none', paddingBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                              <span style={{ fontSize: '1.2em', fontWeight: '900', color: '#1C2536' }}>{rx.term}</span>
                              <span style={{ fontSize: '0.85em', color: '#6B7280' }}>({rx.hanja})</span>
                            </div>
                            
                            <div style={{ backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '8px', marginBottom: '8px', borderLeft: '4px solid #EF4444' }}>
                              <strong style={{ color: '#DC2626', fontSize: '0.9em', display: 'block', marginBottom: '4px' }}>⚠️ 직언 진단 (Disease)</strong>
                              <span style={{ fontSize: '0.9em', color: '#4B5563', lineHeight: '1.5' }}>{rx.disease_diagnosis}</span>
                            </div>
                            
                            <div style={{ backgroundColor: '#ECFDF5', padding: '12px', borderRadius: '8px', marginBottom: '8px', borderLeft: '4px solid #10B981' }}>
                              <strong style={{ color: '#059669', fontSize: '0.9em', display: 'block', marginBottom: '4px' }}>💊 개운법 처방 (Prescription)</strong>
                              <span style={{ fontSize: '0.9em', color: '#4B5563', lineHeight: '1.5' }}>{rx.prescription_eopsang}</span>
                            </div>

                            <div style={{ backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #0EA5E9' }}>
                              <strong style={{ color: '#0284C7', fontSize: '0.9em', display: 'block', marginBottom: '4px' }}>✨ 축언 (Blessing)</strong>
                              <span style={{ fontSize: '0.9em', color: '#4B5563', lineHeight: '1.5' }}>{rx.final_blessing}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: '#6B7280', fontSize: '0.95em' }}>현재 사주 원국에 강하게 발현된 흉살이 없어 평온한 기운을 유지하고 있습니다.</p>
                      )}
                    </div>
                  </div>
                  
                  {/* 잠금 화면 (프리미엄 미결제 시) */}
                  {userTier !== 'premium' && (
                    <div className="locked-overlay" style={{ background: 'rgba(255, 252, 245, 0.8)' }}>
                      <div style={{ fontSize: '3em', marginBottom: '10px' }}>👑</div>
                      <h3 style={{ margin: '0 0 10px 0', color: '#AA771C', fontSize: '1.3em' }}>{t.expertTitle}</h3>
                      <p style={{ margin: 0, color: '#4B5563', fontSize: '0.95em', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{t.lockMsgExpert}</p>
                      <button className="btn-upgrade" onClick={() => setUserTier('premium')}>{t.btnPay}</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 💑 [2] 프리미엄 궁합 탭 */}
        {activeTab === 'gunghap' && (
          <div className="fade-in">
            <form onSubmit={handleGunghapSubmit} className="premium-card">
              <div style={{ backgroundColor: '#F9F8F6', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #EFECE6' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#1C2536', fontSize: '1.1em' }}>{t.myInfo}</h4>
                
                {/* ✨ 나의 양력/음력 선택 UI 추가 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: '1 1 100%' }}>
                    <label className="label-text">{t.cal}</label>
                    <div style={{ display: 'flex', gap: '5px', height: '40px' }}>
                      <button type="button" onClick={() => setGunghapData(prev => ({...prev, me: {...prev.me, is_lunar: false, is_leap_month: false}}))} style={{ flex: 1, borderRadius: '6px', border: !gunghapData.me.is_lunar ? '2px solid #1C2536' : '1px solid #E2DED5', background: !gunghapData.me.is_lunar ? '#F3F4F6' : '#FAFAFA', fontWeight: !gunghapData.me.is_lunar ? '700' : '500', color: !gunghapData.me.is_lunar ? '#1C2536' : '#9CA3AF', cursor: 'pointer', fontSize: '0.9em' }}>{t.solar}</button>
                      <button type="button" onClick={() => setGunghapData(prev => ({...prev, me: {...prev.me, is_lunar: true, is_leap_month: false}}))} style={{ flex: 1, borderRadius: '6px', border: (gunghapData.me.is_lunar && !gunghapData.me.is_leap_month) ? '2px solid #1C2536' : '1px solid #E2DED5', background: (gunghapData.me.is_lunar && !gunghapData.me.is_leap_month) ? '#F3F4F6' : '#FAFAFA', fontWeight: (gunghapData.me.is_lunar && !gunghapData.me.is_leap_month) ? '700' : '500', color: (gunghapData.me.is_lunar && !gunghapData.me.is_leap_month) ? '#1C2536' : '#9CA3AF', cursor: 'pointer', fontSize: '0.9em' }}>{t.lunar}</button>
                      <button type="button" onClick={() => setGunghapData(prev => ({...prev, me: {...prev.me, is_lunar: true, is_leap_month: true}}))} style={{ flex: 1, borderRadius: '6px', border: gunghapData.me.is_leap_month ? '2px solid #1C2536' : '1px solid #E2DED5', background: gunghapData.me.is_leap_month ? '#F3F4F6' : '#FAFAFA', fontWeight: gunghapData.me.is_leap_month ? '700' : '500', color: gunghapData.me.is_leap_month ? '#1C2536' : '#9CA3AF', cursor: 'pointer', fontSize: '0.9em' }}>{t.lunarLeap}</button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: '1 1 140px' }}><label className="label-text">{t.bDate}</label><input type="date" className="input-field" value={formatDate(gunghapData.me.year, gunghapData.me.month, gunghapData.me.day)} onChange={(e) => { if(!e.target.value) return; const [y, m, d] = e.target.value.split('-'); setGunghapData(prev => ({...prev, me: {...prev.me, year: parseInt(y), month: parseInt(m), day: parseInt(d)}})); }} /></div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFF5F7', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #FCE7F3' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#BE185D', fontSize: '1.1em' }}>{t.ptInfo}</h4>

                {/* ✨ 상대방 양력/음력 선택 UI 추가 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: '1 1 100%' }}>
                    <label className="label-text">{t.cal}</label>
                    <div style={{ display: 'flex', gap: '5px', height: '40px' }}>
                      <button type="button" onClick={() => setGunghapData(prev => ({...prev, partner: {...prev.partner, is_lunar: false, is_leap_month: false}}))} style={{ flex: 1, borderRadius: '6px', border: !gunghapData.partner.is_lunar ? '2px solid #BE185D' : '1px solid #FBCFE8', background: !gunghapData.partner.is_lunar ? '#FDF2F8' : '#FAFAFA', fontWeight: !gunghapData.partner.is_lunar ? '700' : '500', color: !gunghapData.partner.is_lunar ? '#BE185D' : '#9CA3AF', cursor: 'pointer', fontSize: '0.9em' }}>{t.solar}</button>
                      <button type="button" onClick={() => setGunghapData(prev => ({...prev, partner: {...prev.partner, is_lunar: true, is_leap_month: false}}))} style={{ flex: 1, borderRadius: '6px', border: (gunghapData.partner.is_lunar && !gunghapData.partner.is_leap_month) ? '2px solid #BE185D' : '1px solid #FBCFE8', background: (gunghapData.partner.is_lunar && !gunghapData.partner.is_leap_month) ? '#FDF2F8' : '#FAFAFA', fontWeight: (gunghapData.partner.is_lunar && !gunghapData.partner.is_leap_month) ? '700' : '500', color: (gunghapData.partner.is_lunar && !gunghapData.partner.is_leap_month) ? '#BE185D' : '#9CA3AF', cursor: 'pointer', fontSize: '0.9em' }}>{t.lunar}</button>
                      <button type="button" onClick={() => setGunghapData(prev => ({...prev, partner: {...prev.partner, is_lunar: true, is_leap_month: true}}))} style={{ flex: 1, borderRadius: '6px', border: gunghapData.partner.is_leap_month ? '2px solid #BE185D' : '1px solid #FBCFE8', background: gunghapData.partner.is_leap_month ? '#FDF2F8' : '#FAFAFA', fontWeight: gunghapData.partner.is_leap_month ? '700' : '500', color: gunghapData.partner.is_leap_month ? '#BE185D' : '#9CA3AF', cursor: 'pointer', fontSize: '0.9em' }}>{t.lunarLeap}</button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: '1 1 140px' }}><label className="label-text">{t.bDate}</label><input type="date" className="input-field" style={{ borderColor: '#FBCFE8' }} value={formatDate(gunghapData.partner.year, gunghapData.partner.month, gunghapData.partner.day)} onChange={(e) => { if(!e.target.value) return; const [y, m, d] = e.target.value.split('-'); setGunghapData(prev => ({...prev, partner: {...prev.partner, year: parseInt(y), month: parseInt(m), day: parseInt(d)}})); }} /></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #BE185D 0%, #9D174D 100%)', color: '#FFF' }} disabled={loading}>{loading ? <><div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#FFF' }}></div> {t.loading}</> : t.btnGunghap}</button>
              </div>
            </form>

            {gunghapResult && (
              <div className="fade-in premium-card" style={{ textAlign: 'center', borderColor: '#FCE7F3', boxShadow: '0 10px 30px rgba(190,24,93,0.05)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#831843', fontSize: '1.3em' }}>풍수 방위 궁합 분석 결과</h3>
                <div style={{ fontSize: '1.8em', fontWeight: '900', color: '#DB2777', textShadow: '2px 2px 0px #FDF2F8', lineHeight: '1.2' }}>{gunghapResult.match_analysis?.result}</div>
                <div style={{ marginTop: '15px', backgroundColor: '#FDF2F8', padding: '16px', borderRadius: '12px', color: '#9D174D', fontWeight: '600', lineHeight: '1.6' }}>"{gunghapResult.match_analysis?.interpretation}"</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ℹ️ 용어 설명 모달 */}
      {modalInfo && (
        <div className="fade-in modal-overlay" style={{ zIndex: 4000 }} onClick={() => setModalInfo(null)}>
          <div style={{ backgroundColor: '#FFF', padding: '25px', borderRadius: '20px', maxWidth: '320px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #F0ECE1', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#1C2536', fontSize: '1.3em', fontWeight: '800' }}>{modalInfo.title}</h3>
              <button onClick={() => setModalInfo(null)} style={{ background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer', color: '#9CA3AF' }}>&times;</button>
            </div>
            <p style={{ margin: 0, lineHeight: '1.7', color: '#4B5563', fontSize: '1em', wordBreak: 'keep-all' }}>{modalInfo.desc}</p>
          </div>
        </div>
      )}
    </>
  );
}