import React, { useState, useEffect, useRef } from 'react';

// 🔴 파이썬 백엔드 주소 (Render)
const BACKEND_URL = "https://saju-backend-ffum.onrender.com"; 

export default function SajuCalculator() {
    const [view, setView] = useState("hero"); 
    const [loading, setLoading] = useState(false);
    const [resData, setResData] = useState(null);
    const [copyFormattedText, setCopyFormattedText] = useState("");
    
    // 모달 상태
    const [errorModal, setErrorModal] = useState({ show: false, msg: "" });
    const [dictModal, setDictModal] = useState({ show: false, keyword: "", results: null });
    
    // 툴팁 상태
    const [tooltip, setTooltip] = useState({ show: false, meta: null, top: 0, left: 0 });

    // 폼 입력 상태
    const [form, setForm] = useState({
        calendar_type: 'solar', dt_input: '1946-12-07T04:30', gender: 'M',
        opt_daewun: false, daewun_num: '', 
        use_traditional: false, lunar_month: 11,
        use_partner: false, p_calendar_type: 'solar', p_dt_input: '1950-05-12T12:00', p_gender: 'F'
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // ----------------------------------------------------
    // 🚨 모바일 뷰포트 강제 주입 (화면 고정)
    // ----------------------------------------------------
    useEffect(() => {
        let metaViewport = document.querySelector("meta[name=viewport]");
        if (!metaViewport) {
            metaViewport = document.createElement("meta");
            metaViewport.name = "viewport";
            document.head.appendChild(metaViewport);
        }
        metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
        
        const handleScroll = () => hideTooltip();
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);

    const handleDictSearch = async (e) => {
        const keyword = e.target.value;
        setDictModal(prev => ({ ...prev, keyword }));
        if (!keyword) {
            setDictModal(prev => ({ ...prev, results: null }));
            return;
        }
        try {
            const response = await fetch(`${BACKEND_URL}/api/dictionary?q=${encodeURIComponent(keyword)}`);
            const results = await response.json();
            setDictModal(prev => ({ ...prev, results }));
        } catch (err) {
            console.error(err);
        }
    };

    const showTooltip = (e, meta) => {
        if (!meta) return;
        const rect = e.target.getBoundingClientRect();
        let top = rect.top - 120;
        let left = rect.left + (rect.width / 2) - 130;
        
        if (top < 10) top = rect.bottom + 10;
        if (left < 10) left = 10;
        if (left + 260 > window.innerWidth - 10) left = window.innerWidth - 270;

        setTooltip({ show: true, meta, top, left });
    };
    const hideTooltip = () => setTooltip(prev => ({ ...prev, show: false }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                datetime_str: form.dt_input.replace('T', ' '),
                calendar_type: form.calendar_type,
                gender: form.gender,
                longitude: 127.0,
                apply_true_solar: true, apply_yaja: true,
                apply_traditional_lunar: form.use_traditional,
                lunar_month: form.use_traditional ? parseInt(form.lunar_month) : null
            };
            if (form.opt_daewun && form.daewun_num !== '') payload.daewun_num = parseInt(form.daewun_num);
            if (form.use_partner) {
                payload.partner_datetime_str = form.p_dt_input.replace('T', ' ');
                payload.partner_calendar_type = form.p_calendar_type;
                payload.partner_gender = form.p_gender;
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
            generateCopyText(res); 
            setView("dashboard");
            window.scrollTo(0, 0);

        } catch (err) {
            setErrorModal({ show: true, msg: `서버 연산 중 에러:\n\n${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    const generateCopyText = (res) => {
        let txt = `======================================\n   [ MYEONGRI MASTER 분석 리포트 ]\n======================================\n\n명식 복사 기능은 전체 텍스트 구조 개편으로 인해 현재 점검 중입니다.`;
        setCopyFormattedText(txt);
    };

    const handleCopy = () => {
        if (!copyFormattedText) return alert("복사할 데이터가 없습니다.");
        navigator.clipboard.writeText(copyFormattedText)
            .then(() => alert("분석 결과가 깔끔한 텍스트 리포트로 복사되었습니다.\n카카오톡이나 메모장에 붙여넣기 하세요."))
            .catch(err => alert("복사 실패: " + err));
    };

    const renderTooltipItem = (keyword, isChar = true, text = null) => {
        if (!resData) return text || keyword;
        const metaDict = resData.mechanics.metadata || {};
        const meta = metaDict[keyword];
        const display = text || keyword;
        if (!meta) return <span key={Math.random()}>{display}</span>;
        
        const cssClass = isChar ? "hanja-tooltip char-tooltip" : "hanja-tooltip";
        return (
            <span key={Math.random()} className={cssClass} onMouseEnter={(e) => showTooltip(e, meta)} onMouseLeave={hideTooltip}>
                {display}
            </span>
        );
    };

    const renderHanjaString = (str) => {
        if (!str) return "";
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

    return (
        <div className="app-container">
            {/* ===================== CSS 스타일 내장 ===================== */}
            <style>{`
                :root { --bg-color: #0d0f12; --card-bg: #16181d; --text-main: #f1f2f6; --text-muted: #95a5a6; --gold-light: #f1c40f; --gold-main: #d4af37; --gold-dark: #b5952f; --accent-red: #e74c3c; --accent-blue: #3498db; --accent-green: #2ecc71; }
                
                /* 하얀 여백 완벽 제거 및 가로 스크롤 방지 */
                html, body, #root, #__next { 
                    margin: 0 !important; padding: 0 !important; 
                    background-color: var(--bg-color) !important; 
                    width: 100%; max-width: 100vw; min-height: 100vh; overflow-x: hidden; 
                }
                
                /* 긴 텍스트 잘림 방지 */
                * { box-sizing: border-box; overflow-wrap: break-word !important; word-wrap: break-word !important; }
                div, p, span, h3, h4 { word-break: keep-all; }

                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: var(--bg-color); }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

                .app-container { font-family: "'Noto Serif KR', serif"; background: var(--bg-color); min-height: 100vh; color: var(--text-main); width: 100%; max-width: 100vw; overflow-x: hidden; }

                .hero-section { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; background: radial-gradient(circle at center, #1a1e24 0%, var(--bg-color) 100%); text-align: center; position: relative; }
                .hero-title { font-size: 3rem; font-weight: 900; letter-spacing: 2px; margin-bottom: 10px; color: var(--gold-main); text-shadow: 0 4px 15px rgba(212,175,55,0.2); }
                .hero-subtitle { font-size: 1.1rem; color: var(--text-muted); margin-bottom: 40px; font-weight: 300; }
                
                .input-card { background: var(--card-bg); padding: 30px; border-radius: 12px; width: 100%; max-width: 700px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; overflow: hidden; }
                .input-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg, transparent, var(--gold-main), transparent); }
                
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; text-align: left; }
                .options-row { display: flex; gap: 15px; margin-top: 20px; font-size: 13px; }
                
                label { font-size: 13px; font-weight: 700; color: var(--gold-light); margin-bottom: 5px; display: block; }
                input, select { width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid #333; color: white; border-radius: 6px; font-family: inherit; font-size: 14px; transition: all 0.3s; }
                input:focus, select:focus { border-color: var(--gold-main); outline: none; }
                
                .btn-primary { width: 100%; padding: 15px; background: linear-gradient(135deg, var(--gold-dark), var(--gold-main)); color: #000; border: none; border-radius: 6px; font-size: 16px; font-weight: 900; cursor: pointer; margin-top: 25px; transition: transform 0.2s, box-shadow 0.2s; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212,175,55,0.4); }
                
                .top-nav { position: absolute; top: 20px; right: 20px; z-index: 100; }
                .btn-icon { background: rgba(255,255,255,0.1); color: white; border: 1px solid #333; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 13px; transition: 0.3s; }
                .btn-icon:hover { background: var(--gold-main); color: #000; border-color: var(--gold-main); }
                
                .dashboard { padding: 40px 20px; max-width: 1200px; margin: auto; width: 100%; box-sizing: border-box; }
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
                
                .panel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; align-items: start; width: 100%; }
                .panel { background: var(--card-bg); padding: 25px; border-radius: 12px; border: 1px solid #222; box-shadow: 0 5px 15px rgba(0,0,0,0.2); display: flex; flex-direction: column; text-align: left !important; width: 100%; min-width: 0; box-sizing: border-box; }
                .panel-full { grid-column: 1 / -1; }
                .panel h3 { margin-top: 0; color: var(--gold-main); font-size: 1.1rem; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px; text-align: left !important; }
                
                .highlight-box { background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border-left: 3px solid var(--gold-main); margin-bottom: 15px; text-align: left !important; min-width: 0; }
                
                .napeum-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
                .gunghap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
                .practical-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; }
                
                .swipe-container { display: flex; gap: 15px; overflow-x: auto; padding: 10px 5px 25px 5px; cursor: grab; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; min-width: 0; }
                .swipe-container::-webkit-scrollbar { display: none; }
                .timeline-card { flex: 0 0 100px; background: rgba(255,255,255,0.03); border: 1px solid #333; border-radius: 8px; text-align: center !important; padding: 15px 10px; transition: 0.3s; user-select: none; }
                .timeline-card:hover { background: rgba(212,175,55,0.1); border-color: var(--gold-dark); transform: translateY(-3px); }
                .timeline-card.current-year { border: 2px solid var(--gold-main) !important; background: rgba(212,175,55,0.2) !important; box-shadow: 0 0 15px rgba(212,175,55,0.5); transform: scale(1.05); }

                .badge { display: inline-block; padding: 4px 8px; background: rgba(255,255,255,0.05); border: 1px solid #444; border-radius: 4px; font-size: 12px; margin: 3px; font-weight: 700; color: #ccc; }
                .badge-good { border-color: var(--accent-green); color: var(--accent-green); background: rgba(46,204,113,0.1); }
                .badge-bad { border-color: var(--accent-red); color: var(--accent-red); background: rgba(231,76,60,0.1); }
                .hanja-tooltip { display: inline-block; cursor: pointer; color: var(--gold-main); border-bottom: 1px dashed rgba(212,175,55,0.5); }
                .hanja-tooltip.char-tooltip { color: #fff; border-bottom: none; }
                
                .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index: 2000; backdrop-filter: blur(5px); }
                .modal-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--card-bg); width: 90%; max-width: 600px; max-height: 80vh; border-radius: 12px; padding: 25px; display: flex; flex-direction: column; border: 1px solid #333; box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: left; }
                .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
                .modal-header h3 { margin: 0; color: var(--gold-main); }
                .close-btn { background: none; border: none; font-size: 28px; color: #888; cursor: pointer; }
                .dict-search-box input { width: 100%; padding: 15px; font-size: 15px; background: #000; border-radius: 8px; color: white; border: 1px solid #333; }
                .dict-results { overflow-y: auto; padding-right: 10px; margin-top: 15px; }
                .dict-item { background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border-left: 4px solid var(--gold-main); margin-bottom: 15px; }


                /* 📱📱 🚨 모바일 전용 반응형 셋팅 🚨 📱📱 */
                @media (max-width: 768px) {
                    .hero-title { font-size: 1.8rem; }
                    .hero-subtitle { font-size: 0.9rem; word-break: keep-all; padding: 0 10px; }
                    .input-card { padding: 20px 15px; border-radius: 0; border-left: none; border-right: none; }
                    .form-grid { grid-template-columns: 1fr; gap: 15px; } 
                    .options-row { flex-direction: column; align-items: flex-start; gap: 10px; } 
                    .dashboard { padding: 15px 10px; overflow-x: hidden; }
                    .dash-header { flex-direction: column; gap: 10px; align-items: flex-start; }
                    .dash-header div { width: 100%; display: flex; justify-content: space-between; }
                    .bazi-table-container { padding: 15px 5px; border-radius: 8px; }
                    .bazi-table th { font-size: 11px; padding-bottom: 8px; }
                    .bazi-table td { padding: 10px 2px; }
                    .stem, .branch { font-size: 26px; }
                    .hidden-stems { font-size: 10px; padding: 8px 2px; letter-spacing: 0; word-break: break-all; }
                    .panel { padding: 15px; border-radius: 8px; word-break: break-word; }
                    .panel-grid { grid-template-columns: 1fr; gap: 15px; width: 100%; }
                    .napeum-grid, .gunghap-grid, .practical-grid { grid-template-columns: 1fr !important; }
                    .highlight-box { padding: 12px; font-size: 0.95em; word-break: break-word; }
                    .swipe-container { gap: 10px; padding: 5px 0 15px 0; }
                    .timeline-card { flex: 0 0 85px; padding: 12px 5px; }
                    .elements-flex { flex-wrap: wrap; gap: 5px !important; }
                    .elements-flex > div { flex: 1 1 30%; min-width: 50px; padding: 8px !important; }
                }
            `}</style>

            {/* 전역 툴팁 */}
            {tooltip.show && tooltip.meta && (
                <div style={{ position: 'fixed', zIndex: 9999, width: '260px', maxWidth: '90vw', backgroundColor: '#222', color: '#fff', textAlign: 'left', borderRadius: '8px', padding: '15px', fontSize: '13px', lineHeight: '1.5', border: '1px solid #444', boxShadow: '0 10px 25px rgba(0,0,0,0.8)', pointerEvents: 'none', fontWeight: 300, top: tooltip.top + 'px', left: tooltip.left + 'px' }}>
                    <strong style={{ color: 'var(--gold-main)' }}>{tooltip.meta.term} {tooltip.meta.hanja ? `(${tooltip.meta.hanja})` : ''}</strong><br /><br />{tooltip.meta.meaning}
                </div>
            )}

            {/* 백과사전 모달 */}
            {dictModal.show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header"><h3>📖 마스터 백과사전</h3><button className="close-btn" onClick={() => setDictModal({ show: false, keyword: "", results: null })}>×</button></div>
                        <div className="dict-search-box"><input type="text" placeholder="궁금한 용어나 한자를 입력하세요" onChange={handleDictSearch} autoFocus /></div>
                        <div className="dict-results">
                            {!dictModal.results ? (<div style={{ textAlign: 'center', color: '#555', marginTop: '30px' }}>검색어를 입력하시면 전문 해설이 나타납니다.</div>) : dictModal.results.length === 0 ? (<div style={{ textAlign: 'center', color: '#888', marginTop: '30px' }}>검색 결과가 없습니다.</div>) : (
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

            {/* 에러 모달 */}
            {errorModal.show && (
                <div className="modal-overlay" style={{ zIndex: 3000 }}>
                    <div className="modal-content" style={{ borderLeft: '4px solid var(--accent-red)' }}>
                        <div className="modal-header"><h3 style={{ color: 'var(--accent-red)' }}>⚠️ 시스템 오류 안내</h3><button className="close-btn" onClick={() => setErrorModal({ show: false, msg: "" })}>×</button></div>
                        <div style={{ marginBottom: '15px' }}><textarea readOnly value={errorModal.msg} style={{ width: '100%', height: '150px', background: '#000', color: 'var(--accent-red)', padding: '10px', border: '1px solid #333', borderRadius: '6px', fontFamily: 'monospace', resize: 'none' }}></textarea></div>
                        <button className="btn-primary" style={{ marginTop: 0, background: 'var(--accent-red)', color: '#fff', border: 'none' }} onClick={() => navigator.clipboard.writeText(errorModal.msg)}>오류 내용 복사하기</button>
                    </div>
                </div>
            )}

            {/* 입력 폼 (Hero) */}
            {view === "hero" && (
                <div className="hero-section">
                    <div className="top-nav"><button className="btn-icon" onClick={() => setDictModal(prev => ({ ...prev, show: true }))}>📖 사전 열기</button></div>
                    <h1 className="hero-title">MYEONGRI MASTER</h1>
                    <div className="hero-subtitle">대한민국 1% 명리 마스터를 위한 초정밀 예측 시스템</div>
                    <form className="input-card" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div>
                                <label>본인 생년월일시</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select name="calendar_type" value={form.calendar_type} onChange={handleInputChange} style={{ width: '35%' }}><option value="solar">양력</option><option value="lunar">음력(평달)</option><option value="lunar_leap">음력(윤달)</option></select>
                                    <input type="datetime-local" name="dt_input" value={form.dt_input} onChange={handleInputChange} required style={{ width: '65%' }} />
                                </div>
                            </div>
                            <div>
                                <label>본인 성별</label>
                                <select name="gender" value={form.gender} onChange={handleInputChange}><option value="M">남성 (Male)</option><option value="F">여성 (Female)</option></select>
                            </div>
                        </div>

                        <div className="options-row">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}><input type="checkbox" name="opt_daewun" checked={form.opt_daewun} onChange={handleInputChange} style={{ width: 'auto' }} /> 대운수 수동지정</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}><input type="checkbox" name="use_traditional" checked={form.use_traditional} onChange={handleInputChange} style={{ width: 'auto' }} /> 고법 둔월법</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: 'var(--accent-red)' }}><input type="checkbox" name="use_partner" checked={form.use_partner} onChange={handleInputChange} style={{ width: 'auto' }} /> 💘 파트너 궁합</label>
                        </div>

                        {form.opt_daewun && (
                            <div style={{ marginTop: '15px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '6px' }}><label>대운수 지정 (미입력시 자동)</label><input type="number" name="daewun_num" value={form.daewun_num} onChange={handleInputChange} min="0" max="10" placeholder="0~10 입력" /></div>
                        )}

                        {form.use_traditional && (
                            <div style={{ marginTop: '15px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '6px' }}><label>고법(古法) 음력 월 강제 지정</label><input type="number" name="lunar_month" value={form.lunar_month} onChange={handleInputChange} min="1" max="12" /></div>
                        )}

                        {form.use_partner && (
                            <div style={{ marginTop: '15px', background: 'rgba(231,76,60,0.05)', border: '1px solid rgba(231,76,60,0.2)', padding: '15px', borderRadius: '6px' }}>
                                <label style={{ color: 'var(--accent-red)' }}>상대방 (궁합용)</label>
                                <div className="form-grid" style={{ marginBottom: 0 }}>
                                    <div style={{ display: 'flex', gap: '10px' }}><select name="p_calendar_type" value={form.p_calendar_type} onChange={handleInputChange} style={{ width: '35%' }}><option value="solar">양력</option><option value="lunar">음력(평달)</option><option value="lunar_leap">음력(윤달)</option></select><input type="datetime-local" name="p_dt_input" value={form.p_dt_input} onChange={handleInputChange} style={{ width: '65%' }} /></div>
                                    <select name="p_gender" value={form.p_gender} onChange={handleInputChange}><option value="F">여성 (Female)</option><option value="M">남성 (Male)</option></select>
                                </div>
                            </div>
                        )}
                        <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>{loading ? "연산 중 (Processing...)" : "운명 스캔 시작 (SCAN)"}</button>
                    </form>
                </div>
            )}

            {/* 대시보드 */}
            {view === "dashboard" && resData && (
                <div className="dashboard">
                    <div className="dash-header">
                        <h2>분석 리포트</h2>
                        <div>
                            <span style={{ fontSize: '12px', color: '#777', marginRight: '15px' }}>진태양시 보정: <span style={{ color: '#fff' }}>{resData.corrected_time}</span></span>
                            <button className="btn-icon" onClick={handleCopy} style={{ marginRight: '8px' }}>📋 복사</button><button className="btn-icon" onClick={() => { setView("hero"); window.scrollTo(0,0); }} style={{ background: '#333' }}>⟲ 다시하기</button>
                        </div>
                    </div>

                    {resData.applied_traditional && (
                        <div style={{ background: 'rgba(231,76,60,0.1)', borderLeft: '3px solid var(--accent-red)', padding: '15px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px' }}>⚠️ <b>고법(古法) 명리 적용:</b> 천문학적 절기를 무시하고 입력하신 음력 달로 월주가 덮어씌워졌습니다.</div>
                    )}

                    <div className="bazi-table-container">
                        <table className="bazi-table">
                            <thead><tr><th>연주 (Year)</th><th>월주 (Month)</th><th>일주 (Day)</th><th>시주 (Hour)</th></tr></thead>
                            <tbody>
                                <tr>
                                    {['year', 'month', 'day', 'hour'].map(p => {
                                        const bazi = resData.bazi[p];
                                        const hidden = resData.mechanics.hidden_stems[p];
                                        const isGm = resData.mechanics.gongmang.includes(bazi.branch);
                                        const safeStem = (arr, isBold) => {
                                            if (!arr || !arr[0] || arr[0].trim() === '' || arr[0] === 'null' || arr[0] === 'None') return '-';
                                            const el = renderTooltipItem(arr[0], true);
                                            return isBold ? <b>{el}</b> : el;
                                        };
                                        return (
                                            <td key={p}>
                                                <div className="ten-god">{renderTooltipItem(bazi.stem_tg, false)}</div>
                                                <div className="stem">{renderTooltipItem(bazi.stem, true)}</div>
                                                <div className="branch">{renderTooltipItem(bazi.branch, true)}</div>
                                                <div className="ten-god" style={{ color: 'var(--text-muted)' }}>{renderTooltipItem(bazi.branch_tg, false)}</div>
                                                <div style={{ fontSize: '11px', color: '#555', marginTop: '5px' }}>[납음] {bazi.napeum}</div>
                                                <div style={{ height: '24px', margin: '10px 0 5px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {isGm && <div className="badge badge-bad" style={{ margin: 0 }}>{renderTooltipItem('공망', false)}</div>}
                                                </div>
                                                <div className="hidden-stems">
                                                    <span style={{ color: 'var(--gold-main)', fontSize: '11px', display: 'block', marginBottom: '5px' }}>지장간</span>
                                                    {safeStem(hidden.initial, false)} · {safeStem(hidden.middle, false)} · {safeStem(hidden.main, true)}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="panel-grid">
                        {/* 1. 심층 간명지 */}
                        {resData.classical?.reading && (
                            <div className="panel panel-full">
                                <h3>📜 전문가용 심층 고법 간명지</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {resData.classical.reading.map((sec, i) => (
                                        <div className="highlight-box" style={{ margin: 0, borderLeftColor: 'var(--gold-dark)', background: 'rgba(212,175,55,0.03)' }} key={i}>
                                            <h4 style={{ margin: '0 0 10px 0', color: 'var(--gold-main)', borderBottom: '1px dashed rgba(212,175,55,0.2)', paddingBottom: '5px' }}>{sec.section}</h4>
                                            {sec.items.map((item, j) => (
                                                <div style={{ marginBottom: '10px' }} key={j}>
                                                    {item.title && <div style={{ color: 'var(--accent-blue)', fontWeight: 'bold', fontSize: '14px', marginBottom: '3px' }}>{item.title}</div>}
                                                    {item.hanja && <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '3px', color: '#fff' }}>{renderHanjaString(item.hanja)}</div>}
                                                    <div style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.5' }}>{item.text}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                {resData.classical.stars && (
                                    <>
                                        <h4 style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>[참고] 당사주 12성 흐름</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {Object.entries(resData.classical.stars).map(([pillar, star]) => (
                                                <div style={{ flex: 1, minWidth: '120px', background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '6px', border: '1px solid #333' }} key={pillar}>
                                                    <div style={{ fontSize: '11px', color: '#777' }}>{pillar === 'year' ? '초년(연)' : pillar === 'month' ? '청년(월)' : pillar === 'day' ? '중년(일)' : '말년(시)'}</div>
                                                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--gold-dark)' }}>{star.name}</div>
                                                    <div style={{ fontSize: '12px', color: '#ccc', marginTop: '5px', lineHeight: '1.4' }}>{star.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* 2. 격국과 용신 */}
                        {resData.yongshin && (
                            <div className="panel">
                                <h3>⚖️ 격국(格局)과 용신(用神)</h3>
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

                        {/* 3. 올해 예측 */}
                        {resData.unse?.year && (
                            <div className="panel">
                                <h3>🎯 올해({new Date().getFullYear()}년) 예측</h3>
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

                        {/* 4. 이달과 오늘의 운세 */}
                        {resData.unse?.month && resData.unse?.day && (
                            <div className="panel">
                                <h3>📅 이달과 오늘의 운세</h3>
                                {(() => {
                                    const m = resData.unse.month;
                                    const d = resData.unse.day;
                                    const mGood = m.data.overall_status.includes('발복') || m.data.overall_status.includes('무난') || m.data.overall_status.includes('성취');
                                    const dGood = d.data.overall_status.includes('발복') || d.data.overall_status.includes('무난') || d.data.overall_status.includes('성취');
                                    return (
                                        <>
                                            <div className="highlight-box" style={{ borderLeftColor: mGood ? 'var(--accent-green)' : 'var(--accent-blue)' }}>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>■ {m.month_num}월 이달의 운세 ({renderTooltipItem(m.stem, true)}{renderTooltipItem(m.branch, true)}월)</div>
                                                <div className={mGood ? "status-green" : "status-red"} style={{ marginBottom: '5px', fontSize: '1.1rem' }}>{m.data.overall_status}</div>
                                                <div style={{ fontSize: '13px' }}>{m.data.overall_desc}</div>
                                            </div>
                                            <div className="highlight-box" style={{ borderLeftColor: dGood ? 'var(--accent-green)' : 'var(--gold-main)', marginBottom: 0 }}>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>■ {d.day_num}일 오늘의 운세 ({renderTooltipItem(d.stem, true)}{renderTooltipItem(d.branch, true)}일)</div>
                                                <div className={dGood ? "status-green" : "status-red"} style={{ marginBottom: '5px', fontSize: '1.1rem' }}>{d.data.overall_status}</div>
                                                <div style={{ fontSize: '13px' }}>{d.data.overall_desc}</div>
                                            </div>
                                        </>
                                    )
                                })()}
                            </div>
                        )}

                        {/* 5. 실용 통변 (직업 & 헬스케어) */}
                        {resData.practical && (
                            <div className="panel panel-full">
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

                        {/* 6. 납음오행 */}
                        {resData.napeum_reading && (
                            <div className="panel panel-full">
                                <h3>🎵 납음오행(納音五行)의 숨은 파동</h3>
                                <div className="napeum-grid">
                                    {resData.napeum_reading.map((n, i) => (
                                        <div className="highlight-box" style={{ margin: 0, borderLeftColor: 'var(--gold-main)', padding: '15px' }} key={i}>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '3px' }}>{n.pillar}</div>
                                            <div style={{ color: 'var(--gold-light)', fontWeight: 'bold', fontSize: '15px', marginBottom: '5px' }}>[납음] {n.full}</div>
                                            <div style={{ fontSize: '12px', color: '#ccc', wordBreak: 'keep-all', lineHeight: '1.4' }}>{n.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 7. 궁합 분석 */}
                        {resData.gunghap && (
                            <div className="panel panel-full">
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
                                    <div style={{ fontSize: '13px', marginBottom: '10px' }}>{resData.gunghap.gugung.desc}</div>
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

                        {/* 8. 인생 타임라인 */}
                        {resData.timeline && (
                            <div className="panel panel-full">
                                <h3>⏳ 인생 타임라인 (스와이프 하여 확인)</h3>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>■ 대운 (10년 주기 / {resData.timeline.daewun.direction})</div>
                                <div className="swipe-container" ref={el => attachSwipe(el)}>
                                    {resData.timeline.daewun.timeline.map((dw, i) => (
                                        <div className="timeline-card" key={i}>
                                            <div className="timeline-age">{dw.age}세~</div>
                                            <div style={{ fontSize: '11px', color: 'var(--gold-main)', marginBottom: '2px' }}>{renderTooltipItem(dw.stem_tg, false)}</div>
                                            <div className="timeline-ganzhi">{renderTooltipItem(dw.stem, true)}<br />{renderTooltipItem(dw.branch, true)}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--gold-main)', marginTop: '2px' }}>{renderTooltipItem(dw.branch_tg, false)}</div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '15px', marginBottom: '5px' }}>■ 최근 10년 세운 (과거 4년 ~ 미래 5년)</div>
                                <div className="swipe-container" ref={el => attachSwipe(el)}>
                                    {resData.timeline.sewun.map((sw, i) => {
                                        const isCurrent = sw.year === new Date().getFullYear();
                                        return (
                                            <div className={`timeline-card ${isCurrent ? 'current-year' : ''}`} key={i}>
                                                <div className="timeline-age" style={{ fontWeight: isCurrent ? '900' : 'normal', color: isCurrent ? 'var(--gold-main)' : '#ccc' }}>
                                                    {sw.year}년 {isCurrent && <span style={{fontSize:'10px', display:'block'}}>(올해)</span>}
                                                </div>
                                                <div style={{ fontSize: '11px', color: 'var(--gold-main)', marginBottom: '2px' }}>{renderTooltipItem(sw.stem_tg, false)}</div>
                                                <div className="timeline-ganzhi">{renderTooltipItem(sw.stem, true)}<br />{renderTooltipItem(sw.branch, true)}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--gold-main)', marginTop: '2px' }}>{renderTooltipItem(sw.branch_tg, false)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 9. 오행 분포 */}
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

                        {/* 10. 통근력 */}
                        <div className="panel">
                            <h3>🌱 통근력 (아성)</h3>
                            {(() => {
                                let power = resData.mechanics.tonggeun.total_power;
                                let rootText = "";
                                if (!resData.mechanics.tonggeun.has_root || power < 10) rootText = "지지에 뿌리가 극히 미약하거나 없어 주관이 흔들리기 쉽습니다.";
                                else if (power < 30) rootText = "지지에 미약하게나마 뿌리를 내리고 있어 간신히 버티는 형국입니다.";
                                else if (power < 60) rootText = "뿌리가 제법 튼튼하여 어지간한 풍파에도 휩쓸리지 않습니다.";
                                else rootText = "뿌리가 매우 깊고 강력하여 태풍이 불어도 절대 흔들리지 않는 굳건함이 있습니다.";
                                return <div style={{ fontSize: '13px' }}>총 파워: <b>{power}</b><br />{rootText}</div>
                            })()}
                        </div>

                        {/* 🚨 11. 심층 신살 (초정밀 분석 박스로 교체) */}
                        {resData.dynamics && Array.isArray(resData.dynamics.special_stars) && resData.dynamics.special_stars.length > 0 && (
                            <div className="panel">
                                <h3>🌟 심층 신살</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {resData.dynamics.special_stars.map((star, idx) => (
                                        <div className="highlight-box" style={{ margin: 0, borderLeftColor: 'var(--gold-main)', padding: '15px' }} key={idx}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                                <span style={{ color: 'var(--gold-light)', fontWeight: 'bold', fontSize: '15px' }}>{renderTooltipItem(star.name, false)}</span>
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

                        {/* 12. 오행 과다/고립 분석 */}
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

                        {/* 🚨 13. 상호작용 및 흉액 진단 (초정밀 분석 박스로 교체) */}
                        {resData.dynamics && Array.isArray(resData.dynamics.disasters) && resData.dynamics.disasters.length > 0 && (
                            <div className="panel">
                                <h3>⚠️ 상호작용 및 흉액 진단</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {resData.dynamics.disasters.map((dis, idx) => (
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
            )}
        </div>
    );
}