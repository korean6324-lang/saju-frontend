// src/components/GunghapPanel.jsx
import React from 'react';

// 🚨 데이터 매핑 로직 100% 보존. 
// 길/흉합에 따라 교차 아이콘(💞 vs ⚡)이 동적으로 바뀌도록 치명적 오류 긴급 패치 완료
export default function GunghapPanel({ gunghapData, isDarkMode }) {
    if (!gunghapData || gunghapData.status !== 'success') return null;

    const { hontaek_summary, taekil_validation } = gunghapData;
    const { dongseo_gunghap, special_gunghap } = hontaek_summary;

    const isTaekilActive = taekil_validation && taekil_validation !== "택일 희망일이 입력되지 않았습니다.";

    // 🔮 로맨틱 미스틱 테마 변수 설정
    const mysticTheme = {
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        glassBg: 'rgba(255, 255, 255, 0.03)',
        glassHighlight: 'rgba(255, 255, 255, 0.05)',
        text: '#F4F4F5',
        textMuted: '#A0AEC0',
        romanceP1: '#F687B3', // 로즈 핑크 (파트너 1)
        romanceP1Glow: '0 0 12px rgba(246, 135, 179, 0.5)',
        romanceP2: '#B794F4', // 오로라 퍼플 (파트너 2)
        romanceP2Glow: '0 0 12px rgba(183, 148, 244, 0.5)',
        accent: '#D6BCFA', // 기본 오로라 퍼플
        accentGlow: '0 0 10px rgba(214, 188, 250, 0.4)',
        good: '#4FD1C5', // 길일/길합 (신비로운 민트)
        goodGlow: '0 0 10px rgba(79, 209, 197, 0.4)',
        bad: '#FC8181', // 흉일/흉합 (코랄 핑크)
        badGlow: '0 0 10px rgba(252, 129, 129, 0.4)',
    };

    const getMysticMessageStyle = (msg) => {
        if (msg.includes('무결점 길일') || msg.includes('대길일') || msg.includes('훌륭한 날')) {
            return { color: mysticTheme.good, shadow: mysticTheme.goodGlow, border: mysticTheme.good, icon: '✨' }; 
        }
        if (msg.includes('💡')) {
            return { color: mysticTheme.accent, shadow: mysticTheme.accentGlow, border: mysticTheme.accent, icon: '🔮' }; 
        }
        return { color: mysticTheme.bad, shadow: mysticTheme.badGlow, border: mysticTheme.bad, icon: '⚠️' }; 
    };

    // 🚨 궁합 결과에 따른 메인 컬러 및 "동적 아이콘" 결정
    const isGoodMatch = dongseo_gunghap.desc.includes('길합') || dongseo_gunghap.desc.includes('생기') || dongseo_gunghap.desc.includes('연년') || dongseo_gunghap.desc.includes('천을') || dongseo_gunghap.desc.includes('복위');
    
    const matchColor = isGoodMatch ? mysticTheme.good : mysticTheme.bad;
    const matchGlow = isGoodMatch ? mysticTheme.goodGlow : mysticTheme.badGlow;
    // 🚨 흉합일 경우 하트 대신 번개(충돌) 기호를 출력합니다.
    const matchIcon = isGoodMatch ? '💞' : '⚡'; 

    return (
        <div style={{ marginTop: '35px', padding: '35px 25px', background: 'rgba(20, 24, 39, 0.45)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${mysticTheme.glassBorder}`, borderRadius: '24px', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)' }}>
            
            {/* 메인 타이틀 */}
            <h2 style={{ color: mysticTheme.romanceP1, textShadow: mysticTheme.romanceP1Glow, textAlign: 'center', borderBottom: `1px solid ${mysticTheme.glassBorder}`, paddingBottom: '20px', margin: '0 0 30px 0', fontSize: '20px', fontFamily: '"Noto Serif KR", serif', fontWeight: '300', letterSpacing: '1px' }}>
                💞 유니버설 파트너 궁합 종합 리포트
            </h2>
            
            {/* 1. 합(合)의 시너지 (동서명합) */}
            <div style={{ background: mysticTheme.glassBg, border: `1px solid ${mysticTheme.glassBorder}`, borderRadius: '16px', padding: '24px 20px', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: matchColor, textShadow: matchGlow, fontSize: '16px', fontWeight: '400', letterSpacing: '0.5px' }}>
                    1. 동서명합 시너지: {dongseo_gunghap.star} ({dongseo_gunghap.type})
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '15px', color: mysticTheme.text, lineHeight: '1.7', fontWeight: '400' }}>
                    {dongseo_gunghap.desc}
                </p>
                
                {/* 🔮 도출 원리 (Why?) - 로맨틱 보석 캡슐 렌더링 */}
                <div style={{ marginTop: '20px', padding: '20px', background: mysticTheme.glassInner, borderRadius: '16px', border: `1px solid ${mysticTheme.glassBorder}` }}>
                    <h4 style={{ margin: '0 0 16px 0', color: mysticTheme.accent, textShadow: mysticTheme.accentGlow, fontSize: '14px', borderBottom: `1px dashed ${mysticTheme.glassBorder}`, paddingBottom: '12px', fontWeight: '400' }}>
                        🔮 운명의 교차 원리
                    </h4>
                    
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                        {/* 파트너 1 (로즈 핑크 보석) */}
                        <div style={{ flex: 1, minWidth: '140px', padding: '16px', background: 'rgba(246, 135, 179, 0.05)', border: '1px solid rgba(246, 135, 179, 0.2)', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(246, 135, 179, 0.1)' }}>
                            <strong style={{ color: mysticTheme.textMuted, fontSize: '12px', fontWeight: '300' }}>{dongseo_gunghap.p1_name || '파트너 1'} 님</strong><br/>
                            <span style={{ fontSize: '16px', color: mysticTheme.romanceP1, textShadow: mysticTheme.romanceP1Glow, fontWeight: '400', display: 'inline-block', margin: '6px 0' }}>{dongseo_gunghap.p1_info.name}</span><br/>
                            <span style={{ fontSize: '12px', color: mysticTheme.textMuted, fontWeight: '300' }}>[{dongseo_gunghap.p1_info.group} / {dongseo_gunghap.p1_info.element}]</span>
                        </div>
                        
                        {/* 🚨 시각적 교차 아이콘 (결과에 따라 동적으로 반응: 하트 vs 번개) */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: matchColor, textShadow: matchGlow, fontSize: '26px' }}>
                            {matchIcon}
                        </div>

                        {/* 파트너 2 (오로라 퍼플 보석) */}
                        <div style={{ flex: 1, minWidth: '140px', padding: '16px', background: 'rgba(183, 148, 244, 0.05)', border: '1px solid rgba(183, 148, 244, 0.2)', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(183, 148, 244, 0.1)' }}>
                            <strong style={{ color: mysticTheme.textMuted, fontSize: '12px', fontWeight: '300' }}>{dongseo_gunghap.p2_name || '파트너 2'} 님</strong><br/>
                            <span style={{ fontSize: '16px', color: mysticTheme.romanceP2, textShadow: mysticTheme.romanceP2Glow, fontWeight: '400', display: 'inline-block', margin: '6px 0' }}>{dongseo_gunghap.p2_info.name}</span><br/>
                            <span style={{ fontSize: '12px', color: mysticTheme.textMuted, fontWeight: '300' }}>[{dongseo_gunghap.p2_info.group} / {dongseo_gunghap.p2_info.element}]</span>
                        </div>
                    </div>
                    
                    {/* 오행 생극제화 해설 텍스트 */}
                    <div style={{ padding: '16px', background: mysticTheme.glassHighlight, borderRadius: '12px', border: `1px solid ${mysticTheme.glassBorder}` }}>
                        <p style={{ margin: 0, fontSize: '14px', color: mysticTheme.text, lineHeight: '1.7', fontWeight: '300' }}>
                            {dongseo_gunghap.reasoning}
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. 특수 격국 분석 */}
            <h3 style={{ color: mysticTheme.accent, textShadow: mysticTheme.accentGlow, marginBottom: '16px', fontSize: '16px', fontWeight: '400', letterSpacing: '0.5px' }}>
                ✨ 2. 특수 인연의 끈 (특수 격국)
            </h3>
            {special_gunghap && special_gunghap.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                    {special_gunghap.map((item, idx) => (
                        <div key={idx} style={{ padding: '20px', background: mysticTheme.glassBg, border: `1px solid ${mysticTheme.glassBorder}`, borderRadius: '16px' }}>
                            <strong style={{ color: mysticTheme.romanceP1, textShadow: mysticTheme.romanceP1Glow, fontSize: '15px', display: 'block', marginBottom: '8px', fontWeight: '400' }}>
                                {item.name}
                            </strong>
                            <span style={{ fontSize: '14px', color: mysticTheme.textMuted, lineHeight: '1.7', fontWeight: '300' }}>
                                {item.desc}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ color: mysticTheme.textMuted, fontSize: '14px', padding: '20px', background: mysticTheme.glassBg, borderRadius: '16px', border: `1px dashed ${mysticTheme.glassBorder}`, marginBottom: '30px', fontWeight: '300', textAlign: 'center', lineHeight: '1.7' }}>
                    발견된 특수 격국(천지합덕, 교귀, 교록 등)의 강한 인연줄은 없습니다.<br/>평범하지만 서로의 노력으로 안정적인 관계를 만들어가세요.
                </div>
            )}

            {/* 3. 혼인 길월 (가취길월) 섹션 */}
            {isTaekilActive && taekil_validation.gachwi_gilwol_eval && taekil_validation.gachwi_gilwol_eval.status === 'success' && (
                <div style={{ marginTop: '30px', borderTop: `1px dashed ${mysticTheme.glassBorder}`, paddingTop: '25px' }}>
                    <h3 style={{ color: mysticTheme.accent, textShadow: mysticTheme.accentGlow, marginBottom: '16px', fontSize: '16px', fontWeight: '400', letterSpacing: '0.5px' }}>
                        🗓️ 3. 파트너 혼인 길월 (용월법)
                    </h3>
                    <div style={{ padding: '24px 20px', background: mysticTheme.glassBg, borderRadius: '16px', border: `1px solid ${mysticTheme.glassBorder}` }}>
                        <p style={{ fontSize: '14px', color: mysticTheme.text, marginBottom: '16px', fontWeight: '400', lineHeight: '1.7' }}>
                            {taekil_validation.gachwi_gilwol_eval.warning}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', fontWeight: '300' }}>
                            <div><strong style={{ color: mysticTheme.good, textShadow: mysticTheme.goodGlow, fontWeight: '400' }}>✨ 최상의 달 (대리월):</strong> 음력 {taekil_validation.gachwi_gilwol_eval.best_months.join(', ')}월</div>
                            <div><strong style={{ color: mysticTheme.accent, textShadow: mysticTheme.accentGlow, fontWeight: '400' }}>🔮 무난한 달 (소리월):</strong> 음력 {taekil_validation.gachwi_gilwol_eval.good_months.join(', ')}월</div>
                            
                            <div style={{ marginTop: '12px', padding: '16px', background: 'rgba(252, 129, 129, 0.05)', borderRadius: '12px', color: mysticTheme.bad, border: `1px solid rgba(252, 129, 129, 0.15)`, lineHeight: '1.7' }}>
                                <strong style={{ textShadow: mysticTheme.badGlow, fontWeight: '400' }}>⚠️ 배제해야 할 흉월(凶月):</strong><br/>
                                {dongseo_gunghap.p2_name || '파트너 2'} 흉(음 {taekil_validation.gachwi_gilwol_eval.forbidden.파트너2흉.join(',')}월) / {dongseo_gunghap.p1_name || '파트너 1'} 흉(음 {taekil_validation.gachwi_gilwol_eval.forbidden.파트너1흉.join(',')}월)
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. 택일 검증 경고 및 축복 패널 다중 렌더링 */}
            {isTaekilActive && taekil_validation.comprehensive_filter && (
                <div style={{ marginTop: '30px', borderTop: `1px dashed ${mysticTheme.glassBorder}`, paddingTop: '25px' }}>
                    <h3 style={{ color: mysticTheme.romanceP1, textShadow: mysticTheme.romanceP1Glow, marginBottom: '16px', fontSize: '16px', fontWeight: '400', letterSpacing: '0.5px' }}>
                        📅 4. 파트너 택일(擇日) 정밀 검증
                    </h3>
                    
                    <div style={{ marginBottom: '20px', fontSize: '14px', color: mysticTheme.text, background: mysticTheme.glassInner, padding: '16px', borderRadius: '12px', border: `1px solid ${mysticTheme.glassBorder}`, fontWeight: '300' }}>
                        선택하신 혼례 희망일: <strong style={{ color: mysticTheme.accent, textShadow: mysticTheme.accentGlow, fontWeight: '400' }}>{taekil_validation.target_date}</strong>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {taekil_validation.comprehensive_filter.messages.map((msg, idx) => {
                            const style = getMysticMessageStyle(msg);
                            const displayMsg = msg.replace('💡 ', ''); 
                            return (
                                <div key={idx} style={{ 
                                    padding: '16px', 
                                    background: mysticTheme.glassBg, 
                                    color: style.color, 
                                    borderRadius: '12px', 
                                    border: `1px solid ${mysticTheme.glassBorder}`,
                                    borderLeft: `3px solid ${style.border}`, 
                                    fontSize: '14px', 
                                    lineHeight: '1.7',
                                    fontWeight: '300',
                                    textShadow: style.shadow
                                }}>
                                    <strong style={{ marginRight: '8px' }}>{style.icon}</strong> {displayMsg}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}