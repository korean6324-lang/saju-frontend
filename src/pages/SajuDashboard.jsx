// src/pages/SajuDashboard.jsx
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas'; 
import { fetchSajuAnalysis, fetchGunghapAnalysis } from '../api/client';
import SajuForm from '../components/SajuForm';
import BaziMatrix from '../components/BaziMatrix';
import ElementsChart from '../components/ElementsChart';
import DaewunScanner from '../components/DaewunScanner';
import DynamicsScanner from '../components/DynamicsScanner';
import PracticalScanner from '../components/PracticalScanner';
import SecretScanner from '../components/SecretScanner';
import UnseScanner from '../components/UnseScanner';
import DangsajuScanner from '../components/DangsajuScanner';
import GunghapPanel from '../components/GunghapPanel';
import ManseryeokCalendar from '../components/ManseryeokCalendar';

export default function SajuDashboard() {
    const [result, setResult] = useState(null);
    const [gunghapResult, setGunghapResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // 🚨 첫인상을 고급스럽게 주기 위해 기본값을 다크모드(true)로 설정
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    
    const reportRef = useRef(null);

    const handleAnalyze = async (payload) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        setGunghapResult(null);

        try {
            if (payload.type === 'single') {
                const data = await fetchSajuAnalysis(payload.user);
                setResult(data);
            } else if (payload.type === 'gunghap') {
                const data = await fetchGunghapAnalysis({ person1: payload.person1, person2: payload.person2 });
                setGunghapResult(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setGunghapResult(null);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSaveImage = async () => {
        if (!reportRef.current) return;
        try {
            const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
            const link = document.createElement('a');
            link.download = `명리_마스터리포트_${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            alert("이미지 저장 중 오류가 발생했습니다.");
            console.error(err);
        }
    };

    // 🔮 모던 미스틱 우주 테마 팔레트 
    const theme = {
        bg: 'radial-gradient(ellipse at top right, #161A28 0%, #090A0F 100%)', 
        panelBg: 'rgba(20, 24, 39, 0.45)', 
        glassInner: 'rgba(255, 255, 255, 0.03)', 
        text: '#F4F4F5', 
        textMuted: '#A0AEC0', 
        border: 'rgba(255, 255, 255, 0.08)', 
        accent: '#D6BCFA', // 기본 오로라 퍼플
        accentGlow: '0 0 10px rgba(214, 188, 250, 0.4)',
        romancePrimary: '#F687B3', // 로즈 핑크 (맞춤 인연)
        romancePrimaryGlow: '0 0 12px rgba(246, 135, 179, 0.5)',
        romanceSecondary: '#B794F4', // 딥 퍼플 (맞춤 인연)
        romanceSecondaryGlow: '0 0 12px rgba(183, 148, 244, 0.5)',
        good: '#4FD1C5', // 신비로운 민트 (길방)
        goodGlow: '0 0 10px rgba(79, 209, 197, 0.4)',
        danger: '#FC8181', // 코랄 핑크 (흉방)
        dangerGlow: '0 0 10px rgba(252, 129, 129, 0.4)',
    };

    // 🔮 유리 질감(Glassmorphism) 래퍼
    const SectionWrapper = ({ title, children, noBorderBottom = false }) => (
        <div style={{ 
            padding: '35px 25px', 
            background: theme.panelBg,
            backdropFilter: 'blur(16px)', 
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${theme.border}`,
            borderRadius: '24px', 
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
            marginBottom: '24px',
            color: theme.text
        }}>
            {title && (
                <h3 style={{ 
                    color: theme.text, 
                    margin: '0 0 24px 0', 
                    fontSize: '18px', 
                    fontFamily: '"Noto Serif KR", serif', 
                    fontWeight: '300', 
                    letterSpacing: '1px',
                    textAlign: 'center' 
                }}>
                    ✧ {title} ✧
                </h3>
            )}
            <div style={{ fontFamily: '"Noto Sans KR", sans-serif', fontWeight: '300' }}>
                {children}
            </div>
        </div>
    );

    const IdealPartnerPanel = ({ data }) => {
        if (!data || data.status !== 'success') return null;
        
        return (
            <SectionWrapper title="나를 위한 우주의 맞춤 인연">
                <p style={{ color: theme.textMuted, marginBottom: '35px', fontSize: '13px', lineHeight: '1.7', textAlign: 'center', fontWeight: '300' }}>
                    구궁(九宮) 역산을 통해 당신과 만났을 때 <strong>가장 완벽한 시너지를 내는 {data.target_gender_label}의 나이와 띠</strong>를 추적했습니다.
                </p>

                <div style={{ marginBottom: '35px' }}>
                    <h4 style={{ 
                        color: theme.romancePrimary, 
                        textShadow: theme.romancePrimaryGlow, 
                        margin: '0 0 12px 0', 
                        fontSize: '15px', 
                        fontWeight: '400',
                        letterSpacing: '0.5px'
                    }}>
                        💖 1순위: 생기(生氣) 대길합
                    </h4>
                    <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: theme.text, lineHeight: '1.7', fontWeight: '300' }}>
                        {data.recommendations?.생기?.reasoning}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {data.recommendations?.생기?.years?.map((y, i) => (
                            <span key={i} style={{ 
                                padding: '8px 18px', 
                                background: 'rgba(246, 135, 179, 0.05)', 
                                border: `1px solid rgba(246, 135, 179, 0.2)`, 
                                borderRadius: '20px', 
                                color: theme.text, 
                                fontSize: '13px',
                                fontWeight: '400',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}>
                                {y}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 style={{ 
                        color: theme.romanceSecondary, 
                        textShadow: theme.romanceSecondaryGlow, 
                        margin: '0 0 12px 0', 
                        fontSize: '15px', 
                        fontWeight: '400',
                        letterSpacing: '0.5px'
                    }}>
                        💍 2순위: 연년(延年) 길합
                    </h4>
                    <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: theme.text, lineHeight: '1.7', fontWeight: '300' }}>
                        {data.recommendations?.연년?.reasoning}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {data.recommendations?.연년?.years?.map((y, i) => (
                            <span key={i} style={{ 
                                padding: '8px 18px', 
                                background: 'rgba(183, 148, 244, 0.05)', 
                                border: `1px solid rgba(183, 148, 244, 0.2)`, 
                                borderRadius: '20px', 
                                color: theme.text, 
                                fontSize: '13px',
                                fontWeight: '400',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}>
                                {y}
                            </span>
                        ))}
                    </div>
                </div>
            </SectionWrapper>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, transition: 'all 0.3s ease' }}>
            
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                /* 메뉴 호버 애니메이션 */
                .menu-item {
                    padding: 16px;
                    border-radius: 12px;
                    transition: all 0.2s;
                }
                .menu-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
            `}</style>

            <div style={{ maxWidth: '540px', margin: '0 auto', minHeight: '100vh', paddingBottom: '40px' }}>
                
                {/* 상단 글로벌 헤더 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', padding: '20px 15px' }}>
                    <button onClick={() => setIsMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                </div>

                {/* 🚨 햄버거 메뉴 사이드바 오버레이 (모던 미스틱 세공 완료) */}
                {isMenuOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, transition: 'opacity 0.3s' }} onClick={() => setIsMenuOpen(false)}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '280px', height: '100%', background: 'rgba(20, 24, 39, 0.85)', borderLeft: `1px solid ${theme.border}`, padding: '30px 20px', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
                            
                            {/* 상단 헤더 & 닫기 버튼 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h3 style={{ margin: 0, color: theme.text, fontSize: '18px', fontFamily: '"Noto Serif KR", serif', fontWeight: '300', letterSpacing: '2px' }}>FATE MASTER</h3>
                                <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.textMuted }}>✕</button>
                            </div>

                            {/* 🚨 추가된 로그인/프로필 버튼 영역 */}
                            <div style={{ padding: '16px', background: theme.glassInner, borderRadius: '12px', border: `1px solid ${theme.border}`, marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => alert('로그인 기능 업데이트 후 지원될 예정입니다.')}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(214, 188, 250, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
                                    👤
                                </div>
                                <div>
                                    <strong style={{ color: theme.text, fontSize: '15px', display: 'block', fontWeight: '400' }}>로그인 / 회원가입</strong>
                                    <span style={{ color: theme.textMuted, fontSize: '12px', fontWeight: '300' }}>나의 사주 기록 보관하기</span>
                                </div>
                            </div>

                            {/* 감성 아이콘과 둥근 버튼 형태가 적용된 메뉴 리스트 */}
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: '"Noto Sans KR", sans-serif', fontSize: '15px', fontWeight: '300' }}>
                                <li className="menu-item" style={{ cursor: 'pointer', color: theme.text, display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => setIsMenuOpen(false)}>
                                    <span>🏠</span> 홈으로 가기
                                </li>
                                <li className="menu-item" style={{ cursor: 'pointer', color: theme.text, display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => setIsMenuOpen(false)}>
                                    <span>🔮</span> 내 운명 리포트 보기
                                </li>
                                <li className="menu-item" style={{ cursor: 'pointer', color: theme.accent, textShadow: theme.accentGlow, display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => { setIsCalendarModalOpen(true); setIsMenuOpen(false); }}>
                                    <span>🗓️</span> 만세력 일진 달력
                                </li>
                                {/* 🚨 추가된 명리 사전 버튼 */}
                                <li className="menu-item" style={{ cursor: 'pointer', color: theme.text, display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => { alert('사전 기능 업데이트 후 지원될 예정입니다.'); setIsMenuOpen(false); }}>
                                    <span>📖</span> 명리 용어 사전
                                </li>
                                <li className="menu-item" style={{ cursor: 'pointer', color: theme.text, display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => { alert('구독 기능 업데이트 후 지원될 예정입니다.'); setIsMenuOpen(false); }}>
                                    <span>🌙</span> 무료 월간 운세 구독
                                </li>
                                <li style={{ borderTop: `1px solid ${theme.border}`, margin: '10px 0' }}></li>
                                <li className="menu-item" style={{ cursor: 'pointer', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => setIsMenuOpen(false)}>
                                    <span>⚙️</span> 설정
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* 만세력 모달 오버레이 */}
                {isCalendarModalOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px' }} onClick={() => setIsCalendarModalOpen(false)}>
                        <div className="hide-scrollbar" style={{ position: 'relative', width: '100%', maxWidth: '470px', maxHeight: '85vh', overflowY: 'auto', background: 'rgba(20, 24, 39, 0.85)', border: `1px solid ${theme.border}`, borderRadius: '24px', padding: '20px' }} onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setIsCalendarModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.textMuted, zIndex: 10 }}>✕</button>
                            <div style={{ marginTop: '15px' }}>
                                <ManseryeokCalendar isDarkMode={isDarkMode} />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* 🔮 미스틱 배너 */}
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '26px', fontWeight: '300', fontFamily: '"Noto Serif KR", serif', color: theme.text, letterSpacing: '4px' }}>
                        FATE MASTER
                    </h1>
                    <p style={{ margin: 0, fontSize: '11px', color: theme.textMuted, letterSpacing: '3px', textTransform: 'uppercase' }}>Astrology & Bazi Analysis</p>
                </div>
                
                {/* 입력 폼 영역 */}
                <div style={{ padding: '0 20px 30px 20px' }}>
                    <SajuForm onSubmit={handleAnalyze} isLoading={isLoading} />
                </div>
                
                {error && (
                    <div style={{ margin: '0 20px 20px', padding: '15px', textAlign: 'center', color: '#FC8181', background: 'rgba(252, 129, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(252, 129, 129, 0.2)' }}>
                        {error}
                    </div>
                )}

                {/* 캡처/리셋 버튼 (상단) */}
                {(result || gunghapResult) && (
                    <div style={{ display: 'flex', gap: '15px', padding: '0 20px', marginBottom: '30px' }}>
                        <button onClick={handleReset} style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.05)', color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '16px', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }}>
                            다시 입력하기
                        </button>
                        <button onClick={handleSaveImage} style={{ flex: 1, padding: '16px', background: theme.text, color: '#090A0F', border: 'none', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>
                            결과 캡처
                        </button>
                    </div>
                )}

                <div ref={reportRef} style={{ padding: '0 15px' }}>
                    {result && result.status === 'success' && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            
                            <SectionWrapper>
                                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                                    <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontFamily: '"Noto Serif KR", serif', fontWeight: '300', color: theme.text, letterSpacing: '1px' }}>
                                        {result.metadata.name} 님의 운명 지도
                                    </h2>
                                    <div style={{ fontSize: '13px', color: theme.textMuted, letterSpacing: '1px' }}>
                                        {result.metadata.gender} / 진태양시 보정: {result.metadata.corrected_time}
                                    </div>
                                </div>
                                <BaziMatrix matrixData={result.bazi_matrix} pillarStars={result.dynamics_and_secrets?.pillar_stars} isDarkMode={isDarkMode} />
                            </SectionWrapper>
                            
                            <SectionWrapper title="선천 오행 분포">
                                <ElementsChart elementsData={result.elements_distribution} isDarkMode={isDarkMode} />
                            </SectionWrapper>

                            <SectionWrapper title="대운 흐름 (10년)">
                                <DaewunScanner daewunData={result.daewun_analysis} isDarkMode={isDarkMode} />
                            </SectionWrapper>

                            <SectionWrapper title="실전 운세 스캐너">
                                <UnseScanner unseData={result.unse_analysis} isDarkMode={isDarkMode} />
                            </SectionWrapper>

                            <SectionWrapper title="핵심 코어 분석">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    
                                    <div style={{ background: theme.glassInner, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px 20px' }}>
                                        <div style={{ marginBottom: '14px', fontSize: '14px', fontWeight: '300' }}>
                                            <span style={{color: theme.textMuted, marginRight: '10px'}}>사주 세력</span> 
                                            <strong style={{color: theme.text, fontWeight: '400'}}>{result.core_analysis.strength.status}</strong> 
                                            <span style={{fontSize:'13px', color: theme.textMuted}}> (내 세력 {result.core_analysis.strength.my_power}% / 상대 {result.core_analysis.strength.other_power}%)</span>
                                        </div>
                                        <div style={{ fontSize: '14px', fontWeight: '300', lineHeight: '1.7' }}>
                                            <span style={{color: theme.textMuted, marginRight: '10px'}}>사회적 그릇</span> 
                                            <strong style={{color: theme.text, fontWeight: '400'}}>{result.core_analysis.geokguk.name_clean}</strong> 
                                            <span style={{color: theme.textMuted}}> - {result.core_analysis.geokguk.desc}</span>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', background: theme.glassInner, border: `1px solid ${theme.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                                        <div style={{ flex: 1, padding: '24px 10px', borderRight: `1px solid ${theme.border}`, textAlign: 'center' }}>
                                            <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '300' }}>용신(수호신)</span><br/>
                                            <strong style={{ 
                                                fontSize: '15px', color: theme.accent, textShadow: theme.accentGlow, 
                                                marginTop: '10px', display: 'block', fontFamily: '"Noto Serif KR", serif', fontWeight: '300',
                                                wordBreak: 'keep-all', whiteSpace: 'pre-wrap'
                                            }}>{result.core_analysis.yongshin.yongshin}</strong>
                                        </div>
                                        <div style={{ flex: 1, padding: '24px 10px', borderRight: `1px solid ${theme.border}`, textAlign: 'center' }}>
                                            <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '300' }}>희신(도우미)</span><br/>
                                            <strong style={{ 
                                                fontSize: '15px', color: theme.text, 
                                                marginTop: '10px', display: 'block', fontFamily: '"Noto Serif KR", serif', fontWeight: '300',
                                                wordBreak: 'keep-all', whiteSpace: 'pre-wrap'
                                            }}>{result.core_analysis.yongshin.huishin}</strong>
                                        </div>
                                        <div style={{ flex: 1, padding: '24px 10px', textAlign: 'center' }}>
                                            <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '300' }}>기신(방해꾼)</span><br/>
                                            <strong style={{ 
                                                fontSize: '15px', color: theme.text, 
                                                marginTop: '10px', display: 'block', fontFamily: '"Noto Serif KR", serif', fontWeight: '300',
                                                wordBreak: 'keep-all', whiteSpace: 'pre-wrap'
                                            }}>{result.core_analysis.yongshin.gishin}</strong>
                                        </div>
                                    </div>
                                    
                                    {result.core_analysis?.tonggeun_info && (
                                        <div style={{ padding: '24px 20px', background: theme.glassInner, border: `1px solid ${theme.border}`, borderRadius: '16px' }}>
                                            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '400', color: theme.text, letterSpacing: '0.5px' }}>
                                                일간의 뿌리: {result.core_analysis.tonggeun_info.strength || (result.core_analysis.tonggeun_info.has_root ? '튼튼함 (有根)' : '허약함 (無根)')}
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '14px', color: theme.textMuted, lineHeight: '1.7', fontWeight: '300' }}>
                                                {result.core_analysis.tonggeun_info.desc}
                                            </p>
                                        </div>
                                    )}

                                    <div style={{ padding: '24px 20px', background: theme.glassInner, border: `1px solid ${theme.border}`, borderRadius: '16px', lineHeight: '1.7' }}>
                                        <strong style={{ color: theme.accent, textShadow: theme.accentGlow, display: 'block', marginBottom: '10px', fontWeight: '400', fontSize: '14px' }}>
                                            ✧ 통변 요약
                                        </strong>
                                        <span style={{color: theme.text, fontSize: '14px', fontWeight: '300'}}>{result.core_analysis.yongshin.desc}</span>
                                    </div>
                                </div>
                            </SectionWrapper>

                            {result.classical_analysis && (
                                <SectionWrapper title="고전 명리 (기질과 그릇)">
                                    {result.classical_analysis.map((section, idx) => (
                                        <div key={idx} style={{ 
                                            background: theme.glassInner, 
                                            border: `1px solid ${theme.border}`, 
                                            borderRadius: '16px', 
                                            padding: '24px 20px',
                                            marginBottom: idx === result.classical_analysis.length - 1 ? '0' : '20px' 
                                        }}>
                                            <h4 style={{ 
                                                color: theme.accent, 
                                                textShadow: theme.accentGlow, 
                                                marginBottom: '16px', 
                                                fontSize: '15px', 
                                                fontWeight: '400',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {section.section}
                                            </h4>
                                            
                                            {section.items.map((item, i) => (
                                                <div key={i} style={{ 
                                                    marginBottom: i === section.items.length - 1 ? '0' : '20px',
                                                    paddingBottom: i === section.items.length - 1 ? '0' : '20px',
                                                    borderBottom: i === section.items.length - 1 ? 'none' : `1px dashed ${theme.border}`
                                                }}>
                                                    <strong style={{ color: theme.text, fontSize: '15px', display: 'block', marginBottom: '10px', fontWeight: '400' }}>
                                                        {item.title} {item.hanja && `(${item.hanja})`}
                                                    </strong>
                                                    <p style={{ margin: 0, fontSize: '14px', color: theme.textMuted, lineHeight: '1.7', fontWeight: '300' }}>
                                                        {item.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </SectionWrapper>
                            )}

                            <SectionWrapper title="현대 실용 분석">
                                <PracticalScanner practicalData={result.practical_analysis} isDarkMode={isDarkMode} />
                            </SectionWrapper>

                            <SectionWrapper title="전문가 비전 (비밀 분석)">
                                <SecretScanner secretData={result.dynamics_and_secrets.secrets} isDarkMode={isDarkMode} />
                            </SectionWrapper>
                            
                            <IdealPartnerPanel data={result.ideal_partner} />

                            {result.fengshui_analysis && (
                                <SectionWrapper title="풍수 개운법 (나침반)">
                                    <div style={{ marginBottom: '25px', padding: '20px', background: theme.glassInner, border: `1px solid ${theme.border}`, borderRadius: '16px', textAlign: 'center', fontSize: '15px', color: theme.text, fontWeight: '300' }}>
                                        본명궁(本命宮): <strong style={{ color: theme.accent, textShadow: theme.accentGlow, fontWeight: '400' }}>{result.fengshui_analysis.base_gung.name} [{result.fengshui_analysis.base_gung.group}]</strong>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div style={{ background: theme.glassInner, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px 20px' }}>
                                            <h4 style={{ color: theme.text, borderBottom: `1px dashed ${theme.border}`, paddingBottom: '16px', margin: '0 0 20px 0', fontSize: '15px', fontWeight: '400', letterSpacing: '0.5px' }}>
                                                ✨ 나의 4대 길방(吉方)
                                            </h4>
                                            {Object.entries(result.fengshui_analysis.directions.good).map(([key, val], idx, arr) => (
                                                <div key={key} style={{ 
                                                    marginBottom: idx === arr.length - 1 ? '0' : '20px',
                                                    paddingBottom: idx === arr.length - 1 ? '0' : '20px',
                                                    borderBottom: idx === arr.length - 1 ? 'none' : `1px solid rgba(255,255,255,0.05)`
                                                }}>
                                                    <strong style={{ display: 'block', marginBottom: '8px', color: theme.good, textShadow: theme.goodGlow, fontWeight: '400', fontSize: '15px' }}>
                                                        {key} ({val.dir || val.direction || "방위 계산 불가"})
                                                    </strong> 
                                                    <p style={{ margin: 0, color: theme.textMuted, lineHeight: '1.7', fontWeight: '300', fontSize: '14px' }}>
                                                        {val.advice}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ background: theme.glassInner, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px 20px' }}>
                                            <h4 style={{ color: theme.text, borderBottom: `1px dashed ${theme.border}`, paddingBottom: '16px', margin: '0 0 20px 0', fontSize: '15px', fontWeight: '400', letterSpacing: '0.5px' }}>
                                                ⚠️ 절대 피할 흉방(凶方)
                                            </h4>
                                            {Object.entries(result.fengshui_analysis.directions.bad).map(([key, val], idx, arr) => (
                                                <div key={key} style={{ 
                                                    marginBottom: idx === arr.length - 1 ? '0' : '20px',
                                                    paddingBottom: idx === arr.length - 1 ? '0' : '20px',
                                                    borderBottom: idx === arr.length - 1 ? 'none' : `1px solid rgba(255,255,255,0.05)`
                                                }}>
                                                    <strong style={{ display: 'block', marginBottom: '8px', color: theme.danger, textShadow: theme.dangerGlow, fontWeight: '400', fontSize: '15px' }}>
                                                        {key} ({val.dir || val.direction || "방위 계산 불가"})
                                                    </strong> 
                                                    <p style={{ margin: 0, color: theme.textMuted, lineHeight: '1.7', fontWeight: '300', fontSize: '14px' }}>
                                                        {val.advice}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </SectionWrapper>
                            )}

                            <SectionWrapper title="동적 상호작용">
                                <DynamicsScanner dynamicsData={result.dynamics_and_secrets} isDarkMode={isDarkMode} />
                            </SectionWrapper>

                            <SectionWrapper title="당사주 분석" noBorderBottom>
                                <DangsajuScanner dangsajuData={result.dangsaju_analysis} isDarkMode={isDarkMode} />
                            </SectionWrapper>
                        </div>
                    )}

                    <GunghapPanel gunghapData={gunghapResult} isDarkMode={isDarkMode} />
                </div>
                
                {/* 하단 리셋/캡처 버튼 */}
                {(result || gunghapResult) && (
                    <div style={{ display: 'flex', gap: '15px', padding: '0 20px', marginTop: '20px' }}>
                        <button onClick={handleReset} style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.05)', color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '16px', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }}>
                            다시하기
                        </button>
                        <button onClick={handleSaveImage} style={{ flex: 1, padding: '16px', background: theme.text, color: '#090A0F', border: 'none', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>
                            이미지 저장
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}