// src/components/UnseScanner.jsx
import React from 'react';

// 🔮 모던 미스틱 전용: 빛나는 네온 글로우 컬러
const getMysticGlowStyle = (char) => {
    if (['甲', '乙', '寅', '卯'].includes(char)) return { color: '#4FD1C5', textShadow: '0 0 10px rgba(79, 209, 197, 0.4)' };
    if (['丙', '丁', '巳', '午'].includes(char)) return { color: '#FC8181', textShadow: '0 0 10px rgba(252, 129, 129, 0.4)' };
    if (['戊', '己', '辰', '戌', '丑', '未'].includes(char)) return { color: '#F6E05E', textShadow: '0 0 10px rgba(246, 224, 94, 0.4)' };
    if (['庚', '辛', '申', '酉'].includes(char)) return { color: '#E2E8F0', textShadow: '0 0 10px rgba(226, 232, 240, 0.4)' };
    if (['壬', '癸', '亥', '子'].includes(char)) return { color: '#90CDF4', textShadow: '0 0 10px rgba(144, 205, 244, 0.4)' };
    return { color: '#A0AEC0', textShadow: 'none' };
};

// 🚨 데이터 매핑 로직 100% 보존
export default function UnseScanner({ unseData, isDarkMode }) {
    if (!unseData) return null;

    const { current_sewun, sewun_flow, sewun, wolgeon, iljin } = unseData;

    // 🔮 모던 미스틱 (유리 질감) 테마 변수 설정
    const mysticTheme = {
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        glassBg: 'rgba(255, 255, 255, 0.03)',
        glassHighlight: 'rgba(255, 255, 255, 0.05)',
        text: '#F4F4F5',
        textMuted: '#A0AEC0',
        accent: '#D6BCFA',
        good: '#4FD1C5', // 길운 네온 (민트)
        bad: '#FC8181',  // 흉운 네온 (코랄)
    };

    // 10년치 흐름 데이터 방어 로직 (기존 로직 100% 보존)
    let normalizedFlow = [];
    if (Array.isArray(sewun_flow)) {
        normalizedFlow = sewun_flow.map((item, idx) => {
            if (typeof item === 'string') {
                const baseYear = current_sewun && current_sewun.year ? parseInt(current_sewun.year) : new Date().getFullYear();
                return { ganji: item, year: baseYear + idx };
            }
            return item;
        });
    } else if (sewun_flow && sewun_flow.pillars) {
        const years = sewun_flow.years || [];
        normalizedFlow = sewun_flow.pillars.map((ganji, idx) => {
            const baseYear = current_sewun && current_sewun.year ? parseInt(current_sewun.year) : new Date().getFullYear();
            return { ganji: ganji, year: years[idx] !== undefined ? years[idx] : baseYear + idx };
        });
    }

    // 🔮 모던 미스틱 유리 질감 운세 카드 (이모지 제거, 폰트 가독성 방어)
    const renderFortuneCard = (data, titlePrefix) => {
        if (!data) return null;
        
        // 길흉 상태에 따른 네온 텍스트/그림자 효과
        let statusColor = mysticTheme.textMuted;
        let statusShadow = 'none';
        
        if (data.score > 0) {
            statusColor = mysticTheme.good;
            statusShadow = '0 0 10px rgba(79, 209, 197, 0.4)';
        }
        if (data.score < 0) {
            statusColor = mysticTheme.bad;
            statusShadow = '0 0 10px rgba(252, 129, 129, 0.4)';
        }

        return (
            <div style={{
                background: mysticTheme.glassBg, 
                border: `1px solid ${mysticTheme.glassBorder}`, 
                borderRadius: '16px', // 둥근 유리 모서리
                padding: '24px 20px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${mysticTheme.glassBorder}`, paddingBottom: '12px' }}>
                    <h4 style={{ margin: 0, color: mysticTheme.text, fontSize: '15px', fontWeight: '400', letterSpacing: '0.5px' }}>
                        ✧ {titlePrefix} {data.title}
                    </h4>
                    <span style={{ 
                        color: statusColor, 
                        textShadow: statusShadow, // 네온 글로우
                        fontSize: '13px', 
                        fontWeight: '400',
                        letterSpacing: '0.5px'
                    }}>
                        {data.overall_status}
                    </span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: mysticTheme.text, lineHeight: '1.7', fontWeight: '300' }}>
                    {data.overall_desc}
                </p>
            </div>
        );
    };

    return (
        <div style={{ width: '100%', fontFamily: '"Noto Sans KR", sans-serif' }}>
            <p style={{ fontSize: '13px', color: mysticTheme.textMuted, marginBottom: '25px', letterSpacing: '-0.3px', textAlign: 'center', fontWeight: '300' }}>
                거시적인 1년의 흐름부터 당장 오늘의 일진까지 정밀 분석
            </p>

            {/* 1. 디테일 운세 카드 (유리 질감) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
                {renderFortuneCard(sewun, '연운')}
                {renderFortuneCard(wolgeon, '월운')}
                {renderFortuneCard(iljin, '일진')}
            </div>

            {/* 2. 가로 스크롤 10년 흐름 */}
            {normalizedFlow.length > 0 && (
                <div style={{ marginTop: '35px' }}>
                    <h4 style={{ color: mysticTheme.accent, fontSize: '14px', marginBottom: '16px', fontWeight: '400', letterSpacing: '0.5px', textAlign: 'center' }}>
                        ✧ 향후 10년 세운(歲運) 흐름
                    </h4>
                    <div className="hide-scrollbar" style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', padding: '0 10px' }}>
                            {normalizedFlow.map((pillar, idx) => {
                                const ganjiStr = pillar.ganji || "";
                                const safeStem = pillar.stem || (ganjiStr ? ganjiStr.charAt(0) : "");
                                const safeBranch = pillar.branch || (ganjiStr && ganjiStr.length > 1 ? ganjiStr.charAt(1) : "");
                                const safeStemTg = pillar.stem_tg || (pillar.ten_god && pillar.ten_god.length > 0 ? pillar.ten_god[0] : "");
                                const safeBranchTg = pillar.branch_tg || (pillar.ten_god && pillar.ten_god.length > 1 ? pillar.ten_god[1] : "");

                                const isCurrent = current_sewun && parseInt(current_sewun.year) === parseInt(pillar.year);
                                const stemStyle = getMysticGlowStyle(safeStem);
                                const branchStyle = getMysticGlowStyle(safeBranch);

                                return (
                                    <div key={idx} style={{
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center', 
                                        background: isCurrent ? mysticTheme.glassHighlight : 'transparent',
                                        border: isCurrent ? `1px solid ${mysticTheme.glassBorder}` : '1px solid transparent',
                                        borderRadius: '16px',
                                        padding: '16px 12px', 
                                        minWidth: '55px',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <div style={{ 
                                            fontSize: '12px', 
                                            fontWeight: '300', 
                                            color: isCurrent ? mysticTheme.accent : mysticTheme.textMuted,
                                            marginBottom: '12px',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {pillar.year}년
                                        </div>
                                        <div style={{ fontSize: '11px', color: mysticTheme.textMuted, marginBottom: '6px', minHeight: '13px', fontWeight: '300' }}>
                                            {safeStemTg}
                                        </div>
                                        
                                        {/* 천간 네온 글로우 */}
                                        <div style={{
                                            fontSize: '24px', fontWeight: '300', fontFamily: '"Noto Serif KR", serif',
                                            color: stemStyle.color, textShadow: stemStyle.textShadow, marginBottom: '6px'
                                        }}>
                                            {safeStem}
                                        </div>
                                        
                                        {/* 지지 네온 글로우 */}
                                        <div style={{
                                            fontSize: '24px', fontWeight: '300', fontFamily: '"Noto Serif KR", serif',
                                            color: branchStyle.color, textShadow: branchStyle.textShadow
                                        }}>
                                            {safeBranch}
                                        </div>
                                        
                                        <div style={{ fontSize: '11px', color: mysticTheme.textMuted, marginTop: '6px', minHeight: '13px', fontWeight: '300' }}>
                                            {safeBranchTg}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* 3. 현재 12운성 테마 (유리 질감 박스) */}
            {current_sewun && current_sewun.wunseong && (
                <div style={{ 
                    marginTop: '25px', 
                    padding: '20px', 
                    border: `1px solid ${mysticTheme.glassBorder}`, 
                    background: mysticTheme.glassBg,
                    borderRadius: '16px',
                    fontSize: '14px', // 🚨 폰트 하한선 14px 강제 방어
                    lineHeight: '1.7',
                    fontWeight: '300'
                }}>
                    <strong style={{color: mysticTheme.text, display: 'block', marginBottom: '10px', fontWeight: '400'}}>
                        ✧ {current_sewun.year}년({current_sewun.ganji}) 운세 테마
                    </strong>
                    <div>
                        <span style={{
                            border: `1px solid ${mysticTheme.glassBorder}`, 
                            background: 'rgba(0,0,0,0.2)',
                            padding: '4px 10px', 
                            borderRadius: '12px',
                            color: mysticTheme.text, 
                            fontSize: '12px', 
                            fontWeight: '400', 
                            marginRight: '10px'
                        }}>
                            {current_sewun.wunseong.name}
                        </span>
                        <span style={{ color: mysticTheme.textMuted }}>{current_sewun.wunseong.desc}</span>
                    </div>
                </div>
            )}
        </div>
    );
}