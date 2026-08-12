import React, { useState, useEffect, useRef } from 'react';

// 🔴 파이썬 백엔드 주소 (Render)
const BACKEND_URL = "https://saju-backend-ffum.onrender.com"; 

// 🚨 프론트엔드 UI 다국어 언어팩 (사전 검색 안내 문구 추가 완료)
const uiTexts = {
    ko: {
        btnDict: "📖 사전 열기", btnHome: "🏠 홈", btnProfile: "⚙️ 프로필 입력", btnSave: "🗂️ 저장한 명식", btnFaq: "❓ 자주 묻는 질문", btnCs: "🎧 고객센터", btnApp: "앱 다운로드", btnLogin: "로그인",
        landingTitle1: "당신의 운명,", landingTitle2: "데이터와 알고리즘", landingTitle3: "으로 해독하다",
        landingDesc: "대한민국 상위 1% 대가들의 심층 간명 비법을\n10개의 다이내믹 엔진으로 완벽하게 구현한 초정밀 예측 시스템",
        btnStart: "내 운명 스캔 시작하기",
        feature1Title: "초정밀 사주 명리", feature1Desc: "단순한 키워드 나열이 아닙니다. 격국, 용신, 조후, 12성 당사주까지. 고서의 비결을 현대적 팩트폭행으로 치환한 심층 간명지를 제공합니다.",
        feature2Title: "영혼을 꿰뚫는 심층 궁합", feature2Desc: "구궁(九宮) 겉궁합과 일지(日支) 속궁합의 완벽한 크로스체크. 삼원갑자를 기반으로 인연의 깊이와 파국의 타이밍까지 적나라하게 분석합니다.",
        feature3Title: "현대 실용 통변 & 풍수", feature3Desc: "나의 기질에 맞는 최적의 직무, 취약한 건강 장기와 업상대체법. 그리고 일상에 적용할 수 있는 오행 밸런스 지표를 제시합니다.",
        systemStatus: "10-Core Master Engine 정상 가동 중",
        inputTitle: "프로필 입력", inputDesc: "정확한 연산을 위해 운명을 스캔할 정보를 입력해 주세요.",
        lblBirth: "본인 생년월일시", lblGender: "본인 성별", lblLocation: "태어난 지역 (글로벌 표준시 및 진태양시 정밀 보정)",
        optSolar: "양력", optLunar: "음력(평달)", optLunarLeap: "음력(윤달)", optMale: "남성 (Male)", optFemale: "여성 (Female)",
        chkUnknownTime: "🕒 시간 모름", chkDaewun: "대운수 수동지정", chkGoBeob: "고법 둔월법", chkPartner: "💘 파트너 궁합",
        lblPartner: "💘 상대방 (궁합용)", lblPartnerLoc: "상대방 태어난 지역",
        btnScan: "운명 스캔 시작 (SCAN)", btnScanning: "연산 중 (Processing...)",
        repTitle: "분석 리포트", repTime: "진태양시 보정", btnCopy: "📋 복사", btnRetry: "⟲ 다시하기",
        colYear: "연주 (Year)", colMonth: "월주 (Month)", colDay: "일주 (Day)", colHour: "시주 (Hour)",
        txtGongmang: "공망", txtHidden: "지장간", txtNapeum: "[납음]",
        locSeoul: "🇰🇷 대한민국 (서울/표준: UTC+9, 127.0°)", locBusan: "🇰🇷 대한민국 (부산/동부: UTC+9, 129.0°)", locTokyo: "🇯🇵 일본 (도쿄: UTC+9, 139.7°)", locOsaka: "🇯🇵 일본 (오사카: UTC+9, 135.5°)", locBeijing: "🇨🇳 중국 (베이징: UTC+8, 116.4°)", locShanghai: "🇨🇳 중국 (상하이: UTC+8, 121.5°)", locHongKong: "🇭🇰 홍콩 (UTC+8, 114.0°)", locTaipei: "🇹🇼 대만 (타이베이: UTC+8, 121.5°)", locHanoi: "🇻🇳 베트남 (하노이: UTC+7, 105.8°)", locSydney: "🇦🇺 호주 (시드니: UTC+11, 151.2°E)", locLA: "🇺🇸 미국 (LA/서부: UTC-8, 118.2°W)", locNY: "🇺🇸 미국 (뉴욕/동부: UTC-5, 74.0°W)", locLondon: "🇬🇧 영국 (런던: UTC+0, 0.1°W)",
        dictPlaceholder: "궁금한 용어나 한자를 입력하세요", dictEmpty: "검색어를 입력하시면 전문 해설이 나타납니다.", dictNoResult: "검색 결과가 없습니다."
    },
    ja: {
        btnDict: "📖 辞典を開く", btnHome: "🏠 ホーム", btnProfile: "⚙️ 入力フォーム", btnSave: "🗂️ 保存した命式", btnFaq: "❓ よくある質問", btnCs: "🎧 サポート", btnApp: "アプリ", btnLogin: "ログイン",
        landingTitle1: "あなたの運命を、", landingTitle2: "データとアルゴリズム", landingTitle3: "で解読",
        landingDesc: "上位1%の大家の深層鑑定秘法を\n10のダイナミックエンジンで完璧に具現化した超精密予測システム",
        btnStart: "運命のスキャンを開始する",
        feature1Title: "超精密 四柱推命", feature1Desc: "単純なキーワードの羅列ではありません。格局、用神、調候から十二星まで。古書の秘訣を現代的かつ直説的に変換した深層鑑定書を提供します。",
        feature2Title: "魂を見抜く深層相性", feature2Desc: "九宮の表相性と日支の裏相性を完璧にクロスチェック。三元甲子に基づき、縁の深さと破局のタイミングまで赤裸々に分析します。",
        feature3Title: "現代実用通変＆風水", feature3Desc: "あなたの気質に合った最適な職務、脆弱な健康臓器と業障代替法。そして日常に応用できる五行バランス指標を提示します。",
        systemStatus: "10-Core Master Engine 正常稼働中",
        inputTitle: "プロフィール入力", inputDesc: "正確な演算のため、運命をスキャンする情報を入力してください。",
        lblBirth: "本人の生年月日と時間", lblGender: "本人の性別", lblLocation: "生まれた地域 (グローバル標準時・真太陽時補正)",
        optSolar: "陽暦", optLunar: "陰暦(平月)", optLunarLeap: "陰暦(閏月)", optMale: "男性 (Male)", optFemale: "女性 (Female)",
        chkUnknownTime: "🕒 時間不明", chkDaewun: "大運数 手動指定", chkGoBeob: "古法 遁月法", chkPartner: "💘 パートナー相性",
        lblPartner: "💘 相手 (相性用)", lblPartnerLoc: "相手の生まれた地域",
        btnScan: "運命スキャン開始 (SCAN)", btnScanning: "演算中 (Processing...)",
        repTitle: "分析レポート", repTime: "真太陽時補正", btnCopy: "📋 コピー", btnRetry: "⟲ やり直す",
        colYear: "年柱 (Year)", colMonth: "月柱 (Month)", colDay: "日柱 (Day)", colHour: "時柱 (Hour)",
        txtGongmang: "空亡", txtHidden: "蔵干", txtNapeum: "[納音]",
        locSeoul: "🇰🇷 韓国 (ソウル: UTC+9, 127.0°)", locBusan: "🇰🇷 韓国 (釜山: UTC+9, 129.0°)", locTokyo: "🇯🇵 日本 (東京: UTC+9, 139.7°)", locOsaka: "🇯🇵 日本 (大阪: UTC+9, 135.5°)", locBeijing: "🇨🇳 中国 (北京: UTC+8, 116.4°)", locShanghai: "🇨🇳 中国 (上海: UTC+8, 121.5°)", locHongKong: "🇭🇰 香港 (UTC+8, 114.0°)", locTaipei: "🇹🇼 台湾 (台北: UTC+8, 121.5°)", locHanoi: "🇻🇳 ベトナム (ハノイ: UTC+7, 105.8°)", locSydney: "🇦🇺 豪州 (シドニー: UTC+11, 151.2°E)", locLA: "🇺🇸 米国 (LA: UTC-8, 118.2°W)", locNY: "🇺🇸 米国 (NY: UTC-5, 74.0°W)", locLondon: "🇬🇧 英国 (ロンドン: UTC+0, 0.1°W)",
        dictPlaceholder: "気になる用語や漢字を入力してください", dictEmpty: "検索語を入力すると専門的な解説が表示されます。", dictNoResult: "検索結果がありません。"
    },
    'zh-CN': {
        btnDict: "📖 打开字典", btnHome: "🏠 首页", btnProfile: "⚙️ 填写资料", btnSave: "🗂️ 已存命盘", btnFaq: "❓ 常见问题", btnCs: "🎧 客服中心", btnApp: "下载 APP", btnLogin: "登录",
        landingTitle1: "您的命运，", landingTitle2: "通过数据与算法", landingTitle3: "来解读",
        landingDesc: "将前1%命理大家的深层论命秘法\n通过10个动态引擎完美实现的超精密预测系统",
        btnStart: "开始扫描我的命运",
        feature1Title: "超精密 四柱八字", feature1Desc: "绝非简单的关键词堆砌。从格局、用神、调候到十二星。将古书秘诀转化为现代的直白解析，提供深层论命报告。",
        feature2Title: "洞穿灵魂的深层合婚", feature2Desc: "九宫外合与日支内合的完美交叉比对。基于三元甲子，赤裸裸地分析缘分的深浅与破局的时机。",
        feature3Title: "现代实用通变与风水", feature3Desc: "契合您气质的最佳职务、脆弱的健康脏器与化解之法。并提供可应用于日常的五行平衡指标。",
        systemStatus: "10-Core Master Engine 正常运行中",
        inputTitle: "填写资料", inputDesc: "为了精准运算，请输入用于扫描命运的信息。",
        lblBirth: "本人生辰八字", lblGender: "本人性别", lblLocation: "出生地区 (全球标准时与真太阳时校正)",
        optSolar: "公历", optLunar: "农历(平月)", optLunarLeap: "农历(闰月)", optMale: "男性 (Male)", optFemale: "女性 (Female)",
        chkUnknownTime: "🕒 未知时间", chkDaewun: "大运数手动指定", chkGoBeob: "古法 遁月法", chkPartner: "💘 伴侣合婚",
        lblPartner: "💘 对方 (合婚用)", lblPartnerLoc: "对方出生地区",
        btnScan: "开始命运扫描 (SCAN)", btnScanning: "运算中 (Processing...)",
        repTitle: "分析报告", repTime: "真太阳时校正", btnCopy: "📋 复制", btnRetry: "⟲ 重试",
        colYear: "年柱 (Year)", colMonth: "月柱 (Month)", colDay: "日柱 (Day)", colHour: "时柱 (Hour)",
        txtGongmang: "空亡", txtHidden: "地支藏干", txtNapeum: "[纳音]",
        locSeoul: "🇰🇷 韩国 (首尔: UTC+9, 127.0°)", locBusan: "🇰🇷 韩国 (釜山: UTC+9, 129.0°)", locTokyo: "🇯🇵 日本 (东京: UTC+9, 139.7°)", locOsaka: "🇯🇵 日本 (大阪: UTC+9, 135.5°)", locBeijing: "🇨🇳 中国 (北京: UTC+8, 116.4°)", locShanghai: "🇨🇳 中国 (上海: UTC+8, 121.5°)", locHongKong: "🇭🇰 香港 (UTC+8, 114.0°)", locTaipei: "🇹🇼 台湾 (台北: UTC+8, 121.5°)", locHanoi: "🇻🇳 越南 (河内: UTC+7, 105.8°)", locSydney: "🇦🇺 澳洲 (悉尼: UTC+11, 151.2°E)", locLA: "🇺🇸 美国 (洛杉矶: UTC-8, 118.2°W)", locNY: "🇺🇸 美国 (纽约: UTC-5, 74.0°W)", locLondon: "🇬🇧 英国 (伦敦: UTC+0, 0.1°W)",
        dictPlaceholder: "请输入想了解的术语或汉字", dictEmpty: "输入搜索词即可查看专业解析。", dictNoResult: "没有搜索结果。"
    },
    'zh-TW': {
        btnDict: "📖 打開字典", btnHome: "🏠 首頁", btnProfile: "⚙️ 填寫資料", btnSave: "🗂️ 已存命盤", btnFaq: "❓ 常見問題", btnCs: "🎧 客服中心", btnApp: "下載 APP", btnLogin: "登入",
        landingTitle1: "您的命運，", landingTitle2: "透過數據與演算法", landingTitle3: "來解讀",
        landingDesc: "將前1%命理大家的深層論命秘法\n透過10個動態引擎完美實現的超精密預測系統",
        btnStart: "開始掃描我的命運",
        feature1Title: "超精密 四柱八字", feature1Desc: "絕非簡單的關鍵詞堆砌。從格局、用神、調候到十二星。將古書秘訣轉化為現代的直白解析，提供深層論命報告。",
        feature2Title: "洞穿靈魂的深層合婚", feature2Desc: "九宮外合與日支內合的完美交叉比對。基於三元甲子，赤裸裸地分析緣分的深淺與破局的時機。",
        feature3Title: "現代實用通變與風水", feature3Desc: "契合您氣質的最佳職務、脆弱的健康臟器與化解之法。並提供可應用於日常的五行平衡指標。",
        systemStatus: "10-Core Master Engine 正常運作中",
        inputTitle: "填寫資料", inputDesc: "為了精準運算，請輸入用於掃描命運的資訊。",
        lblBirth: "本人生辰八字", lblGender: "本人性別", lblLocation: "出生地區 (全球標準時與真太陽時校正)",
        optSolar: "公曆", optLunar: "農曆(平月)", optLunarLeap: "農曆(閏月)", optMale: "男性 (Male)", optFemale: "女性 (Female)",
        chkUnknownTime: "🕒 未知時間", chkDaewun: "大運數手動指定", chkGoBeob: "古法 遁月法", chkPartner: "💘 伴侶合婚",
        lblPartner: "💘 對方 (合婚用)", lblPartnerLoc: "對方出生地區",
        btnScan: "開始命運掃描 (SCAN)", btnScanning: "運算中 (Processing...)",
        repTitle: "分析報告", repTime: "真太陽時校正", btnCopy: "📋 複製", btnRetry: "⟲ 重試",
        colYear: "年柱 (Year)", colMonth: "月柱 (Month)", colDay: "日柱 (Day)", colHour: "時柱 (Hour)",
        txtGongmang: "空亡", txtHidden: "地支藏干", txtNapeum: "[納音]",
        locSeoul: "🇰🇷 韓國 (首爾: UTC+9, 127.0°)", locBusan: "🇰🇷 韓國 (釜山: UTC+9, 129.0°)", locTokyo: "🇯🇵 日本 (東京: UTC+9, 139.7°)", locOsaka: "🇯🇵 日本 (大阪: UTC+9, 135.5°)", locBeijing: "🇨🇳 中國 (北京: UTC+8, 116.4°)", locShanghai: "🇨🇳 中國 (上海: UTC+8, 121.5°)", locHongKong: "🇭🇰 香港 (UTC+8, 114.0°)", locTaipei: "🇹🇼 台灣 (台北: UTC+8, 121.5°)", locHanoi: "🇻🇳 越南 (河內: UTC+7, 105.8°)", locSydney: "🇦🇺 澳洲 (悉尼: UTC+11, 151.2°E)", locLA: "🇺🇸 美國 (洛杉磯: UTC-8, 118.2°W)", locNY: "🇺🇸 美國 (紐約: UTC-5, 74.0°W)", locLondon: "🇬🇧 英國 (倫敦: UTC+0, 0.1°W)",
        dictPlaceholder: "請輸入想了解的術語或漢字", dictEmpty: "輸入搜尋詞即可查看專業解析。", dictNoResult: "沒有搜尋結果。"
    }
};

export default function SajuCalculator() {
    const [view, setView] = useState("home"); 
    const [loading, setLoading] = useState(false);
    const [resData, setResData] = useState(null);
    
    const [lang, setLang] = useState("ko");
    const t = uiTexts[lang]; 

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [errorModal, setErrorModal] = useState({ show: false, msg: "" });
    const [dictModal, setDictModal] = useState({ show: false, keyword: "", results: null });
    const [tooltip, setTooltip] = useState({ show: false, meta: null, top: 0, left: 0 });

    const [form, setForm] = useState({
        calendar_type: 'solar', dt_input: '1946-12-07T12:00', gender: 'M',
        location: '127.0|+9', unknown_time: false, opt_daewun: false, daewun_num: '', 
        use_traditional: false, lunar_month: 11, use_partner: false, 
        p_calendar_type: 'solar', p_dt_input: '1950-05-12T12:00', p_gender: 'F',
        p_location: '127.0|+9', p_unknown_time: false, p_opt_daewun: false, p_daewun_num: '', 
        p_use_traditional: false, p_lunar_month: 11
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'unknown_time') {
            setForm(prev => ({ ...prev, unknown_time: checked, dt_input: checked ? prev.dt_input.split('T')[0] : prev.dt_input.split('T')[0] + 'T12:00' })); return;
        }
        if (name === 'p_unknown_time') {
            setForm(prev => ({ ...prev, p_unknown_time: checked, p_dt_input: checked ? prev.p_dt_input.split('T')[0] : prev.p_dt_input.split('T')[0] + 'T12:00' })); return;
        }
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const hideTooltip = () => setTooltip(prev => ({ ...prev, show: false }));

    useEffect(() => { hideTooltip(); }, [view]);

    useEffect(() => {
        let metaViewport = document.querySelector("meta[name=viewport]");
        if (!metaViewport) { metaViewport = document.createElement("meta"); metaViewport.name = "viewport"; document.head.appendChild(metaViewport); }
        metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
        const handleScroll = () => hideTooltip();
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);

    // 🚨 사전 검색 시 백엔드에 선택된 언어(lang)를 전달합니다.
    const handleDictSearch = async (e) => {
        const keyword = e.target.value;
        setDictModal(prev => ({ ...prev, keyword }));
        if (!keyword) { setDictModal(prev => ({ ...prev, results: null })); return; }
        try {
            const response = await fetch(`${BACKEND_URL}/api/dictionary?q=${encodeURIComponent(keyword)}&lang=${lang}`);
            const results = await response.json();
            setDictModal(prev => ({ ...prev, results }));
        } catch (err) { console.error(err); }
    };

    const showTooltip = (e, meta) => {
        if (!meta) return;
        const rect = e.target.getBoundingClientRect();
        let top = rect.top - 120; let left = rect.left + (rect.width / 2) - 130;
        if (top < 10) top = rect.bottom + 10;
        if (left < 10) left = 10;
        if (left + 260 > window.innerWidth - 10) left = window.innerWidth - 270;
        setTooltip({ show: true, meta, top, left });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        hideTooltip(); 
        setLoading(true);
        try {
            const [longitudeStr, timezoneStr] = form.location.split('|');
            
            const payload = {
                datetime_str: form.unknown_time ? form.dt_input.split('T')[0] + ' 12:00' : form.dt_input.replace('T', ' '),
                calendar_type: form.calendar_type, gender: form.gender,
                longitude: parseFloat(longitudeStr), timezone: parseInt(timezoneStr),
                unknown_time: form.unknown_time,
                apply_true_solar: true, apply_yaja: true,
                apply_traditional_lunar: form.use_traditional, lunar_month: form.use_traditional ? parseInt(form.lunar_month) : null,
                language: lang 
            };
            
            if (form.opt_daewun && form.daewun_num !== '') payload.daewun_num = parseInt(form.daewun_num);
            
            if (form.use_partner) {
                const [pLonStr, pTzStr] = form.p_location.split('|');
                payload.partner_datetime_str = form.p_unknown_time ? form.p_dt_input.split('T')[0] + ' 12:00' : form.p_dt_input.replace('T', ' ');
                payload.partner_calendar_type = form.p_calendar_type; payload.partner_gender = form.p_gender;
                payload.partner_longitude = parseFloat(pLonStr); payload.partner_timezone = parseInt(pTzStr);
                payload.partner_unknown_time = form.p_unknown_time;
                payload.partner_apply_traditional_lunar = form.p_use_traditional;
                payload.partner_lunar_month = form.p_use_traditional ? parseInt(form.p_lunar_month) : null;
                if (form.p_opt_daewun && form.p_daewun_num !== '') payload.partner_daewun_num = parseInt(form.p_daewun_num);
            }

            const response = await fetch(`${BACKEND_URL}/api/bazi`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || JSON.stringify(errData));
            }

            const res = await response.json();
            setResData(res);
            setView("dashboard");
            window.scrollTo(0, 0);

        } catch (err) {
            setErrorModal({ show: true, msg: `서버 연산 중 에러:\n\n${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => { alert("복사 기능은 구조 개편 중입니다."); };

    const renderTooltipItem = (keyword, isChar = true, text = null) => {
        if (!resData) return text || keyword;
        const metaDict = resData.mechanics.metadata || {};
        const meta = metaDict[keyword];
        const display = text || keyword;
        if (!meta || keyword === "-" || keyword === "알수없음") return <span key={Math.random()}>{display}</span>;
        
        const cssClass = isChar ? "hanja-tooltip char-tooltip" : "hanja-tooltip";
        return (
            <span key={Math.random()} className={cssClass} onMouseEnter={(e) => showTooltip(e, meta)} onMouseLeave={hideTooltip}>
                {display}
            </span>
        );
    };

    const renderHanjaString = (str) => {
        if (!str || str === "-") return "-";
        return str.split('').map(char => renderTooltipItem(char, true));
    };

    const attachSwipe = (el) => {
        if (!el) return;
        let isDown = false; let startX; let scrollLeft;
        el.onmousedown = (e) => { isDown = true; el.style.cursor = 'grabbing'; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
        el.onmouseleave = () => { isDown = false; el.style.cursor = 'grab'; };
        el.onmouseup = () => { isDown = false; el.style.cursor = 'grab'; };
        el.onmousemove = (e) => { if (!isDown) return; e.preventDefault(); const walk = (e.pageX - el.offsetLeft - startX) * 2; el.scrollLeft = scrollLeft - walk; };
    };

    const renderLocationOptions = () => (
        <>
            <option value="127.0|+9">{t.locSeoul}</option>
            <option value="129.0|+9">{t.locBusan}</option>
            <option value="139.7|+9">{t.locTokyo}</option>
            <option value="135.5|+9">{t.locOsaka}</option>
            <option value="116.4|+8">{t.locBeijing}</option>
            <option value="121.5|+8">{t.locShanghai}</option>
            <option value="114.0|+8">{t.locHongKong}</option>
            <option value="121.5|+8">{t.locTaipei}</option>
            <option value="105.8|+7">{t.locHanoi}</option>
            <option value="151.2|+11">{t.locSydney}</option>
            <option value="-118.2|-8">{t.locLA}</option>
            <option value="-74.0|-5">{t.locNY}</option>
            <option value="-0.1|+0">{t.locLondon}</option>
        </>
    );

    return (
        <div className="app-container" lang={lang}>
            <style>{`
                :root { --bg-color: #0d0f12; --card-bg: #16181d; --text-main: #f1f2f6; --text-muted: #95a5a6; --gold-light: #f1c40f; --gold-main: #d4af37; --gold-dark: #b5952f; --accent-red: #e74c3c; --accent-blue: #3498db; --accent-green: #2ecc71; }
                html, body, #root, #__next { margin: 0 !important; padding: 0 !important; background-color: var(--bg-color) !important; width: 100%; max-width: 100vw; min-height: 100vh; overflow-x: hidden; }
                * { box-sizing: border-box; overflow-wrap: break-word !important; word-wrap: break-word !important; }
                div, p, span, h1, h2, h3, h4 { word-break: keep-all; } 
                
                .app-container:lang(ko) { word-break: keep-all; overflow-wrap: break-word; }
                .app-container:not(:lang(ko)) { word-break: normal; overflow-wrap: anywhere; line-break: strict; }
                
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: var(--bg-color); }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
                
                .app-container { font-family: "'Noto Serif KR', serif"; background: var(--bg-color); min-height: 100vh; color: var(--text-main); width: 100%; max-width: 100vw; overflow-x: hidden; }
                
                .lang-switcher { position: fixed; top: 20px; right: 70px; z-index: 1000; display: flex; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid #333; border-radius: 6px; padding: 6px 10px; backdrop-filter: blur(5px); }
                .lang-switcher span { margin-right: 5px; font-size: 16px; }
                .lang-switcher select { background: transparent; color: white; border: none; font-size: 13px; font-weight: bold; outline: none; cursor: pointer; appearance: none; }
                .lang-switcher select option { background: #16181d; color: white; }
                
                .hamburger-btn { position: fixed; top: 20px; right: 20px; z-index: 1000; background: rgba(255,255,255,0.05); border: 1px solid #333; color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 20px; transition: 0.3s; backdrop-filter: blur(5px); }
                .hamburger-btn:hover { background: rgba(212,175,55,0.2); color: var(--gold-main); border-color: var(--gold-main); }

                .sidebar-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 3000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; backdrop-filter: blur(3px); }
                .sidebar-overlay.open { opacity: 1; pointer-events: auto; }
                .sidebar-menu { position: fixed; top: 0; right: 0; width: 300px; height: 100vh; background: var(--card-bg); z-index: 3001; transform: translateX(100%); transition: transform 0.3s ease-in-out; box-shadow: -10px 0 30px rgba(0,0,0,0.8); display: flex; flex-direction: column; text-align: left; border-left: 1px solid #333; }
                .sidebar-menu.open { transform: translateX(0); }
                .sidebar-header { padding: 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
                .sidebar-header h3 { margin: 0; color: var(--gold-main); font-size: 1.1rem; font-weight: 900; letter-spacing: 1px; }
                .sidebar-close-btn { background: none; border: none; font-size: 28px; color: #888; cursor: pointer; padding: 0; line-height: 1; transition: 0.2s; }
                .sidebar-close-btn:hover { color: white; }
                .sidebar-content { flex: 1; overflow-y: auto; padding: 10px 0; }
                .sidebar-item { padding: 18px 25px; border-bottom: 1px solid rgba(255,255,255,0.03); color: var(--text-main); display: flex; align-items: center; gap: 15px; cursor: pointer; transition: 0.2s; font-size: 15px; font-weight: 500; }
                .sidebar-item:hover { background: rgba(212,175,55,0.05); color: var(--gold-main); padding-left: 30px; }
                .sidebar-footer { padding: 25px 20px; border-top: 1px solid #333; background: rgba(0,0,0,0.3); }
                .sidebar-login { display: flex; align-items: center; gap: 10px; color: #aaa; cursor: pointer; font-size: 14px; margin-top: 15px; font-weight: bold; transition: 0.2s; }
                .sidebar-login:hover { color: var(--gold-light); }

                .landing-section { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; min-height: 100vh; padding: 15vh 20px 80px 20px; background: radial-gradient(circle at center, #1a1e24 0%, var(--bg-color) 100%); text-align: center; }
                .landing-hero { max-width: 900px; margin-bottom: 50px; animation: fadeIn 1s ease-out; }
                .landing-title { font-size: 3.5rem; font-weight: 900; letter-spacing: 2px; margin-bottom: 20px; color: #fff; line-height: 1.3; white-space: pre-wrap; }
                .landing-title span { color: var(--gold-main); text-shadow: 0 0 20px rgba(212,175,55,0.3); }
                .landing-subtitle { font-size: 1.2rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 40px; font-weight: 300; white-space: pre-wrap; }
                .btn-cta { background: linear-gradient(135deg, var(--gold-dark), var(--gold-main)); color: #000; border: none; border-radius: 50px; padding: 20px 40px; font-size: 1.2rem; font-weight: 900; cursor: pointer; box-shadow: 0 10px 30px rgba(212,175,55,0.3); transition: all 0.3s; animation: pulse 2s infinite; }
                .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(212,175,55,0.5); animation: none; }
                
                .bento-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1100px; width: 100%; margin-bottom: 50px; }
                .feature-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(212,175,55,0.2); border-radius: 16px; padding: 30px; text-align: left; backdrop-filter: blur(10px); transition: 0.3s; }
                .feature-card:hover { transform: translateY(-5px); background: rgba(212,175,55,0.05); border-color: var(--gold-main); }
                .feature-icon { font-size: 2.5rem; margin-bottom: 15px; }
                .feature-card h3 { color: var(--gold-light); font-size: 1.3rem; margin: 0 0 15px 0; }
                .feature-card p { color: #aaa; font-size: 0.95rem; line-height: 1.6; margin: 0; }
                
                .system-status { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: #777; background: rgba(0,0,0,0.4); padding: 10px 20px; border-radius: 30px; border: 1px solid #333; }
                .status-dot { width: 10px; height: 10px; background-color: var(--accent-green); border-radius: 50%; box-shadow: 0 0 10px var(--accent-green); animation: blink 1.5s infinite; }
                
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(212,175,55,0.4); } 70% { box-shadow: 0 0 0 15px rgba(212,175,55,0); } 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); } }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

                .hero-section { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; min-height: 100vh; padding: 12vh 20px 80px 20px; background: var(--bg-color); text-align: center; position: relative; }
                .hero-title { font-size: 2.5rem; font-weight: 900; letter-spacing: 2px; margin-top: 0; margin-bottom: 20px; color: var(--gold-main); text-shadow: 0 4px 15px rgba(212,175,55,0.2); }
                .hero-subtitle { font-size: 1rem; color: var(--text-muted); margin-bottom: 40px; font-weight: 300; line-height: 1.6; }
                
                .input-card { background: var(--card-bg); padding: 30px; border-radius: 12px; width: 100%; max-width: 750px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; overflow: hidden; }
                .input-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg, transparent, var(--gold-main), transparent); }
                
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; text-align: left; }
                .full-width { grid-column: 1 / -1; }
                .options-row { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 20px; font-size: 13px; }
                
                label { font-size: 13px; font-weight: 700; color: var(--gold-light); margin-bottom: 5px; display: block; }
                input, select { width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid #333; color: white; border-radius: 6px; font-family: inherit; font-size: 14px; transition: all 0.3s; }
                input:focus, select:focus { border-color: var(--gold-main); outline: none; }
                .btn-primary { width: 100%; padding: 15px; background: linear-gradient(135deg, var(--gold-dark), var(--gold-main)); color: #000; border: none; border-radius: 6px; font-size: 16px; font-weight: 900; cursor: pointer; margin-top: 25px; transition: transform 0.2s, box-shadow 0.2s; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212,175,55,0.4); }
                
                .top-nav { position: absolute; top: 20px; left: 20px; z-index: 100; }
                .btn-icon { background: rgba(255,255,255,0.1); color: white; border: 1px solid #333; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 13px; transition: 0.3s; }
                .btn-icon:hover { background: var(--gold-main); color: #000; border-color: var(--gold-main); }
                
                .dashboard { padding: 60px 20px 40px 20px; max-width: 1300px; margin: auto; width: 100%; box-sizing: border-box; }
                .dash-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
                .dash-header h2 { margin: 0; color: var(--gold-main); font-weight: 900; }
                
                .bazi-table-container { background: var(--card-bg); border-radius: 12px; padding: 20px; border: 1px solid #222; margin-bottom: 30px; overflow-x: auto; width: 100%; }
                .bazi-table { width: 100%; table-layout: fixed; border-collapse: collapse; text-align: center; }
                .bazi-table th { color: var(--text-muted); font-size: 13px; padding-bottom: 15px; border-bottom: 1px solid #333; font-weight: 400; }
                .bazi-table td { padding: 15px 10px; border-right: 1px solid #222; min-width: 0; }
                .bazi-table td:last-child { border-right: none; }
                .stem, .branch { font-size: 38px; font-weight: 900; color: #fff; line-height: 1.2; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
                .ten-god { font-size: 13px; color: var(--gold-main); margin-bottom: 5px; font-weight: 700; letter-spacing: 1px; }
                .hidden-stems { font-size: 13px; color: #eee; margin-top: 15px; text-align: center !important; background: rgba(0,0,0,0.4); padding: 12px 5px; border-radius: 8px; font-weight: 500; letter-spacing: 2px; }
                
                .dashboard-layout { display: flex; flex-direction: column; gap: 20px; width: 100%; }
                .bento-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .bento-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
                .bento-col { display: flex; flex-direction: column; gap: 20px; }
                
                .panel { background: var(--card-bg); padding: 25px; border-radius: 12px; border: 1px solid #222; box-shadow: 0 5px 15px rgba(0,0,0,0.2); display: flex; flex-direction: column; text-align: left !important; width: 100%; min-width: 0; box-sizing: border-box; }
                .panel h3 { margin-top: 0; color: var(--gold-main); font-size: 1.1rem; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px; text-align: left !important; }
                .highlight-box { background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border-left: 3px solid var(--gold-main); margin-bottom: 15px; text-align: left !important; min-width: 0; }
                .highlight-box:last-child { margin-bottom: 0; }
                
                .napeum-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
                .gunghap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
                .practical-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; }
                
                .swipe-container { display: flex; gap: 15px; overflow-x: auto; padding: 10px 5px 25px 5px; cursor: grab; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; min-width: 0; }
                .swipe-container::-webkit-scrollbar { display: none; }
                .timeline-card { flex: 0 0 100px; background: rgba(255,255,255,0.03); border: 1px solid #333; border-radius: 8px; text-align: center !important; padding: 15px 10px; transition: 0.3s; user-select: none; }
                .timeline-card.current-year { border: 2px solid var(--gold-main) !important; background: rgba(212,175,55,0.2) !important; box-shadow: 0 0 15px rgba(212,175,55,0.5); transform: scale(1.05); }

                .badge { display: inline-block; padding: 4px 8px; background: rgba(255,255,255,0.05); border: 1px solid #444; border-radius: 4px; font-size: 12px; margin: 3px; font-weight: 700; color: #ccc; }
                .badge-good { border-color: var(--accent-green); color: var(--accent-green); background: rgba(46,204,113,0.1); }
                .badge-bad { border-color: var(--accent-red); color: var(--accent-red); background: rgba(231,76,60,0.1); }
                .hanja-tooltip { display: inline-block; cursor: pointer; color: var(--gold-main); border-bottom: 1px dashed rgba(212,175,55,0.5); }
                .hanja-tooltip.char-tooltip { color: #fff; border-bottom: none; }
                
                /* 🚨 사전 모달창 높이 고정으로 검색 시 흔들림(Jitter) 완벽 방어 */
                .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index: 4000; backdrop-filter: blur(5px); }
                .modal-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--card-bg); width: 90%; max-width: 600px; height: 80vh; border-radius: 12px; padding: 25px; display: flex; flex-direction: column; border: 1px solid #333; box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: left; }
                .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
                .modal-header h3 { margin: 0; color: var(--gold-main); }
                .close-btn { background: none; border: none; font-size: 28px; color: #888; cursor: pointer; }
                .dict-search-box input { width: 100%; padding: 15px; font-size: 15px; background: #000; border-radius: 8px; color: white; border: 1px solid #333; }
                .dict-results { flex: 1; overflow-y: auto; padding-right: 10px; margin-top: 15px; }
                .dict-item { background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border-left: 4px solid var(--gold-main); margin-bottom: 15px; }

                /* 📱📱 모바일 및 테블릿 반응형 제어 📱📱 */
                @media (max-width: 1024px) {
                    .bento-row-3 { grid-template-columns: 1fr 1fr; }
                    .bento-features { grid-template-columns: 1fr; }
                    .landing-title { font-size: 2.5rem; }
                }
                @media (max-width: 768px) {
                    .lang-switcher { right: 60px; top: 15px; padding: 4px 8px; }
                    .hamburger-btn { top: 15px; right: 15px; font-size: 18px; padding: 6px 10px; }
                    .top-nav { left: 15px; top: 15px; }
                    .sidebar-menu { width: 85vw; max-width: 320px; }
                    
                    .landing-title { font-size: 2rem; }
                    .landing-subtitle { font-size: 1rem; padding: 0 10px; }
                    .feature-card { padding: 20px; }
                    
                    .hero-section { padding-top: 100px; padding-bottom: 60px; }
                    .hero-title { font-size: 1.8rem; margin-top: 0px; margin-bottom: 15px; }
                    .hero-subtitle { font-size: 0.9rem; word-break: keep-all; padding: 0 10px; margin-bottom: 30px; }
                    
                    .input-card { padding: 20px 15px; border-radius: 0; border-left: none; border-right: none; }
                    .form-grid { grid-template-columns: 1fr; gap: 15px; } 
                    .options-row { flex-direction: column; align-items: flex-start; gap: 10px; } 
                    
                    .dashboard { padding: 60px 10px 20px 10px; overflow-x: hidden; }
                    .dash-header { flex-direction: column; gap: 10px; align-items: flex-start; }
                    .dash-header h2 { padding-left: 0; }
                    .dash-header div { width: 100%; display: flex; justify-content: space-between; }
                    
                    .bazi-table-container { padding: 15px 5px; border-radius: 8px; }
                    .bazi-table th { font-size: 11px; padding-bottom: 8px; }
                    .bazi-table td { padding: 10px 2px; }
                    .stem, .branch { font-size: 26px; }
                    .hidden-stems { font-size: 10px; padding: 8px 2px; letter-spacing: 0; word-break: break-all; }
                    
                    .bento-row-2, .bento-row-3 { grid-template-columns: 1fr; gap: 15px; }
                    .panel { padding: 15px; border-radius: 8px; word-break: break-word; }
                    
                    .napeum-grid, .gunghap-grid, .practical-grid { grid-template-columns: 1fr !important; }
                    .highlight-box { padding: 12px; font-size: 0.95em; word-break: break-word; }
                    .swipe-container { gap: 10px; padding: 5px 0 15px 0; }
                    .timeline-card { flex: 0 0 85px; padding: 12px 5px; }
                    .elements-flex { flex-wrap: wrap; gap: 5px !important; }
                    .elements-flex > div { flex: 1 1 30%; min-width: 50px; padding: 8px !important; }
                }
            `}</style>

            <div className="lang-switcher">
                <span>🌐</span>
                <select value={lang} onChange={(e) => setLang(e.target.value)}>
                    <option value="ko">한국어</option>
                    <option value="ja">日本語</option>
                    <option value="zh-CN">简体中文</option>
                    <option value="zh-TW">繁體中文</option>
                </select>
            </div>

            <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>

            <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <div className={`sidebar-menu ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h3>MYEONGRI</h3>
                    <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
                </div>
                <div className="sidebar-content">
                    <div className="sidebar-item" onClick={() => { setView("home"); setIsSidebarOpen(false); window.scrollTo(0,0); }}>{t.btnHome}</div>
                    <div className="sidebar-item" onClick={() => { setView("input"); setIsSidebarOpen(false); window.scrollTo(0,0); }}>{t.btnProfile}</div>
                    <div className="sidebar-item" onClick={() => { setDictModal({ show: true, keyword: "", results: null }); setIsSidebarOpen(false); }}>{t.btnDict}</div>
                    <div className="sidebar-item" onClick={() => alert('업데이트 준비 중입니다.')}>{t.btnSave}</div>
                    <div className="sidebar-item" onClick={() => alert('업데이트 준비 중입니다.')}>{t.btnFaq}</div>
                    <div className="sidebar-item" onClick={() => alert('업데이트 준비 중입니다.')}>{t.btnCs}</div>
                </div>
                <div className="sidebar-footer">
                    <button className="btn-primary" style={{ marginTop: 0, padding: '12px' }} onClick={() => alert('앱 출시 준비 중입니다.')}>{t.btnApp}</button>
                    <div className="sidebar-login" onClick={() => alert('로그인 기능 준비 중입니다.')}><span>🚪</span> {t.btnLogin}</div>
                </div>
            </div>

            {tooltip.show && tooltip.meta && (
                <div style={{ position: 'fixed', zIndex: 9999, width: '260px', maxWidth: '90vw', backgroundColor: '#222', color: '#fff', textAlign: 'left', borderRadius: '8px', padding: '15px', fontSize: '13px', lineHeight: '1.5', border: '1px solid #444', boxShadow: '0 10px 25px rgba(0,0,0,0.8)', pointerEvents: 'none', fontWeight: 300, top: tooltip.top + 'px', left: tooltip.left + 'px' }}>
                    <strong style={{ color: 'var(--gold-main)' }}>{tooltip.meta.term} {tooltip.meta.hanja ? `(${tooltip.meta.hanja})` : ''}</strong><br /><br />{tooltip.meta.meaning}
                </div>
            )}

            {dictModal.show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header"><h3>{t.btnDict}</h3><button className="close-btn" onClick={() => setDictModal({ show: false, keyword: "", results: null })}>×</button></div>
                        <div className="dict-search-box">
                            <input type="text" placeholder={t.dictPlaceholder} onChange={handleDictSearch} autoFocus />
                        </div>
                        <div className="dict-results">
                            {!dictModal.results ? (<div style={{ textAlign: 'center', color: '#555', marginTop: '30px' }}>{t.dictEmpty}</div>) : dictModal.results.length === 0 ? (<div style={{ textAlign: 'center', color: '#888', marginTop: '30px' }}>{t.dictNoResult}</div>) : (
                                dictModal.results.map((r, idx) => (
                                    <div className="dict-item" key={idx}>
                                        <h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '16px' }}>{r.term} {r.hanja ? `(${r.hanja})` : ''} <span style={{ fontSize: '11px', background: 'rgba(212,175,55,0.2)', padding: '3px 8px', borderRadius: '4px', color: 'var(--gold-main)', marginLeft: '10px' }}>{r.category}</span></h4><p style={{ margin: 0 }}>{r.meaning}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {errorModal.show && (
                <div className="modal-overlay" style={{ zIndex: 4000 }}>
                    <div className="modal-content" style={{ borderLeft: '4px solid var(--accent-red)', height: 'auto' }}>
                        <div className="modal-header"><h3 style={{ color: 'var(--accent-red)' }}>⚠️ System Error</h3><button className="close-btn" onClick={() => setErrorModal({ show: false, msg: "" })}>×</button></div>
                        <div style={{ marginBottom: '15px' }}><textarea readOnly value={errorModal.msg} style={{ width: '100%', height: '150px', background: '#000', color: 'var(--accent-red)', padding: '10px', border: '1px solid #333', borderRadius: '6px', fontFamily: 'monospace', resize: 'none' }}></textarea></div>
                        <button className="btn-primary" style={{ marginTop: 0, background: 'var(--accent-red)', color: '#fff', border: 'none' }} onClick={() => navigator.clipboard.writeText(errorModal.msg)}>Copy Error Log</button>
                    </div>
                </div>
            )}

            {/* ===================== VIEW 1: 대문(Home) 랜딩 페이지 ===================== */}
            {view === "home" && (
                <div className="landing-section">
                    <div className="top-nav"><button className="btn-icon" onClick={() => setDictModal(prev => ({ ...prev, show: true }))}>{t.btnDict}</button></div>
                    <div className="landing-hero">
                        <h1 className="landing-title">
                            {t.landingTitle1}<br/>
                            <span>{t.landingTitle2}</span>{t.landingTitle3}
                        </h1>
                        <p className="landing-subtitle">{t.landingDesc}</p>
                        <button className="btn-cta" onClick={() => { setView("input"); window.scrollTo(0,0); }}>{t.btnStart}</button>
                    </div>
                    <div className="bento-features">
                        <div className="feature-card">
                            <div className="feature-icon">🔮</div>
                            <h3>{t.feature1Title}</h3>
                            <p>{t.feature1Desc}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💞</div>
                            <h3>{t.feature2Title}</h3>
                            <p>{t.feature2Desc}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🧭</div>
                            <h3>{t.feature3Title}</h3>
                            <p>{t.feature3Desc}</p>
                        </div>
                    </div>
                    <div className="system-status"><span className="status-dot"></span> {t.systemStatus}</div>
                </div>
            )}

            {/* ===================== VIEW 2: 프로필 입력폼 ===================== */}
            {view === "input" && (
                <div className="hero-section">
                    <div className="top-nav"><button className="btn-icon" onClick={() => setDictModal(prev => ({ ...prev, show: true }))}>{t.btnDict}</button></div>
                    <h1 className="hero-title">{t.inputTitle}</h1>
                    <div className="hero-subtitle">{t.inputDesc}</div>
                    
                    <form className="input-card" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div>
                                <label>{t.lblBirth}</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select name="calendar_type" value={form.calendar_type} onChange={handleInputChange} style={{ width: '35%' }}><option value="solar">{t.optSolar}</option><option value="lunar">{t.optLunar}</option><option value="lunar_leap">{t.optLunarLeap}</option></select>
                                    <input 
                                        type={form.unknown_time ? "date" : "datetime-local"} 
                                        name="dt_input" 
                                        value={form.dt_input} 
                                        onChange={handleInputChange} 
                                        required 
                                        style={{ width: '65%' }} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label>{t.lblGender}</label>
                                <select name="gender" value={form.gender} onChange={handleInputChange}><option value="M">{t.optMale}</option><option value="F">{t.optFemale}</option></select>
                            </div>

                            <div className="full-width">
                                <label>{t.lblLocation}</label>
                                <select name="location" value={form.location} onChange={handleInputChange}>
                                    {renderLocationOptions()}
                                </select>
                            </div>
                        </div>

                        <div className="options-row">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: 'var(--gold-main)' }}>
                                <input type="checkbox" name="unknown_time" checked={form.unknown_time} onChange={handleInputChange} style={{ width: 'auto' }} /> {t.chkUnknownTime}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input type="checkbox" name="opt_daewun" checked={form.opt_daewun} onChange={handleInputChange} style={{ width: 'auto' }} /> {t.chkDaewun}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input type="checkbox" name="use_traditional" checked={form.use_traditional} onChange={handleInputChange} style={{ width: 'auto' }} /> {t.chkGoBeob}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: 'var(--accent-red)' }}>
                                <input type="checkbox" name="use_partner" checked={form.use_partner} onChange={handleInputChange} style={{ width: 'auto' }} /> {t.chkPartner}
                            </label>
                        </div>

                        {form.opt_daewun && (
                            <div style={{ marginTop: '15px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '6px' }}><label>0~10</label><input type="number" name="daewun_num" value={form.daewun_num} onChange={handleInputChange} min="0" max="10" placeholder="0~10" /></div>
                        )}

                        {form.use_traditional && (
                            <div style={{ marginTop: '15px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '6px' }}><label>1~12</label><input type="number" name="lunar_month" value={form.lunar_month} onChange={handleInputChange} min="1" max="12" /></div>
                        )}

                        {form.use_partner && (
                            <div style={{ marginTop: '25px', background: 'rgba(231,76,60,0.05)', border: '1px solid rgba(231,76,60,0.2)', padding: '20px', borderRadius: '8px' }}>
                                <label style={{ color: 'var(--accent-red)', fontSize: '15px', marginBottom: '15px' }}>{t.lblPartner}</label>
                                
                                <div className="form-grid" style={{ marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <select name="p_calendar_type" value={form.p_calendar_type} onChange={handleInputChange} style={{ width: '35%' }}><option value="solar">{t.optSolar}</option><option value="lunar">{t.optLunar}</option><option value="lunar_leap">{t.optLunarLeap}</option></select>
                                        <input 
                                            type={form.p_unknown_time ? "date" : "datetime-local"} 
                                            name="p_dt_input" 
                                            value={form.p_dt_input} 
                                            onChange={handleInputChange} 
                                            style={{ width: '65%' }} 
                                        />
                                    </div>
                                    <select name="p_gender" value={form.p_gender} onChange={handleInputChange}><option value="F">{t.optFemale}</option><option value="M">{t.optMale}</option></select>
                                </div>
                                
                                <div className="full-width" style={{ marginBottom: '15px' }}>
                                    <label style={{ color: 'var(--accent-red)' }}>{t.lblPartnerLoc}</label>
                                    <select name="p_location" value={form.p_location} onChange={handleInputChange}>
                                        {renderLocationOptions()}
                                    </select>
                                </div>

                                <div className="options-row" style={{ marginTop: '10px', paddingTop: '15px', borderTop: '1px dashed rgba(231,76,60,0.3)' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: 'var(--gold-main)' }}>
                                        <input type="checkbox" name="p_unknown_time" checked={form.p_unknown_time} onChange={handleInputChange} style={{ width: 'auto' }} /> {t.chkUnknownTime}
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                        <input type="checkbox" name="p_opt_daewun" checked={form.p_opt_daewun} onChange={handleInputChange} style={{ width: 'auto' }} /> {t.chkDaewun}
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                        <input type="checkbox" name="p_use_traditional" checked={form.p_use_traditional} onChange={handleInputChange} style={{ width: 'auto' }} /> {t.chkGoBeob}
                                    </label>
                                </div>

                                {form.p_opt_daewun && (
                                    <div style={{ marginTop: '15px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px' }}><label>0~10</label><input type="number" name="p_daewun_num" value={form.p_daewun_num} onChange={handleInputChange} min="0" max="10" placeholder="0~10" /></div>
                                )}
                                {form.p_use_traditional && (
                                    <div style={{ marginTop: '15px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px' }}><label>1~12</label><input type="number" name="p_lunar_month" value={form.p_lunar_month} onChange={handleInputChange} min="1" max="12" /></div>
                                )}
                            </div>
                        )}
                        <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>{loading ? t.btnScanning : t.btnScan}</button>
                    </form>
                </div>
            )}

            {/* ===================== VIEW 3: 대시보드 리포트 ===================== */}
            {view === "dashboard" && resData && (
                <div className="dashboard">
                    <div className="dash-header">
                        <h2>{t.repTitle}</h2>
                        <div>
                            <span style={{ fontSize: '12px', color: '#777', marginRight: '15px' }}>{t.repTime}: <span style={{ color: '#fff' }}>{resData.corrected_time}</span></span>
                            <button className="btn-icon" onClick={handleCopy} style={{ marginRight: '8px' }}>{t.btnCopy}</button>
                            <button className="btn-icon" onClick={() => { hideTooltip(); setView("input"); window.scrollTo(0,0); }} style={{ background: '#333' }}>{t.btnRetry}</button>
                        </div>
                    </div>

                    {resData.applied_traditional && (
                        <div style={{ background: 'rgba(231,76,60,0.1)', borderLeft: '3px solid var(--accent-red)', padding: '15px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px' }}>⚠️ <b>고법(古法) 명리 적용:</b> 천문학적 절기를 무시하고 입력하신 음력 달로 월주가 덮어씌워졌습니다.</div>
                    )}

                    <div className="bazi-table-container">
                        <table className="bazi-table">
                            <thead><tr><th>{t.colYear}</th><th>{t.colMonth}</th><th>{t.colDay}</th><th>{t.colHour}</th></tr></thead>
                            <tbody>
                                <tr>
                                    {['year', 'month', 'day', 'hour'].map(p => {
                                        const bazi = resData.bazi[p];
                                        const hidden = resData.mechanics.hidden_stems[p];
                                        const isGm = resData.mechanics.gongmang.includes(bazi.branch);
                                        const safeStem = (arr, isBold) => {
                                            if (!arr || !arr[0] || arr[0].trim() === '' || arr[0] === 'null' || arr[0] === 'None' || arr[0] === '-') return '-';
                                            const el = renderTooltipItem(arr[0], true);
                                            return isBold ? <b>{el}</b> : el;
                                        };
                                        return (
                                            <td key={p}>
                                                <div className="ten-god">{renderTooltipItem(bazi.stem_tg, false)}</div>
                                                <div className="stem">{renderTooltipItem(bazi.stem, true)}</div>
                                                <div className="branch">{renderTooltipItem(bazi.branch, true)}</div>
                                                <div className="ten-god" style={{ color: 'var(--text-muted)' }}>{renderTooltipItem(bazi.branch_tg, false)}</div>
                                                <div style={{ fontSize: '11px', color: '#555', marginTop: '5px' }}>{t.txtNapeum} {bazi.napeum}</div>
                                                <div style={{ height: '24px', margin: '10px 0 5px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {isGm && <div className="badge badge-bad" style={{ margin: 0 }}>{renderTooltipItem('공망', false, t.txtGongmang)}</div>}
                                                </div>
                                                <div className="hidden-stems">
                                                    <span style={{ color: 'var(--gold-main)', fontSize: '11px', display: 'block', marginBottom: '5px' }}>{t.txtHidden}</span>
                                                    {safeStem(hidden.initial, false)} · {safeStem(hidden.middle, false)} · {safeStem(hidden.main, true)}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="dashboard-layout">
                        
                        {resData.classical?.reading && (
                            <div className="panel">
                                <h3>📜 전문가용 심층 고법 간명지</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {resData.classical.reading.map((sec, i) => (
                                        <div className="highlight-box" style={{ margin: 0, borderLeftColor: 'var(--gold-dark)', background: 'rgba(212,175,55,0.03)' }} key={i}>
                                            <h4 style={{ margin: '0 0 10px 0', color: 'var(--gold-main)', borderBottom: '1px dashed rgba(212,175,55,0.2)', paddingBottom: '5px' }}>{sec.section}</h4>
                                            {sec.items.map((item, j) => (
                                                <div style={{ marginBottom: '10px' }} key={j}>
                                                    {item.title && <div style={{ color: 'var(--accent-blue)', fontWeight: 'bold', fontSize: '14px', marginBottom: '3px' }}>{item.title}</div>}
                                                    {item.hanja && <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '3px', color: '#fff' }}>{renderHanjaString(item.hanja)}</div>}
                                                    <div style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{item.text}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bento-row-2">
                            <div className="bento-col">
                                {resData.yongshin && (
                                    <div className="panel" style={{ height: '100%' }}>
                                        <h3>⚖️ 격국과 용신</h3>
                                        <div className="highlight-box">
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>나의 그릇</div>
                                            <div style={{ fontSize: '18px', color: 'var(--gold-main)', fontWeight: 'bold', marginBottom: '5px' }}>{renderTooltipItem(resData.yongshin.geokguk.name.split('(')[0], false, resData.yongshin.geokguk.name)}</div>
                                            <div style={{ fontSize: '13px' }}>{resData.yongshin.geokguk.desc}</div>
                                        </div>
                                        <div className="highlight-box" style={{ borderLeftColor: 'var(--accent-blue)' }}>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>나의 내공</div>
                                            <div className="status-blue" style={{ marginBottom: '5px' }}>{resData.yongshin.strength.status} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#777' }}>(아군:{resData.yongshin.strength.my_power} 적군:{resData.yongshin.strength.other_power})</span></div>
                                            <div style={{ fontSize: '13px' }}>주체성과 에너지의 강약을 수치화했습니다.</div>
                                        </div>
                                        <div className="highlight-box" style={{ borderLeftColor: 'var(--accent-green)', marginBottom: 0 }}>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>수호신 (조후/억부)</div>
                                            <div style={{ fontSize: '13px', lineHeight: '1.6', marginTop: '5px' }}>
                                                <span className="badge badge-good">용신</span> {resData.yongshin.yongshin.yongshin}<br />
                                                <span className="badge" style={{ borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}>희신</span> {resData.yongshin.yongshin.huishin}<br />
                                                <span className="badge badge-bad">기신</span> {resData.yongshin.yongshin.gishin}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="bento-col">
                                {resData.unse?.year && (
                                    <div className="panel">
                                        <h3>🎯 올해 예측</h3>
                                        {(() => {
                                            const y = resData.unse.year;
                                            const isGood = y.overall_status.includes('발복') || y.overall_status.includes('무난') || y.overall_status.includes('성취');
                                            const bc = isGood ? 'var(--accent-green)' : 'var(--accent-red)';
                                            return (
                                                <>
                                                    <div className="highlight-box" style={{ borderLeftColor: bc }}>
                                                        <div className={isGood ? "status-green" : "status-red"} style={{ marginBottom: '5px' }}>{y.overall_status}</div>
                                                        <div style={{ fontSize: '13px' }}>{y.overall_desc}</div>
                                                    </div>
                                                    {y.events.length > 0 ? y.events.map((ev, i) => {
                                                        const ebc = ev.type === 'good' ? 'var(--accent-green)' : 'var(--accent-red)';
                                                        return (
                                                            <div className="highlight-box" style={{ borderLeftColor: ebc, padding: '10px' }} key={i}>
                                                                <div style={{ color: ebc, fontWeight: 'bold', fontSize: '14px', marginBottom: '3px' }}>{ev.title}</div>
                                                                <div style={{ fontSize: '12px', color: '#ccc' }}>{ev.desc}</div>
                                                            </div>
                                                        )
                                                    }) : <div style={{ fontSize: '12px', color: '#777' }}>올해는 큰 충/합이 없는 평탄한 시기입니다.</div>}
                                                </>
                                            )
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {resData.practical && (
                            <div className="panel">
                                <h3>💼 현대 실용 통변 (직업 & 헬스케어)</h3>
                                <div className="practical-grid">
                                    <div className="highlight-box" style={{ margin: 0, borderLeftColor: 'var(--accent-blue)' }}>
                                        <div style={{ color: 'var(--accent-blue)', fontWeight: 'bold', fontSize: '15px', marginBottom: '5px' }}>🎯 추천 직무: {resData.practical.career.core_trait}</div>
                                        <div style={{ fontSize: '13px', marginBottom: '8px' }}>{resData.practical.career.recommended_jobs}</div>
                                        <div style={{ fontSize: '12px', color: '#aaa', background: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '4px' }}>{resData.practical.career.work_environment}</div>
                                    </div>
                                    <div>
                                        {resData.practical.health.map((h, i) => {
                                            const bc = h.status.includes('양호') ? 'var(--accent-green)' : 'var(--accent-red)';
                                            return (
                                                <div className="highlight-box" style={{ marginBottom: '10px', padding: '10px', borderLeftColor: bc }} key={i}>
                                                    <div style={{ color: bc, fontWeight: 'bold', fontSize: '13px' }}>[{h.element}] {h.status}</div>
                                                    <div style={{ fontSize: '12px', margin: '3px 0' }}>장기: {h.organ} / 증상: {h.symptom}</div>
                                                    <div style={{ fontSize: '11px', color: '#888' }}>{h.advice}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {resData.gunghap && (
                            <div className="panel">
                                <h3>💞 삼원갑자 및 심층 궁합 분석</h3>
                                <div className="gunghap-grid">
                                    <div className="highlight-box" style={{ margin: 0, borderLeftColor: 'var(--accent-blue)' }}>
                                        <div style={{ fontSize: '12px', color: '#aaa' }}>나의 영혼 기운</div>
                                        <div style={{ fontSize: '14px' }}>{resData.gunghap.my_samwon.name} / <b style={{ color: 'var(--accent-blue)' }}>{resData.gunghap.my_star.name}</b></div>
                                    </div>
                                    <div className="highlight-box" style={{ margin: 0, borderLeftColor: 'var(--accent-red)' }}>
                                        <div style={{ fontSize: '12px', color: '#aaa' }}>상대방 영혼 기운</div>
                                        <div style={{ fontSize: '14px' }}>{resData.gunghap.partner_samwon.name} / <b style={{ color: 'var(--accent-red)' }}>{resData.gunghap.partner_star.name}</b></div>
                                    </div>
                                </div>
                                <div className="highlight-box" style={{ borderLeftColor: 'var(--gold-main)' }}>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--gold-main)', marginBottom: '5px' }}>✨ 구궁(九宮) 겉궁합: {resData.gunghap.gugung.status} ({resData.gunghap.gugung.score}점)</div>
                                    <div style={{ fontSize: '13px', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{resData.gunghap.gugung.desc}</div>
                                    <div style={{ background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
                                        <b style={{ color: 'var(--gold-light)' }}>📜 고서 비결:</b> {resData.gunghap.gugung.classical}<br /><br />
                                        <b style={{ color: 'var(--accent-green)' }}>⏰ 발현 응기:</b> {resData.gunghap.gugung.timing}
                                    </div>
                                </div>
                                <div className="highlight-box" style={{ borderLeftColor: '#9b59b6', margin: 0 }}>
                                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#9b59b6', marginBottom: '5px' }}>🔥 일지(日支) 속궁합: {resData.gunghap.inner.relation} - {resData.gunghap.inner.status}</div>
                                    <div style={{ fontSize: '13px' }}>{resData.gunghap.inner.desc}</div>
                                </div>
                            </div>
                        )}

                        <div className="bento-row-3">
                            <div className="bento-col">
                                {resData.mechanics?.elements_dist && (
                                    <div className="panel">
                                        <h3>📊 오행 분포</h3>
                                        <div className="elements-flex" style={{ display: 'flex', gap: '10px' }}>
                                            {['목', '화', '토', '금', '수'].map((el) => {
                                                const colors = { '목': '#2ecc71', '화': '#e74c3c', '토': '#f1c40f', '금': '#bdc3c7', '수': '#3498db' };
                                                return (
                                                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', textAlign: 'center', padding: '10px', borderRadius: '6px', borderBottom: `3px solid ${colors[el]}` }} key={el}>
                                                        <div style={{ fontSize: '12px', color: '#aaa' }}>{el}</div>
                                                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{resData.mechanics.elements_dist[el] || 0}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {resData.elements_imbalance && (
                                    <div className="panel">
                                        <h3>⚖️ 오행 과다/고립 분석</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {resData.elements_imbalance.map((item, i) => {
                                                let cc = item.type === "과다" ? "var(--accent-red)" : (item.type === "고립(無)" ? "#aaa" : "var(--accent-green)");
                                                return (
                                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${cc}`, padding: '10px', borderRadius: '6px' }} key={i}>
                                                        <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '3px', color: cc }}>[{item.element}] {item.type} <span style={{ fontSize: '11px', color: '#888', fontWeight: 'normal' }}>({item.count}개)</span></div>
                                                        <div style={{ fontSize: '12px', color: '#ccc' }}>{item.desc}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bento-col">
                                {specialStarsArray.length > 0 && (
                                    <div className="panel" style={{ height: '100%' }}>
                                        <h3>🌟 심층 신살</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {specialStarsArray.map((star, idx) => (
                                                <div className="highlight-box" style={{ margin: 0, borderLeftColor: 'var(--gold-main)', padding: '15px' }} key={idx}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                                        <span style={{ color: 'var(--gold-light)', fontWeight: 'bold', fontSize: '15px' }}>{renderTooltipItem(star.name.split('(')[0], false)}</span>
                                                        <span className="badge" style={{ margin: 0, border: '1px solid var(--gold-dark)', color: 'var(--gold-main)', background: 'transparent' }}>{renderHanjaString(star.position)}</span>
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: '#ccc', wordBreak: 'keep-all', lineHeight: '1.6' }}>
                                                        {star.desc.split('\n').map((line, l_idx) => (
                                                            <span key={l_idx} style={{ display: 'block', marginBottom: '4px' }}>{line}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bento-col">
                                {disastersArray.length > 0 && (
                                    <div className="panel" style={{ height: '100%' }}>
                                        <h3>⚠️ 상호작용 및 흉액 진단</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {disastersArray.map((dis, idx) => (
                                                <div className="highlight-box" style={{ margin: 0, borderLeftColor: 'var(--accent-red)', padding: '15px' }} key={idx}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                                        <span style={{ color: 'var(--accent-red)', fontWeight: 'bold', fontSize: '15px' }}>{renderTooltipItem(dis.name.split('(')[0], false, dis.name)}</span>
                                                        <span className="badge badge-bad" style={{ margin: 0 }}>{renderHanjaString(dis.position)}</span>
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: '#ccc', wordBreak: 'keep-all', lineHeight: '1.6' }}>
                                                        {dis.desc.split('\n').map((line, l_idx) => (
                                                            <span key={l_idx} style={{ display: 'block', marginBottom: '4px' }}>{line}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}