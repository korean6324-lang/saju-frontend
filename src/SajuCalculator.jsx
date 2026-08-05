import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// 💡 Supabase 클라이언트 초기화 (VITE 전용)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 💡 통합 사전 데이터 (절대 수정/삭제 금지 - 줄바꿈 원본 유지)
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
  "지살": "새로운 시작, 이동, 개척을 의미합니다.",
  "년살(도화살)": "매력과 인기, 사교성을 상징합니다.",
  "월살": "메마르고 막힌 환경, 또는 뜻밖의 상속을 의미합니다.",
  "망신살": "비밀이 드러나거나 나서다가 실수함을 주의해야 합니다.",
  "장성살": "무리의 중심이자 리더십, 권위를 상징합니다.",
  "반안살": "출세와 안정, 편안한 지위를 의미합니다.",
  "역마살": "이동, 분주함, 통신과 무역, 넓은 활동 반경을 상징합니다.",
  "육해살": "피곤함이나 스트레스, 영감과 직관력을 의미합니다.",
  "화개살": "예술, 종교, 철학, 학문적 성취와 침잠을 뜻합니다.",
  "겁살": "강제적인 압박이나 빼앗김, 강한 경쟁심을 요합니다.",
  "재살": "꾀가 많고 두뇌 회전이 빠르며 위기 대처 능력이 뛰어납니다.",
  "천살": "불가항력적인 상황이나 높은 이상, 정신적 수양을 상징합니다.",
  "백호대살": "강렬하고 폭발적인 에너지, 강한 프로 의식을 의미합니다.",
  "괴강살": "우두머리 기질, 카리스마, 강한 돌파력을 상징합니다.",
  "천을귀인": "명리학 최고의 길신(수호천사)입니다. 흉살을 길하게 변화시키며 위기에서 구합니다.",
  "홍염살": "타인에게 은근하고 친근한 매력을 발산하여 호감을 주는 기운입니다.",
  "공망": "천간과 지지의 짝이 맞지 않아 비어있음을 뜻합니다. 작용력이 반감됩니다.",
  "장생": "탄생, 후원, 순수함, 길한 시작 에너지입니다.",
  "목욕": "호기심, 멋내기, 불안정하고 반복적인 변화입니다.",
  "관대": "제복, 고집, 독립, 뻗어나가는 힘입니다.",
  "건록": "자수성가, 안정, 독립적 실행력입니다.",
  "제왕": "절정, 카리스마, 독단성, 가장 강한 에너지입니다.",
  "쇠": "노련함, 보수성, 물러남의 기운입니다.",
  "병": "예민함, 동정심, 감수성입니다.",
  "사": "정지, 사색, 한 가지에 몰두하는 에너지입니다.",
  "묘": "저축, 은둔, 안정적인 추구입니다.",
  "절": "단절, 무(無)의 상태, 극단적 변화입니다.",
  "태": "잉태, 조심스럽지만 무한한 가능성입니다.",
  "양": "양육, 보호, 길러지는 기운입니다.",
  "신강(身强)": "나를 돕는 기운이 커서 주관이 뚜렷하고 추진력이 강한 상태입니다.",
  "신약(身弱)": "나의 기운이 약해 환경에 순응력이 좋으나 휘둘리기 쉬운 상태입니다.",
  "용희신": "내 사주의 불균형을 해소하고 나에게 이로움을 주는 긍정적인 운입니다.",
  "기구신": "내 사주의 불균형을 심화시키고 나에게 불리하게 작용하는 주의할 운입니다.",
  "지장간": "지지에 숨겨진 천간으로, 사람의 내면적 잠재력, 속마음을 나타냅니다.",
  "일진": "오늘 하루의 운세를 나타내는 기운으로 원국과 상호작용합니다.",
  "미상": "태어난 시간을 알 수 없어 파악할 수 없습니다.",
  "?": "태어난 시간 미상",
  "지지삼합": "세 지지가 모여 거대한 오행 세력을 형성합니다. 사회적/직업적 연대와 폭발적 성장을 뜻합니다.",
  "지지방합": "같은 계절에 해당하는 지지들이 모인 형제/가족 같은 끈끈한 혈연적/지역적 결속력입니다.",
  "지지반합": "삼합 중 두 글자만 모여 해당 오행을 뚜렷하게 지향하는 연대를 뜻합니다.",
  "천간합화(合化)": "두 천간이 합을 이룰 때, 태어난 계절의 조건이 맞아 완전히 새로운 오행으로 변화하는 강력한 결합입니다.",
  "천간합(기반)": "두 천간이 합을 하였으나 계절을 얻지 못해 성질이 변하지 않고 묶여있는 상태로, 다정함 또는 일의 지연을 뜻합니다.",
  "천간충": "천간의 두 기운이 부딪히는 것으로, 정신적인 스트레스나 가치관의 대립, 투쟁을 의미합니다.",
  "지지육합": "두 지지가 비밀스럽고 다정하게 묶이는 현상으로, 남모르는 유대감이나 안정감을 의미합니다.",
  "지지충": "지지 두 글자가 강하게 충돌하는 현상으로, 이사, 이직, 분리, 사고 등 현실적인 환경의 급격한 변화를 암시합니다.",
  "지지원진": "가까이 있으면 밉고 떨어져 있으면 보고 싶은 애증, 예민함, 감정 소모를 유발하는 관계성입니다.",
  "지지형": "깎고 다듬어 맞추는 과정으로, 수술, 조정, 관재수, 혹은 법/의료/기술적 직업 재능을 의미합니다.",
  "지지자형": "같은 글자가 두 번 겹쳐 발생하는 스스로에 대한 강박, 내면적 스트레스, 고집을 의미합니다.",
  "교운기": "10년마다 바뀌는 대운(큰 환경)이 교차하는 시점입니다. 이 시기 전후로 가치관이나 환경의 큰 변화를 겪게 됩니다.",
  "통관용신(通關用神)": "사주 내 두 세력이 팽팽하게 싸울 때, 그 사이를 부드럽게 소통시키고 이어주는 가장 중요한 중재 기운입니다.",
  "병약용신(病藥用神)": "한 오행이 지나치게 많아 사주에 병(病)이 들었을 때, 그 병을 강력하게 억누르고 치료하는 약(藥)이 되는 기운입니다."
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
    rIljin: "📅 오늘의 운세 (일진)", rPillar: "님의 사주 원국표", rElement: "📊 오행 밸런스 및 타고난 그릇", rStory: "📖 심층 스토리텔링", 
    rDynamic: "⚡ 원국 내 상호작용 및 주의할 운세", rFlow: "🛤️ 운명의 흐름 (대/세/월운)",
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

const CHEONGAN = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const JIJI = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
const getDailyIljin = (year, month, day) => {
  const targetDate = new Date(Date.UTC(year, month, day));
  const baseDate = new Date(Date.UTC(2000, 0, 1)); 
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
  let stemIdx = (4 + diffDays) % 10;
  if (stemIdx < 0) stemIdx += 10;
  let branchIdx = (6 + diffDays) % 12;
  if (branchIdx < 0) branchIdx += 12;
  return [CHEONGAN[stemIdx], JIJI[branchIdx]];
};

const analyzeConstitution = (elementsRatio) => {
  if (!elementsRatio) return { name: "", desc: "", trait: "" };
  const sorted = Object.entries(elementsRatio).sort((a, b) => b[1] - a[1]);
  const strongest = sorted[0][0];
  const waterMetal = (elementsRatio['수'] || 0) + (elementsRatio['금'] || 0);
  const fireWood = (elementsRatio['화'] || 0) + (elementsRatio['목'] || 0);

  if (strongest === '목') return { name: "목(木) 주도형 - 태음인(太陰人) 기질", desc: `간과 담의 기능이 발달하여 흡수하고 수용하는 에너지가 강력한 태음인 기질입니다. 원국 내 목(木) 기운의 발달로 인내심과 끈기가 강하며, 한 번 결심한 일은 우직하게 밀고 나가는 뚝심이 돋보입니다. 다만 에너지가 안으로 정체되기 쉬우므로, 등산이나 땀을 내는 유산소 운동으로 기운을 밖으로 발산시켜야 길(吉)합니다.`, trait: "태음인" };
  if (strongest === '화') return { name: "화(火) 주도형 - 열소양인(熱少陽人) 기질", desc: `심장과 소장의 기능이 발달하여 밖으로 뻗어나가는 양(陽)의 에너지가 폭발적인 열정가 체질입니다. 불의를 참지 못하고 감정 표현이 솔직하며 순간적인 직관력이 매우 뛰어납니다. 열이 상체로 쏠리기 쉬우니 명상과 서늘한 식습관으로 하체를 따뜻하게 하는 수승화강(水昇火降)이 필수적입니다.`, trait: "소양인" };
  if (strongest === '금') return { name: "금(金) 주도형 - 태양인(太陽人) 기질", desc: `폐와 대장의 기운이 강하여 맺고 끊음이 확실한 태양인 기질입니다. 결단력과 통솔력이 뛰어나며 완벽주의 성향과 이상을 향한 추진력이 남다릅니다. 기운이 위로 솟구치고 긴장하기 쉬우므로 하체 근력 운동을 통해 에너지를 아래로 가라앉히는 것이 개운(開運)에 절대적으로 필요합니다.`, trait: "태양인" };
  if (strongest === '수') return { name: "수(水) 주도형 - 한소음인(寒少陰人) 기질", desc: `신장과 방광의 기능이 발달하여 안으로 수렴하고 저장하는 음(陰)의 에너지가 극대화된 체질입니다. 섬세하고 분석적이며 내면의 통찰력과 지혜가 매우 깊습니다. 몸이 냉해지기 쉽고 위장 기능이 약할 수 있으므로, 항상 몸을 보온하고 소화가 잘 되는 따뜻한 성질의 식단이 필수적입니다.`, trait: "소음인" };
  
  if (fireWood > waterMetal) return { name: "토(土) 주도형 - 열을 품은 소양 기질", desc: `비장과 위장의 기능이 중심을 잡고 있으나 내면에 화(火)의 열기를 품은 체질입니다. 사교적이고 타인과의 관계를 부드럽게 조율하는 훌륭한 중재자 역할을 합니다. 스트레스를 받으면 위장 장애로 나타날 수 있으니 규칙적이고 담백한 식습관이 가장 중요합니다.`, trait: "소양인" };
  return { name: "토(土) 주도형 - 냉을 품은 소음 기질", desc: `비장과 위장의 기운이 주도하지만 수(水)의 한기를 띄어 속이 차가워지기 쉬운 신중한 체질입니다. 섬세하게 주변을 잘 챙기는 든든한 성향이나, 생각이 너무 많아 실천이 늦어질 수 있습니다. 찬 음식과 찬 바람을 피하고 몸의 보온에 각별히 신경 써야 에너지가 살아납니다.`, trait: "소음인" };
};

const getConstitutionCompatText = (meTrait, ptTrait) => {
  if (!meTrait || !ptTrait) return "";
  if (meTrait !== ptTrait) {
      if ((meTrait === "소음인" && ptTrait === "소양인") || (meTrait === "소양인" && ptTrait === "소음인")) {
          return "명리학적 수화기제(水火旣濟)의 형상입니다. 한소음인의 차가운 응축 에너지와 열소양인의 뜨거운 발산 에너지가 만나 완벽한 생리적 조후(온도) 균형을 이룹니다. 서로의 면역력과 생체 에너지를 강하게 보완해주는 최상위 체질 궁합입니다.";
      }
      if ((meTrait === "태음인" && ptTrait === "태양인") || (meTrait === "태양인" && ptTrait === "태음인")) {
          return "수용(태음)과 발산(태양)의 기운이 만나 완벽한 상호 보완을 이룹니다. 기운이 막히기 쉬운 태음인과 뻗어나가려는 태양인이 함께할 때 신체적 시너지가 극대화되는 멋진 조합입니다.";
      }
      return `서로 다른 체질(${meTrait}와 ${ptTrait})이 만나 다채로운 에너지를 교류합니다. 음양의 조화가 무난하며 서로의 다름이 흥미로운 매력으로 작용하는 관계입니다. 상호 배려를 통해 안정감을 높일 수 있습니다.`;
  }
  return `두 분 모두 '${meTrait}'으로 체질이 같습니다. 바이오리듬과 식성이 비슷하여 생활의 주파수를 맞추기 편안하지만, 특정 오행의 기운이 과도하게 쏠려 기운이 편중될 수 있으므로 건강 관리에 함께 유의해야 합니다.`;
};

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
  .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-top: 5px; }
  .calendar-day-header { text-align: center; font-size: 0.8em; font-weight: bold; color: #6B7280; padding-bottom: 8px; border-bottom: 1px solid #EFECE6; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
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

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentCalDate, setCurrentCalDate] = useState(new Date());

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

  const [showRectifyModal, setShowRectifyModal] = useState(false);
  const [rectifyData, setRectifyData] = useState({ q1: 'A', q2: 'A' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalInfo, setModalInfo] = useState(null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setUser(session?.user || null);
      if (session?.user) fetchMyData(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setUser(session?.user || null);
      if (session?.user) fetchMyData(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchMyData = async (userId) => {
    try {
      const { data: myData } = await supabase.from('my_saju').select('*').eq('user_id', userId).order('id', { ascending: false }).limit(1).single();
      if (myData) {
        const myParsed = {
          name: myData.name || '', birthPlace: myData.birth_place || 'KR_SEO', year: myData.birth_year || 1990, month: myData.birth_month || 5, day: myData.birth_day || 15,
          hour: myData.birth_hour || 14, minute: myData.birth_minute || 30, gender: myData.gender || 'M', is_lunar: myData.is_lunar || false, is_leap_month: myData.is_leap_month || false, is_time_unknown: myData.is_time_unknown || false
        };
        setFormData(myParsed);
        setIsTimeUnknown(myParsed.is_time_unknown);
        setGunghapData(prev => ({ ...prev, me: myParsed }));
      }

      const { data: ptData } = await supabase.from('partner_saju').select('*').eq('user_id', userId).order('id', { ascending: false }).limit(1).single();
      if (ptData) {
        const ptParsed = {
          name: ptData.name || '', birthPlace: ptData.birth_place || 'KR_SEO', year: ptData.birth_year || 1995, month: ptData.birth_month || 8, day: ptData.birth_day || 20,
          hour: ptData.birth_hour || 10, minute: ptData.birth_minute || 0, gender: ptData.gender || 'F', is_lunar: ptData.is_lunar || false, is_leap_month: ptData.is_leap_month || false, is_time_unknown: ptData.is_time_unknown || false
        };
        setGunghapData(prev => ({ ...prev, partner: ptParsed }));
      }
    } catch (error) { console.log("저장된 정보가 없습니다."); }
  };

  const handleSaveData = async () => {
    if (!user) return alert("로그인이 필요합니다.");
    try {
      const { data: existing } = await supabase.from('my_saju').select('id').eq('user_id', user.id).single();
      const payload = {
        user_id: user.id, name: formData.name, gender: formData.gender, birth_place: formData.birthPlace,
        birth_year: formData.year, birth_month: formData.month, birth_day: formData.day,
        birth_hour: formData.hour, birth_minute: formData.minute, is_lunar: formData.is_lunar,
        is_leap_month: formData.is_leap_month, is_time_unknown: isTimeUnknown
      };
      if (existing) await supabase.from('my_saju').update(payload).eq('id', existing.id);
      else await supabase.from('my_saju').insert([payload]);
      alert("💾 내 사주 정보가 안전하게 저장되었습니다!");
    } catch (error) { alert("저장 중 오류가 발생했습니다."); }
  };

  const handleSaveGunghapData = async () => {
    if (!user) return alert("로그인이 필요합니다.");
    try {
      const { data: myExisting } = await supabase.from('my_saju').select('id').eq('user_id', user.id).single();
      const myPayload = { user_id: user.id, name: gunghapData.me.name, gender: gunghapData.me.gender, birth_place: gunghapData.me.birthPlace, birth_year: gunghapData.me.year, birth_month: gunghapData.me.month, birth_day: gunghapData.me.day, birth_hour: gunghapData.me.hour, birth_minute: gunghapData.me.minute, is_lunar: gunghapData.me.is_lunar, is_leap_month: gunghapData.me.is_leap_month, is_time_unknown: gunghapData.me.is_time_unknown };
      if (myExisting) await supabase.from('my_saju').update(myPayload).eq('id', myExisting.id); else await supabase.from('my_saju').insert([myPayload]);

      const { data: ptExisting } = await supabase.from('partner_saju').select('id').eq('user_id', user.id).single();
      const ptPayload = { user_id: user.id, name: gunghapData.partner.name, gender: gunghapData.partner.gender, birth_place: gunghapData.partner.birthPlace, birth_year: gunghapData.partner.year, birth_month: gunghapData.partner.month, birth_day: gunghapData.partner.day, birth_hour: gunghapData.partner.hour, birth_minute: gunghapData.partner.minute, is_lunar: gunghapData.partner.is_lunar, is_leap_month: gunghapData.partner.is_leap_month, is_time_unknown: gunghapData.partner.is_time_unknown };
      if (ptExisting) await supabase.from('partner_saju').update(ptPayload).eq('id', ptExisting.id); else await supabase.from('partner_saju').insert([ptPayload]);

      alert("💖 궁합 정보가 모두 저장되었습니다!");
    } catch (error) { alert("저장 중 오류가 발생했습니다."); }
  };

  const handleSocialLogin = async (providerName) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: providerName });
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

  const handleSajuSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setResult(null);
    try {
      const locData = GLOBAL_LOCATIONS.find(loc => loc.id === formData.birthPlace);
      const payload = { ...formData, is_time_unknown: isTimeUnknown, longitude: locData.lon, timezone: locData.tz, lang: lang };
      const response = await axios.post('https://saju-backend-ffum.onrender.com/api/saju', payload);
      setResult(response.data);
    } catch (err) { setError(err.response?.data?.detail || '서버 연결 에러가 발생했습니다.'); } finally { setLoading(false); }
  };

  const handleGunghapSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setGunghapResult(null);
    try {
      const meLoc = GLOBAL_LOCATIONS.find(loc => loc.id === gunghapData.me.birthPlace);
      const ptLoc = GLOBAL_LOCATIONS.find(loc => loc.id === gunghapData.partner.birthPlace);
      
      const ghPayload = { me: { ...gunghapData.me, longitude: meLoc.lon, timezone: meLoc.tz }, partner: { ...gunghapData.partner, longitude: ptLoc.lon, timezone: ptLoc.tz }, lang: lang };
      const ghResponse = await axios.post('https://saju-backend-ffum.onrender.com/api/gunghap', ghPayload);
      
      const mePayload = { ...gunghapData.me, is_time_unknown: gunghapData.me.is_time_unknown, longitude: meLoc.lon, timezone: meLoc.tz, lang: lang };
      const ptPayload = { ...gunghapData.partner, is_time_unknown: gunghapData.partner.is_time_unknown, longitude: ptLoc.lon, timezone: ptLoc.tz, lang: lang };
      const [meRes, ptRes] = await Promise.all([
        axios.post('https://saju-backend-ffum.onrender.com/api/saju', mePayload),
        axios.post('https://saju-backend-ffum.onrender.com/api/saju', ptPayload)
      ]);

      const meConst = analyzeConstitution(meRes.data.elements_ratio);
      const ptConst = analyzeConstitution(ptRes.data.elements_ratio);
      const compatText = getConstitutionCompatText(meConst.trait, ptConst.trait);

      let prof_advice = "두 분의 관계를 더욱 단단하게 만드는 전문가 개운법 솔루션입니다. ";
      if (ghResponse.data.score >= 80) prof_advice += "천우신조의 궁합입니다. 내가 부족한 기운을 상대가 넉넉히 채워주며, 상호 보완의 시너지가 극대화됩니다. 함께 재테크나 미래의 목표를 공유하고 공동의 프로젝트를 설계하면 폭발적인 발전이 있습니다. 서로에 대한 신뢰가 깊으니 과감하게 추진해도 좋습니다.";
      else if (ghResponse.data.score >= 60) prof_advice += "서로의 다름이 긍정적 자극으로 작용하는 관계입니다. 음양오행의 조율이 원만하나, 때로는 가치관의 차이가 발생할 수 있습니다. 각자의 고유한 성향을 통제하려 하지 말고 '그럴 수 있다'는 포용의 자세가 필요합니다. 대화의 시간을 자주 가지고 가벼운 취미를 공유하면 유대감이 훨씬 단단해집니다.";
      else prof_advice += "서로 다른 주파수를 맞추어가는 세심한 배려가 필요한 궁합입니다. 다름이 스트레스가 아닌 '배울 점'이라 생각하는 시각의 전환이 개운(開運)의 핵심입니다. 각자의 사생활과 영역을 철저히 존중하고, 갈등 시 즉각적인 논쟁을 피하며 주기적으로 각자만의 힐링 타임을 가지는 것을 적극 권장합니다.";

      const fallbackElement = `${meConst.name} 기운과 ${ptConst.name} 기운이 교차하며 상호 온도(조후)와 강약(억부)의 균형을 맞추는 흐름입니다. 오행의 상생상극 작용을 통해 서로의 부족한 점을 채워줍니다.`;
      const fallbackHeavenly = `천간의 기운이 서로 작용하여 정신적인 유대감과 가치관의 교류를 형성합니다. 이상적인 목표를 향해 시너지를 낼 수 있는 긍정적인 정신적 결속입니다.`;
      const fallbackEarthly = `지지의 현실적인 환경이 맞물려 물리적인 융합과 현실적 기반을 단단하게 다집니다. 서로의 삶에 실질적인 도움을 주는 끈끈한 인연입니다.`;

      setGunghapResult({
        ...ghResponse.data,
        me_info: { constitution_name: meConst.name, constitution_desc: meConst.desc },
        partner_info: { constitution_name: ptConst.name, constitution_desc: ptConst.desc },
        constitution_compat: compatText,
        professional_advice: prof_advice,
        element_complement: ghResponse.data.element_complement || fallbackElement,
        heavenly_desc: ghResponse.data.heavenly_desc || fallbackHeavenly,
        earthly_desc: ghResponse.data.earthly_desc || fallbackEarthly,
      });

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

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const renderCalendarDays = () => {
    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '5px' }}></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
      
      const [iljinStem, iljinBranch] = getDailyIljin(year, month, i);

      let lunarStr = "";
      try {
        const rawLunar = new Intl.DateTimeFormat('ko-KR-u-ca-chinese', { month: 'numeric', day: 'numeric' }).format(new Date(year, month, i));
        const nums = rawLunar.match(/\d+/g);
        if (nums && nums.length >= 2) {
           lunarStr = `${nums[nums.length-2]}.${nums[nums.length-1]}`;
        }
      } catch(e) {}

      days.push(
        <div key={i} style={{ 
          padding: '4px 2px', textAlign: 'center', border: '1px solid #EFECE6', borderRadius: '8px', 
          backgroundColor: isToday ? '#FFFBEB' : '#FFF', color: isToday ? '#B59960' : '#1C2536', 
          boxShadow: isToday ? '0 0 0 2px #D4AF37' : 'none',
          display: 'flex', flexDirection: 'column', gap: '3px'
        }}>
          <div style={{ fontSize: '0.75em', fontWeight: isToday ? 'bold' : 'normal' }}>{i}</div>
          <div style={{ fontSize: '0.55em', color: '#9CA3AF' }}>음{lunarStr}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', fontSize: '0.85em', fontWeight: '800' }}>
            <span onClick={(e) => { e.stopPropagation(); openModal(iljinStem); }} style={{ color: getElementColor(iljinStem), cursor: 'pointer' }}>{iljinStem}</span>
            <span onClick={(e) => { e.stopPropagation(); openModal(iljinBranch); }} style={{ color: getElementColor(iljinBranch), cursor: 'pointer' }}>{iljinBranch}</span>
          </div>
        </div>
      );
    }
    return days;
  };

  const changeMonth = (offset) => {
    setCurrentCalDate(new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() + offset, 1));
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

          <button className="social-btn btn-kakao" onClick={() => handleSocialLogin('kakao')}>💬 {t.loginKakao}</button>
          <button className="social-btn btn-naver" onClick={() => handleSocialLogin('naver')}>N {t.loginNaver}</button>
          <button className="social-btn btn-google" onClick={() => handleSocialLogin('google')}>G {t.loginGoogle}</button>
          <button className="social-btn btn-apple" onClick={() => handleSocialLogin('apple')}> {t.loginApple}</button>
          <button className="social-btn btn-github" onClick={() => handleSocialLogin('github')}>
            🐙 깃허브로 로그인 (GitHub)
          </button>

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FFF', border: '1px solid #EFECE6', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', fontSize: '1.2em', cursor: 'pointer' }}>
                {lang === 'ko' ? '🇰🇷' : lang === 'en' ? '🇺🇸' : lang === 'ja' ? '🇯🇵' : lang === 'zh' ? '🇨🇳' : '🇪🇸'}
              </div>
              <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', appearance: 'none' }}>
                <option value="ko">🇰🇷 한국어</option><option value="en">🇺🇸 English</option><option value="ja">🇯🇵 日本語</option><option value="zh">🇨🇳 中文</option><option value="es">🇪🇸 Español</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>

      {/* 🌟 사이드바 메뉴 🌟 */}
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2 style={{ margin: 0, fontSize: '1.5em', color: '#1C2536', fontWeight: '900' }}>{t.appTitle}<span style={{ color: '#B59960' }}>-PRO</span></h2>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style={{ paddingBottom: '5px' }}>
          <button className="menu-nav-btn" onClick={() => { setActiveTab('saju'); setIsMenuOpen(false); }}>{t.tabSaju}</button>
          <button className="menu-nav-btn" onClick={() => { setActiveTab('gunghap'); setIsMenuOpen(false); }}>{t.tabGunghap}</button>
          <button className="menu-nav-btn" onClick={() => { setShowCalendarModal(true); setIsMenuOpen(false); }}>{t.menuCalendar}</button>
        </div>

        <div className="menu-content">
          <div className="menu-box">
            <h4 className="accordion-title" onClick={() => setIsWhyProOpen(!isWhyProOpen)}>
              <span>{t.menuWhy}</span>
              <svg className={`accordion-icon ${isWhyProOpen ? 'open' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </h4>
            {isWhyProOpen && (
              <ul className="feature-list fade-in">
                <li><strong>진태양시 정밀 적용:</strong> 글로벌 출생지의 경도(Longitude)를 계산하여 시차와 1분 1초의 오차까지 완벽하게 보정합니다.</li>
                <li><strong>합화(合化) 정밀 판별:</strong> 단순 글자 합이 아닌 태어난 계절의 세력을 반영한 입체적인 기운 변화를 예측합니다.</li>
                <li><strong>통관/병약 용신 분석:</strong> 사주 내 병(病)과 약(藥)을 파악하여 가장 필요한 기운을 찾아내는 최상위 전문가 로직을 탑재했습니다.</li>
              </ul>
            )}
          </div>
          <div className="subscribe-banner">
            <span className="subscribe-tag">COMING SOON</span>
            <h4 style={{ margin: '0 0 8px 0', color: '#0369A1', fontSize: '1em' }}>{t.menuSub}</h4>
            <p style={{ margin: 0, fontSize: '0.85em', color: '#0F172A', lineHeight: '1.5' }}>오늘의 운세와 이달의 운세를 매일 아침 전송해 드립니다. <br/><strong>👉 카카오톡 / 텔레그램 연동 예정</strong></p>
          </div>
        </div>
        <div className="menu-footer">
          <div style={{ fontWeight: '700', color: '#4B5563', marginBottom: '12px' }}>{t.menuContact}</div>
          <div className="contact-item"><span>📧</span> abc@gmail.com</div>
          <div className="contact-item"><span>💬</span> 카카오톡: myeongri_pro</div>
          <div className="contact-item"><span>✈️</span> 텔레그램: @myeongri_pro</div>
          <div className="contact-item" style={{ marginTop: '20px', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleLogout}>🔓 로그아웃</div>
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px', paddingBottom: '60px' }}>
        
        {/* 🚨 테스트용 구독 권한 토글 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <button onClick={() => {
            if(userTier === 'trial') setUserTier('expired');
            else if(userTier === 'expired') setUserTier('premium');
            else setUserTier('trial');
          }} 
          style={{ 
            backgroundColor: userTier === 'premium' ? '#FFFBEB' : userTier === 'expired' ? '#FEF2F2' : '#F0FDF4', 
            border: userTier === 'premium' ? '1px solid #FCD34D' : userTier === 'expired' ? '1px solid #FECACA' : '1px solid #BBF7D0', 
            color: userTier === 'premium' ? '#B45309' : userTier === 'expired' ? '#DC2626' : '#166534', 
            padding: '6px 16px', borderRadius: '20px', fontSize: '0.8em', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s'
          }}>
            {userTier === 'premium' ? t.tierPremium : userTier === 'expired' ? t.tierExpired : t.tierTrial} (클릭하여 상태 변경)
          </button>
        </div>

        {/* 메인 헤더 & 언어팩 아이콘 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px', marginBottom: '25px' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FFF', border: '1px solid #EFECE6', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', fontSize: '1.2em', cursor: 'pointer' }}>
                {lang === 'ko' ? '🇰🇷' : lang === 'en' ? '🇺🇸' : lang === 'ja' ? '🇯🇵' : lang === 'zh' ? '🇨🇳' : '🇪🇸'}
              </div>
              <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', appearance: 'none' }}>
                <option value="ko">🇰🇷 한국어</option><option value="en">🇺🇸 English</option><option value="ja">🇯🇵 日本語</option><option value="zh">🇨🇳 中文</option><option value="es">🇪🇸 Español</option>
              </select>
            </div>
          </div>
          <div style={{ textAlign: 'center', flex: 2 }}>
            <h2 style={{ margin: 0, fontSize: '2em', color: '#1C2536', fontWeight: '900', letterSpacing: '-0.5px' }}>{t.appTitle}<span style={{ color: '#B59960' }}>-PRO</span></h2>
            <p style={{ margin: '6px 0 0', color: '#6B7280', fontSize: '0.8em', fontWeight: '600', wordBreak: 'keep-all' }}>{t.appSubtitle}</p>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setIsMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1C2536" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>
        
        {/* 탭 버튼 */}
        <div style={{ display: 'flex', backgroundColor: '#EFECE6', borderRadius: '12px', padding: '6px', marginBottom: '20px' }}>
          <button onClick={() => {setActiveTab('saju'); setError('');}} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '1em', backgroundColor: activeTab === 'saju' ? '#FFFFFF' : 'transparent', color: activeTab === 'saju' ? '#1C2536' : '#9CA3AF', boxShadow: activeTab === 'saju' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}>{t.tabSaju}</button>
          <button onClick={() => {setActiveTab('gunghap'); setError('');}} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '1em', backgroundColor: activeTab === 'gunghap' ? '#FFFFFF' : 'transparent', color: activeTab === 'gunghap' ? '#B59960' : '#9CA3AF', boxShadow: activeTab === 'gunghap' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}>{t.tabGunghap}</button>
        </div>

        {error && <div className="fade-in" style={{ padding: '16px', backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', color: '#991B1B', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>{error}</div>}

        {/* ========================================================
            [1] 개인 사주 탭
        ======================================================== */}
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

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: '1 1 100px' }}><label className="label-text">{t.cal}</label>
                  <select className="input-field" onChange={(e) => setFormData({ ...formData, is_lunar: e.target.value.includes('lunar'), is_leap_month: e.target.value === 'lunar_leap' })} value={!formData.is_lunar ? 'solar' : formData.is_leap_month ? 'lunar_leap' : 'lunar'}>
                    <option value="solar">{t.solar}</option><option value="lunar">{t.lunar}</option><option value="lunar_leap">{t.lunarLeap}</option>
                  </select>
                </div>
                <div style={{ flex: '2 1 180px' }}><label className="label-text">{t.loc}</label>
                  <select className="input-field" value={formData.birthPlace} onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}>
                    {GLOBAL_LOCATIONS.map(loc => ( <option key={loc.id} value={loc.id}>{loc.label}</option> ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                <div style={{ flex: '1 1 140px' }}><label className="label-text">{t.bDate}</label><input type="date" className="input-field" required value={formatDate(formData.year, formData.month, formData.day)} onChange={(e) => { if(!e.target.value) return; const [y, m, d] = e.target.value.split('-'); setFormData({...formData, year: parseInt(y), month: parseInt(m), day: parseInt(d)}); }} /></div>
                <div style={{ flex: '1 1 120px', opacity: isTimeUnknown ? 0.4 : 1, transition: 'opacity 0.3s' }}><label className="label-text">{t.bTime}</label><input type="time" className="input-field" disabled={isTimeUnknown} value={formatTime(formData.hour, formData.minute)} onChange={(e) => { if(!e.target.value) return; const [h, min] = e.target.value.split(':'); setFormData({...formData, hour: parseInt(h), minute: parseInt(min)}); }} /></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', padding: '12px', backgroundColor: '#F9F8F6', borderRadius: '10px' }}>
                <label style={{ fontSize: '0.9em', color: '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                  <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#B59960' }} checked={isTimeUnknown} onChange={(e) => setIsTimeUnknown(e.target.checked)} /> {t.timeUnk}
                </label>
                <button type="button" onClick={() => setShowRectifyModal(true)} style={{ padding: '8px 16px', backgroundColor: '#FFF', color: '#B59960', border: '1px solid #D4AF37', borderRadius: '8px', fontSize: '0.85em', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 5px rgba(212,175,55,0.1)' }}>{t.btnRect}</button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2 }}>{loading ? <><div className="spinner"></div> {t.loading}</> : t.btnSaju}</button>
                <button type="button" onClick={handleSaveData} className="btn-primary" style={{ flex: 1, background: '#F3F4F6', color: '#1C2536', border: '1px solid #E2DED5', boxShadow: 'none' }}>💾 내 정보 저장</button>
              </div>
            </form>

            {/* 결과 렌더링 */}
            {result && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. 일진 (기본 제공) */}
                {result.iljin && (
                  <div className="premium-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                    <div>
                      <div style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#0369A1', marginBottom: '4px', cursor: 'pointer' }} onClick={() => openModal("일진")}>{t.rIljin}</div>
                      <div style={{ fontSize: '1.2em', fontWeight: '800', color: '#0F172A' }}>{result.iljin.date}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div onClick={() => openModal(result.iljin.ganji?.[0])} style={{ fontSize: '1.6em', fontWeight: '900', color: getElementColor(result.iljin.ganji?.[0]), cursor: 'pointer', lineHeight: '1.2' }}>{result.iljin.ganji?.[0]}</div>
                        <div onClick={() => openModal(result.iljin.sipseong?.[0])} style={{ fontSize: '0.75em', color: '#64748B', cursor: 'pointer' }}>{result.iljin.sipseong?.[0]}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div onClick={() => openModal(result.iljin.ganji?.[1])} style={{ fontSize: '1.6em', fontWeight: '900', color: result.iljin.is_gongmang ? '#EF4444' : getElementColor(result.iljin.ganji?.[1]), cursor: 'pointer', lineHeight: '1.2' }}>{result.iljin.ganji?.[1]}</div>
                        <div onClick={() => openModal(result.iljin.sipseong?.[1])} style={{ fontSize: '0.75em', color: '#64748B', cursor: 'pointer' }}>{result.iljin.sipseong?.[1]}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. 사주 원국표 (기본 제공) */}
                <div className="premium-card">
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2em', color: '#1C2536', borderBottom: '2px solid #F0ECE1', paddingBottom: '10px' }}>
                    <span style={{ color: '#B59960' }}>{formData.name || 'User'}</span>{t.rPillar}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                    {['년주', '월주', '일주', '시주'].map((pillarKey) => {
                      const data = result.pillars?.[pillarKey] || { ganji: ['?', '?'], sipseong: ['?', '?'], sinsal: [], jijanggan: [] }; 
                      const isUnknown = data.ganji?.[0] === '?';
                      return (
                        <div key={pillarKey} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#FDFCFB', padding: '20px 5px', borderRadius: '12px', border: '1px solid #EFECE6', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                          <div style={{ fontSize: '0.8em', color: '#9CA3AF', fontWeight: '700', marginBottom: '12px' }}>{pillarKey}</div>
                          <div style={{ textAlign: 'center', marginBottom: '15px' }}><div onClick={() => !isUnknown && openModal(data.ganji?.[0])} style={{ fontSize: '2em', fontWeight: '900', color: getElementColor(data.ganji?.[0]), cursor: isUnknown ? 'default' : 'pointer', lineHeight: '1.1' }}>{data.ganji?.[0]}</div><div onClick={() => !isUnknown && openModal(data.sipseong?.[0])} style={{ fontSize: '0.8em', color: '#6B7280', cursor: isUnknown ? 'default' : 'pointer', marginTop: '6px' }}>{data.sipseong?.[0]}</div></div>
                          <div style={{ width: '40px', height: '1px', backgroundColor: '#E5E0D8', margin: '5px 0 15px 0' }} />
                          <div style={{ textAlign: 'center', marginBottom: '15px' }}><div onClick={() => !isUnknown && openModal(data.ganji?.[1])} style={{ fontSize: '2em', fontWeight: '900', color: data.is_gongmang ? '#EF4444' : getElementColor(data.ganji?.[1]), cursor: isUnknown ? 'default' : 'pointer', lineHeight: '1.1' }}>{data.ganji?.[1]}</div><div onClick={() => !isUnknown && openModal(data.sipseong?.[1])} style={{ fontSize: '0.8em', color: '#6B7280', cursor: isUnknown ? 'default' : 'pointer', marginTop: '6px' }}>{data.sipseong?.[1]}</div></div>
                          {!isUnknown && (
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '10px', cursor: 'pointer' }} title="지장간"><span style={{ fontSize: '0.65em', color: '#94A3B8' }} onClick={() => openModal("지장간")}>[</span>{(data.jijanggan || []).map((gan, idx) => <span key={idx} onClick={() => openModal(gan)} style={{ fontSize: '0.75em', color: '#6B7280', fontWeight: '600' }}>{gan}</span>)}<span style={{ fontSize: '0.65em', color: '#94A3B8' }} onClick={() => openModal("지장간")}>]</span></div>
                          )}
                          {!isUnknown && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', alignItems: 'center' }}>
                              {data.shipi && data.shipi !== "-" && <span onClick={() => openModal(data.shipi)} style={{ fontSize: '0.65em', padding: '3px 8px', backgroundColor: '#E0F2FE', color: '#1E3A8A', borderRadius: '4px', cursor: 'pointer' }}>{data.shipi}</span>}
                              {data.is_gongmang && <span onClick={() => openModal("공망")} style={{ fontSize: '0.65em', padding: '3px 8px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '4px', cursor: 'pointer' }}>공망</span>}
                              {(data.sinsal || []).map((sal, idx) => {
                                let bg = '#F3F4F6', color = '#475569', border = '#E2E8F0';
                                if (sal.includes('대살') || sal.includes('괴강')) { bg = '#FFEBEE'; color = '#C62828'; border = '#FFCDD2'; } else if (sal.includes('천을귀인')) { bg = '#FFF8E1'; color = '#F57F17'; border = '#FFECB3'; } 
                                return <span key={idx} onClick={() => openModal(sal)} style={{ fontSize: '0.65em', padding: '3px 8px', backgroundColor: bg, color: color, borderRadius: '4px', border: `1px solid ${border}`, cursor: 'pointer' }}>{sal}</span>;
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. 오행 분포도 및 🌟복구된 신강신약(용신)🌟 */}
                <div className="premium-card">
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2em', color: '#1C2536' }}>{t.rElement}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
                    {Object.entries(result.elements_ratio || {}).map(([element, ratio]) => (
                      <div key={element} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong onClick={() => openModal(element)} style={{ cursor: 'pointer', width: '20px', color: getElementColor(element) }}>{element}</strong>
                        <div style={{ flex: 1, backgroundColor: '#F1F5F9', height: '10px', borderRadius: '5px', overflow: 'hidden' }}><div style={{ width: `${ratio}%`, backgroundColor: getElementColor(element), height: '100%', borderRadius: '5px', transition: 'width 0.8s ease' }}></div></div>
                        <span style={{ fontSize: '0.85em', color: '#64748B', width: '35px', textAlign: 'right' }}>{ratio}%</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* 타고난 그릇 (격국) */}
                  <div style={{ backgroundColor: '#FDFBFB', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#64748B' }}>타고난 그릇 (격국)</span><span style={{ fontSize: '1.2em', fontWeight: '800', color: '#D97706' }}>{result.gyeokguk?.name}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95em', color: '#334155', lineHeight: '1.5' }}>{result.gyeokguk?.description}</p>
                  </div>

                  {/* 🌟 완벽하게 복구된 신강/신약 및 용희신 분석 영역 🌟 */}
                  {result.yongshin && (
                    <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', marginTop: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#475569' }}>사주의 강약 (억부)</span>
                        <span onClick={() => openModal(result.yongshin?.strength)} style={{ fontSize: '1.2em', fontWeight: '800', color: '#0369A1', cursor: 'pointer' }}>{result.yongshin?.strength}</span>
                      </div>
                      <p style={{ margin: '0 0 15px 0', fontSize: '0.95em', color: '#334155', lineHeight: '1.5' }}>{result.yongshin?.description}</p>
                      
                      <div style={{ display: 'flex', gap: '10px', fontSize: '0.85em' }}>
                        <div style={{ flex: 1, backgroundColor: '#FFF', padding: '12px', borderRadius: '8px', border: '1px solid #D1FAE5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                          <strong style={{ color: '#059669', display: 'block', marginBottom: '6px' }}>👍 나에게 이로운 기운</strong>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {(result.yongshin?.yong_hee || []).map((el, i) => (
                              <span key={i} onClick={() => openModal(el)} style={{ color: getElementColor(el), fontWeight: 'bold', cursor: 'pointer', padding: '2px 6px', backgroundColor: '#F0FDF4', borderRadius: '4px' }}>{el}</span>
                            ))}
                          </div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#FFF', padding: '12px', borderRadius: '8px', border: '1px solid #FEE2E2', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                          <strong style={{ color: '#DC2626', display: 'block', marginBottom: '6px' }}>⚠️ 주의해야 할 기운</strong>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {(result.yongshin?.gi_gu || []).map((el, i) => (
                              <span key={i} onClick={() => openModal(el)} style={{ color: getElementColor(el), fontWeight: 'bold', cursor: 'pointer', padding: '2px 6px', backgroundColor: '#FEF2F2', borderRadius: '4px' }}>{el}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* 특수 용신 (통관/병약) */}
                      {result.yongshin?.special_type && (
                        <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#FFFBEB', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                          <strong onClick={() => openModal(result.yongshin.special_type)} style={{ color: '#D97706', display: 'block', marginBottom: '6px', cursor: 'pointer', textDecoration: 'underline' }}>⭐ 특수 처방: {result.yongshin.special_type}</strong>
                          <span style={{ fontSize: '0.9em', color: '#92400E', lineHeight: '1.4', display: 'block' }}>{result.yongshin.special_desc}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 🚨 여기서부터 프리미엄 Paywall 영역 (심층 분석) 🚨 */}
                <div className="locked-section">
                  <div className={userTier === 'expired' ? 'locked-blur' : ''}>
                    
                    {/* 4. 심층 스토리텔링 */}
                    <div className="premium-card">
                      <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2em', color: '#1C2536', borderBottom: '2px solid #F0ECE1', paddingBottom: '10px' }}>{t.rStory}</h3>
                      <div style={{ marginBottom: '20px' }}><h4 style={{ margin: '0 0 8px 0', color: '#B59960', fontSize: '1em' }}>타고난 성향과 에너지</h4><p style={{ margin: 0, fontSize: '0.95em', color: '#4B5563', lineHeight: '1.7' }}>{result.interpretation?.five_elements_desc}</p></div>
                      <div style={{ marginBottom: '20px' }}><h4 style={{ margin: '0 0 8px 0', color: '#B59960', fontSize: '1em' }}>활동성과 직업/재물운</h4><p style={{ margin: 0, fontSize: '0.95em', color: '#4B5563', lineHeight: '1.7' }}>{result.interpretation?.movement_luck} <br/><br/> {result.interpretation?.job_wealth_desc}</p></div>
                      <div style={{ backgroundColor: '#F9F8F6', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #B59960' }}><h4 style={{ margin: '0 0 8px 0', color: '#1C2536', fontSize: '0.95em' }}>🍀 나만의 행운 솔루션</h4><p style={{ margin: 0, fontSize: '0.9em', color: '#4B5563', lineHeight: '1.6' }}><strong>행운의 색상:</strong> {result.interpretation?.lucky_color} <br/><strong>길한 방향:</strong> {result.interpretation?.lucky_direction} <br/><strong>추천 아이템:</strong> {result.interpretation?.lucky_item}</p></div>
                    </div>

                    {/* 5. 상호작용 및 다이내믹 운세 */}
                    <div className="premium-card">
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2em', color: '#1C2536' }}>{t.rDynamic}</h3>
                      <div style={{ marginBottom: '20px' }}>
                        {(result.relations || []).length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(result.relations || []).map((rel, idx) => {
                              const isHaphwa = rel.type && rel.type.includes('합화');
                              return (
                                <div key={idx} style={{ borderLeft: `4px solid ${isHaphwa ? '#8B5CF6' : (rel.name && rel.name.includes('합')) ? '#10B981' : '#EF4444'}`, padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><strong onClick={() => openModal(rel.type)} style={{ fontSize: '0.95em', color: '#1E293B', cursor: 'pointer', textDecoration: 'underline' }}>{rel.name} <span style={{ fontSize: '0.8em', color: '#64748B', fontWeight: 'normal', textDecoration: 'none' }}>({rel.type})</span></strong><span style={{ fontSize: '0.85em', color: '#3B82F6', fontWeight: '700' }}>[{(rel.positions || []).join(' ↔ ')}]</span></div>
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
                              const isHighlight = (rel.un_types || []).includes('오늘 일진') || (rel.un_types || []).includes('이달의 월운');
                              return (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: isHighlight ? '#EFF6FF' : '#FFF', border: isHighlight ? '1px solid #BFDBFE' : '1px solid #FEF3C7', padding: '12px', borderRadius: '8px' }}>
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}><span onClick={() => openModal(rel.type)} style={{ fontSize: '0.85em', fontWeight: 'bold', color: isHighlight ? '#0369A1' : '#92400E', cursor: 'pointer', textDecoration: 'underline' }}>{rel.name}</span><span style={{ fontSize: '0.7em', padding: '3px 8px', backgroundColor: isHighlight ? '#DBEAFE' : '#FEF3C7', color: isHighlight ? '#1D4ED8' : '#B45309', borderRadius: '4px' }}>{(rel.un_types || []).join(' & ')}</span></div>
                                  <p style={{ margin: 0, fontSize: '0.9em', color: '#451A03', lineHeight: '1.4' }}><strong style={{ color: isHighlight ? '#0284C7' : '#D97706' }}>[{rel.target_pillar}]</strong> {rel.description}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 6. 흐름표 (대/세/월운) */}
                    <div className="premium-card" style={{ marginBottom: 0 }}>
                      <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2em', color: '#1C2536' }}>{t.rFlow}</h3>
                      {result.wolun && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ margin: '0 0 10px 0', fontSize: '1em', color: '#4B5563' }}>🌙 이달의 운세 (올해의 월운)</h4>
                          <div className="horizontal-scroll">
                            {(result.wolun || []).map((wun, idx) => (
                              <div key={idx} style={{ minWidth: '65px', padding: '12px 4px', border: wun.is_current ? '2px solid #8B5CF6' : '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center', backgroundColor: wun.is_current ? '#F5F3FF' : '#FFF' }}>
                                <div style={{ fontSize: '0.75em', color: '#64748B', marginBottom: '6px', fontWeight: wun.is_current ? 'bold' : 'normal' }}>{wun.month}월</div>
                                <div onClick={() => openModal(wun.ganji?.[0])} style={{ fontSize: '1.2em', fontWeight: 'bold', color: getElementColor(wun.ganji?.[0]), cursor: 'pointer' }}>{wun.ganji?.[0]}</div>
                                <div onClick={() => openModal(wun.ganji?.[1])} style={{ fontSize: '1.2em', fontWeight: 'bold', color: wun.is_gongmang ? '#EF4444' : getElementColor(wun.ganji?.[1]), cursor: 'pointer', marginBottom: '4px' }}>{wun.ganji?.[1]}</div>
                                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '6px' }}>{(wun.jijanggan || []).map((gan, i) => <span key={i} onClick={() => openModal(gan)} style={{ fontSize: '0.65em', color: '#9CA3AF', cursor: 'pointer' }}>{gan}</span>)}</div>
                                <div onClick={() => openModal(wun.shipi)} style={{ fontSize: '0.7em', color: '#6B7280', cursor: 'pointer' }}>{wun.shipi}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '1em', color: '#4B5563' }}>📅 1년 단위 현실 (세운)</h4>
                        <div className="horizontal-scroll">
                          {(result.seun || []).map((wun, idx) => {
                            const isCurrent = wun.year === currentYear;
                            return (
                              <div key={idx} style={{ minWidth: '65px', padding: '12px 4px', border: isCurrent ? '2px solid #10B981' : '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center', backgroundColor: isCurrent ? '#ECFDF5' : '#FFF' }}>
                                <div style={{ fontSize: '0.75em', color: '#64748B', marginBottom: '2px' }}>{wun.year}</div><div style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#EF4444', marginBottom: '6px' }}>{wun.age}세</div><div onClick={() => openModal(wun.ganji?.[0])} style={{ fontSize: '1.2em', fontWeight: 'bold', color: getElementColor(wun.ganji?.[0]), cursor: 'pointer' }}>{wun.ganji?.[0]}</div><div onClick={() => openModal(wun.ganji?.[1])} style={{ fontSize: '1.2em', fontWeight: 'bold', color: wun.is_gongmang ? '#EF4444' : getElementColor(wun.ganji?.[1]), cursor: 'pointer', marginBottom: '4px' }}>{wun.ganji?.[1]}</div><div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '6px' }}>{(wun.jijanggan || []).map((gan, i) => <span key={i} onClick={() => openModal(gan)} style={{ fontSize: '0.65em', color: '#9CA3AF', cursor: 'pointer' }}>{gan}</span>)}</div><div onClick={() => openModal(wun.shipi)} style={{ fontSize: '0.7em', color: '#6B7280', cursor: 'pointer' }}>{wun.shipi}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}><h4 style={{ margin: '0 0 1em', color: '#4B5563' }}>🛤️ 10년 단위 큰 환경 (대운)</h4><span style={{ fontSize: '0.75em', color: '#6366F1', cursor: 'pointer' }} onClick={() => openModal("교운기")}>💡 교운기란?</span></div>
                        <div className="horizontal-scroll">
                          {(result.daewun || []).map((wun, idx) => {
                            const seunCurrent = (result.seun || []).find(s => s.year === currentYear);
                            const isCurrent = seunCurrent?.age >= wun.age && seunCurrent?.age < wun.age + 10;
                            return (
                              <div key={idx} style={{ minWidth: '70px', padding: '12px 4px', border: isCurrent ? '2px solid #3B82F6' : '1px solid #E2E8F0', borderRadius: '8px', textAlign: 'center', backgroundColor: isCurrent ? '#EFF6FF' : '#FFF', opacity: wun.age > 90 ? 0.6 : 1 }}>
                                <div style={{ fontSize: '0.85em', fontWeight: 'bold', color: isCurrent ? '#1D4ED8' : '#EF4444', marginBottom: '6px' }}>{wun.age}세</div><div onClick={() => openModal(wun.ganji?.[0])} style={{ fontSize: '1.2em', fontWeight: 'bold', color: getElementColor(wun.ganji?.[0]), cursor: 'pointer' }}>{wun.ganji?.[0]}</div><div onClick={() => openModal(wun.ganji?.[1])} style={{ fontSize: '1.2em', fontWeight: 'bold', color: wun.is_gongmang ? '#EF4444' : getElementColor(wun.ganji?.[1]), cursor: 'pointer', marginBottom: '4px' }}>{wun.ganji?.[1]}</div><div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '6px' }}>{(wun.jijanggan || []).map((gan, i) => <span key={i} onClick={() => openModal(gan)} style={{ fontSize: '0.65em', color: '#9CA3AF', cursor: 'pointer' }}>{gan}</span>)}</div><div onClick={() => openModal(wun.shipi)} style={{ fontSize: '0.7em', color: '#6B7280', cursor: 'pointer', marginBottom: '8px' }}>{wun.shipi}</div><div style={{ fontSize: '0.65em', color: '#4338CA', backgroundColor: '#E0E7FF', padding: '4px', borderRadius: '4px' }} title="대운 진입(교운기) 날짜">{wun.start_date ? wun.start_date.substring(2) : ''}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                  </div>
                  
                  {/* 🔒 체험 만료자용 Paywall 오버레이 */}
                  {userTier === 'expired' && (
                    <div className="locked-overlay">
                      <div style={{ fontSize: '3em', marginBottom: '10px' }}>🔒</div>
                      <h3 style={{ margin: '0 0 10px 0', color: '#1C2536', fontSize: '1.3em' }}>7일 무료 체험이 종료되었습니다</h3>
                      <p style={{ margin: 0, color: '#4B5563', fontSize: '0.95em', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{t.lockMsgExpired}</p>
                      <button className="btn-upgrade" onClick={() => setUserTier('premium')}>{t.btnPay}</button>
                    </div>
                  )}
                </div>

                {/* =======================================================
                    👑 전문가 전체 사주풀이 (항상 잠겨있음 / 프리미엄 전용) 👑
                ======================================================== */}
                <div className="locked-section" style={{ marginTop: '20px' }}>
                  <div className={userTier !== 'premium' ? 'locked-blur' : ''}>
                    <div className="premium-card" style={{ border: '2px solid #D4AF37', background: 'linear-gradient(to bottom, #FFFCF5, #FFFFFF)', marginBottom: 0 }}>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3em', color: '#AA771C' }}>{t.expertTitle}</h3>
                      <p style={{ fontSize: '0.95em', color: '#6B7280', marginBottom: '20px', lineHeight: '1.6' }}>{t.expertDesc}</p>
                      <div style={{ padding: '15px', backgroundColor: '#FEF2F2', borderRadius: '8px', borderLeft: '4px solid #EF4444', marginBottom: '15px' }}>
                        <strong style={{ color: '#DC2626' }}>[경고 및 진단]</strong><br/>
                        ※ 결제 시 활성화됩니다. 추상적이지 않은 명확한 사주 가중치 분석이 제공됩니다.
                      </div>
                      <div style={{ padding: '15px', backgroundColor: '#ECFDF5', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
                        <strong style={{ color: '#059669' }}>[구체적 개운법]</strong><br/>
                        ※ 결제 시 활성화됩니다. 사주의 병(病)을 치료하기 위한 명확한 솔루션이 제공됩니다.
                      </div>
                    </div>
                  </div>

                  {/* 🔒 결제 유도 오버레이 (프리미엄이 아닌 경우 항상 노출) */}
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

        {/* ========================================================
            [2] 궁합 보기 탭
        ======================================================== */}
        {activeTab === 'gunghap' && (
          <div className="fade-in">
            <form onSubmit={handleGunghapSubmit} className="premium-card">
              <div style={{ backgroundColor: '#F9F8F6', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #EFECE6' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#1C2536', fontSize: '1.1em' }}>{t.myInfo}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ flex: '1 1 140px' }}><label className="label-text">{t.name}</label><input type="text" className="input-field" placeholder={t.name} name="name" value={gunghapData.me.name} onChange={(e) => handleGunghapChange('me', e)} /></div>
                  <div style={{ flex: '1 1 140px' }}><label className="label-text">{t.gender}</label><select className="input-field" name="gender" value={gunghapData.me.gender} onChange={(e) => handleGunghapChange('me', e)}><option value="M">{t.male}</option><option value="F">{t.female}</option></select></div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ flex: '1 1 100px' }}><label className="label-text">{t.cal}</label>
                    <select className="input-field" onChange={(e) => { const val = e.target.value; setGunghapData(prev => ({...prev, me: {...prev.me, is_lunar: val.includes('lunar'), is_leap_month: val === 'lunar_leap'}})) }} value={!gunghapData.me.is_lunar ? 'solar' : gunghapData.me.is_leap_month ? 'lunar_leap' : 'lunar'}>
                      <option value="solar">{t.solar}</option><option value="lunar">{t.lunar}</option><option value="lunar_leap">{t.lunarLeap}</option>
                    </select>
                  </div>
                  <div style={{ flex: '2 1 180px' }}><label className="label-text">{t.loc}</label>
                    <select className="input-field" value={gunghapData.me.birthPlace} onChange={(e) => setGunghapData(prev => ({...prev, me: {...prev.me, birthPlace: e.target.value}}))}>
                      {GLOBAL_LOCATIONS.map(loc => ( <option key={loc.id} value={loc.id}>{loc.label}</option> ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: '1 1 140px' }}><label className="label-text">{t.bDate}</label><input type="date" className="input-field" value={formatDate(gunghapData.me.year, gunghapData.me.month, gunghapData.me.day)} onChange={(e) => { if(!e.target.value) return; const [y, m, d] = e.target.value.split('-'); setGunghapData(prev => ({...prev, me: {...prev.me, year: parseInt(y), month: parseInt(m), day: parseInt(d)}})); }} /></div>
                  <div style={{ flex: '1 1 120px', opacity: gunghapData.me.is_time_unknown ? 0.4 : 1 }}><label className="label-text">{t.bTime}</label><input type="time" className="input-field" disabled={gunghapData.me.is_time_unknown} value={formatTime(gunghapData.me.hour, gunghapData.me.minute)} onChange={(e) => { if(!e.target.value) return; const [h, min] = e.target.value.split(':'); setGunghapData(prev => ({...prev, me: {...prev.me, hour: parseInt(h), minute: parseInt(min)}})); }} /></div>
                </div>
                <div style={{ textAlign: 'right' }}><label style={{ fontSize: '0.85em', color: '#4B5563', cursor: 'pointer', fontWeight: '500' }}><input type="checkbox" name="is_time_unknown" checked={gunghapData.me.is_time_unknown} onChange={(e) => handleGunghapChange('me', e)} style={{ accentColor: '#B59960' }} /> {t.timeUnk}</label></div>
              </div>

              <div style={{ backgroundColor: '#FFF5F7', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #FCE7F3' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#BE185D', fontSize: '1.1em' }}>{t.ptInfo}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ flex: '1 1 140px' }}><label className="label-text">{t.name}</label><input type="text" className="input-field" style={{ borderColor: '#FBCFE8' }} placeholder={t.name} name="name" value={gunghapData.partner.name} onChange={(e) => handleGunghapChange('partner', e)} /></div>
                  <div style={{ flex: '1 1 140px' }}><label className="label-text">{t.gender}</label><select className="input-field" style={{ borderColor: '#FBCFE8' }} name="gender" value={gunghapData.partner.gender} onChange={(e) => handleGunghapChange('partner', e)}><option value="F">{t.female}</option><option value="M">{t.male}</option></select></div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ flex: '1 1 100px' }}><label className="label-text">{t.cal}</label>
                    <select className="input-field" style={{ borderColor: '#FBCFE8' }} onChange={(e) => { const val = e.target.value; setGunghapData(prev => ({...prev, partner: {...prev.partner, is_lunar: val.includes('lunar'), is_leap_month: val === 'lunar_leap'}})) }} value={!gunghapData.partner.is_lunar ? 'solar' : gunghapData.partner.is_leap_month ? 'lunar_leap' : 'lunar'}>
                      <option value="solar">{t.solar}</option><option value="lunar">{t.lunar}</option><option value="lunar_leap">{t.lunarLeap}</option>
                    </select>
                  </div>
                  <div style={{ flex: '2 1 180px' }}><label className="label-text">{t.loc}</label>
                    <select className="input-field" style={{ borderColor: '#FBCFE8' }} value={gunghapData.partner.birthPlace} onChange={(e) => setGunghapData(prev => ({...prev, partner: {...prev.partner, birthPlace: e.target.value}}))}>
                      {GLOBAL_LOCATIONS.map(loc => ( <option key={loc.id} value={loc.id}>{loc.label}</option> ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: '1 1 140px' }}><label className="label-text">{t.bDate}</label><input type="date" className="input-field" style={{ borderColor: '#FBCFE8' }} value={formatDate(gunghapData.partner.year, gunghapData.partner.month, gunghapData.partner.day)} onChange={(e) => { if(!e.target.value) return; const [y, m, d] = e.target.value.split('-'); setGunghapData(prev => ({...prev, partner: {...prev.partner, year: parseInt(y), month: parseInt(m), day: parseInt(d)}})); }} /></div>
                  <div style={{ flex: '1 1 120px', opacity: gunghapData.partner.is_time_unknown ? 0.4 : 1 }}><label className="label-text">{t.bTime}</label><input type="time" className="input-field" style={{ borderColor: '#FBCFE8' }} disabled={gunghapData.partner.is_time_unknown} value={formatTime(gunghapData.partner.hour, gunghapData.partner.minute)} onChange={(e) => { if(!e.target.value) return; const [h, min] = e.target.value.split(':'); setGunghapData(prev => ({...prev, partner: {...prev.partner, hour: parseInt(h), minute: parseInt(min)}})); }} /></div>
                </div>
                <div style={{ textAlign: 'right' }}><label style={{ fontSize: '0.85em', color: '#BE185D', cursor: 'pointer', fontWeight: '500' }}><input type="checkbox" name="is_time_unknown" checked={gunghapData.partner.is_time_unknown} onChange={(e) => handleGunghapChange('partner', e)} style={{ accentColor: '#BE185D' }} /> {t.timeUnk}</label></div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 2, background: 'linear-gradient(135deg, #BE185D 0%, #9D174D 100%)', color: '#FFF' }} disabled={loading}>{loading ? <><div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#FFF' }}></div> {t.loading}</> : t.btnGunghap}</button>
                <button type="button" onClick={handleSaveGunghapData} className="btn-primary" style={{ flex: 1, background: '#FDF2F8', color: '#BE185D', border: '1px solid #FBCFE8', boxShadow: 'none' }}>💾 궁합 저장</button>
              </div>
            </form>

            {gunghapResult && (
              <div className="fade-in premium-card" style={{ textAlign: 'center', borderColor: '#FCE7F3', boxShadow: '0 10px 30px rgba(190,24,93,0.05)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#831843', fontSize: '1.3em' }}>두 사람의 찰떡 궁합도는?</h3>
                
                <div style={{ fontSize: '2.8em', fontWeight: '900', color: '#DB2777', textShadow: '2px 2px 0px #FDF2F8', lineHeight: '1.2' }}>{gunghapResult.score}<span style={{ fontSize: '0.4em', color: '#F472B6' }}>점</span></div>
                <div style={{ marginTop: '15px', backgroundColor: '#FDF2F8', padding: '16px', borderRadius: '12px', color: '#9D174D', fontWeight: '600', lineHeight: '1.6', marginBottom: '25px' }}>"{gunghapResult.summary}"</div>
                
                {/* 🧬 체질 궁합 영역 */}
                <div style={{ marginBottom: '15px', backgroundColor: '#FFF5F7', padding: '20px', borderRadius: '12px', border: '1px solid #FBCFE8', textAlign: 'left' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: '#9D174D', fontSize: '1.1em', display: 'flex', alignItems: 'center', gap: '5px' }}>🧬 사상체질 및 기운 분석</h4>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ flex: 1, backgroundColor: '#FFF', padding: '15px', borderRadius: '8px', border: '1px solid #FCE7F3', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.8em', color: '#DB2777', fontWeight: 'bold', marginBottom: '5px' }}>나의 체질</div>
                      <div style={{ fontSize: '1.05em', fontWeight: '800', color: '#831843', marginBottom: '8px' }}>{gunghapResult.me_info?.constitution_name}</div>
                      <div style={{ fontSize: '0.85em', color: '#4B5563', lineHeight: '1.6' }}>{gunghapResult.me_info?.constitution_desc}</div>
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#FFF', padding: '15px', borderRadius: '8px', border: '1px solid #FCE7F3', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.8em', color: '#DB2777', fontWeight: 'bold', marginBottom: '5px' }}>상대방 체질</div>
                      <div style={{ fontSize: '1.05em', fontWeight: '800', color: '#831843', marginBottom: '8px' }}>{gunghapResult.partner_info?.constitution_name}</div>
                      <div style={{ fontSize: '0.85em', color: '#4B5563', lineHeight: '1.6' }}>{gunghapResult.partner_info?.constitution_desc}</div>
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#FDF2F8', padding: '15px', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.9em', color: '#831843', lineHeight: '1.6', fontWeight: '700' }}>
                      {gunghapResult.constitution_compat}
                    </p>
                  </div>
                </div>

                {/* 📝 전문가 종합 조언 (개운법) */}
                <div style={{ marginBottom: '15px', backgroundColor: '#F0FDF4', padding: '20px', borderRadius: '12px', border: '1px solid #BBF7D0', textAlign: 'left' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#166534', fontSize: '1.1em' }}>💡 전문가 종합 개운법 솔루션</h4>
                  <p style={{ margin: 0, fontSize: '0.95em', color: '#14532D', lineHeight: '1.6' }}>{gunghapResult.professional_advice}</p>
                </div>

                {/* 🔒 궁합 영역 Paywall */}
                <div className="locked-section" style={{ marginTop: '25px', textAlign: 'left', borderTop: '1px solid #FBCFE8', paddingTop: '20px' }}>
                  <div className={userTier === 'expired' ? 'locked-blur' : ''}>
                    <div style={{ marginBottom: '15px' }}><h4 style={{ margin: '0 0 8px 0', color: '#9D174D', fontSize: '1.05em' }}>☯️ 음양오행 조후 및 억부 조화</h4><p style={{ margin: 0, fontSize: '0.9em', color: '#4B5563', lineHeight: '1.6' }}>{gunghapResult.element_complement}</p></div>
                    <div style={{ marginBottom: '15px' }}><h4 style={{ margin: '0 0 8px 0', color: '#9D174D', fontSize: '1.05em' }}>🧠 천간 합극 (정신적·이상적 유대)</h4><p style={{ margin: 0, fontSize: '0.9em', color: '#4B5563', lineHeight: '1.6' }}>{gunghapResult.heavenly_desc}</p></div>
                    <div><h4 style={{ margin: '0 0 8px 0', color: '#9D174D', fontSize: '1.05em' }}>🏡 지지 형충회합 (현실적·육체적 융합)</h4><p style={{ margin: 0, fontSize: '0.9em', color: '#4B5563', lineHeight: '1.6' }}>{gunghapResult.earthly_desc}</p></div>
                  </div>
                  {userTier === 'expired' && (
                    <div className="locked-overlay" style={{ background: 'rgba(255,245,247,0.7)' }}>
                      <div style={{ fontSize: '3em', marginBottom: '10px' }}>🔒</div>
                      <h3 style={{ margin: '0 0 10px 0', color: '#BE185D', fontSize: '1.2em' }}>프리미엄 궁합 정밀 해설</h3>
                      <button className="btn-upgrade" onClick={() => setUserTier('premium')}>{t.btnPay}</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📅 간지 달력 (만세력) 모달 */}
      {showCalendarModal && (
        <div className="fade-in" 
             style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '10px' }}
             onClick={() => setShowCalendarModal(false)}
        >
          <div className="hide-scrollbar" 
               style={{ backgroundColor: '#FFF', padding: '15px 15px', borderRadius: '16px', maxWidth: '360px', width: '100%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
               onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #EFECE6', paddingBottom: '12px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#1C2536', fontSize: '1.2em', fontWeight: '800' }}>{t.calTitle}</h3>
              <button onClick={() => setShowCalendarModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer', color: '#9CA3AF' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', backgroundColor: '#F8F7F4', padding: '8px 10px', borderRadius: '10px' }}>
              <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', fontSize: '1.2em', cursor: 'pointer', color: '#4B5563' }}>◀</button>
              <h4 style={{ margin: 0, fontSize: '1.1em', color: '#1C2536' }}>
                {currentCalDate.getFullYear()}년 {currentCalDate.getMonth() + 1}월
              </h4>
              <button onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', fontSize: '1.2em', cursor: 'pointer', color: '#4B5563' }}>▶</button>
            </div>

            <div className="calendar-grid">
              {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                <div key={day} className="calendar-day-header" style={{ color: day === '일' ? '#EF4444' : day === '토' ? '#3B82F6' : '#6B7280' }}>
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {renderCalendarDays()}
            </div>

            <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.8em', color: '#9CA3AF' }}>
              ※ 달력의 글자를 클릭하면 뜻을 볼 수 있어요!
            </div>
          </div>
        </div>
      )}

      {/* 🔮 생시 역추적 모달 */}
      {showRectifyModal && (
        <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '20px', maxWidth: '400px', width: '100%' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#B59960', fontSize: '1.3em' }}>{t.btnRect}</h3>
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
              <button onClick={handleRectifySubmit} disabled={loading} style={{ flex: 2, padding: '14px', backgroundColor: '#B59960', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>{loading ? '...' : t.btnRect}</button>
            </div>
          </div>
        </div>
      )}

      {/* ℹ️ 용어 설명 모달 */}
      {modalInfo && (
        <div className="fade-in" 
             style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }} 
             onClick={() => setModalInfo(null)}>
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