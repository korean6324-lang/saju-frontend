// src/components/PracticalScanner.jsx
import React from 'react';

// 🚨 데이터 매핑 로직 100% 보존
export default function PracticalScanner({ practicalData, isDarkMode }) {
    if (!practicalData) return null;

    const { health, career } = practicalData;

    // 🔮 모던 미스틱 테마 변수 (유리 질감 및 네온 글로우)
    const mysticTheme = {
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        glassInner: 'rgba(255, 255, 255, 0.03)', // 투명 팁 박스 배경
        text: '#F4F4F5',
        textMuted: '#A0AEC0', // 시인성이 확보된 라벤더 그레이
        accent: '#D6BCFA',
        accentGlow: '0 0 10px rgba(214, 188, 250, 0.4)',
        good: '#4FD1C5', // 양호 (민트)
        goodGlow: '0 0 10px rgba(79, 209, 197, 0.4)',
        bad: '#FC8181', // 취약 (코랄 핑크)
        badGlow: '0 0 10px rgba(252, 129, 129, 0.4)',
    };

    return (
        <div style={{ width: '100%', fontFamily: '"Noto Sans KR", sans-serif' }}>
            
            {/* 1. 건강 및 식이요법 분석 */}
            <div style={{ marginBottom: '35px' }}>
                <h4 style={{ 
                    color: mysticTheme.text, 
                    borderBottom: `1px solid ${mysticTheme.glassBorder}`, 
                    paddingBottom: '12px', 
                    margin: '0 0 20px 0', 
                    fontSize: '15px', 
                    fontWeight: '400',
                    letterSpacing: '0.5px'
                }}>
                    ✧ 선천적 건강 및 밸런스 처방
                </h4>
                
                {health.map((hItem, idx) => {
                    const isGood = hItem.status_code === '양호';
                    const statusColor = isGood ? mysticTheme.good : mysticTheme.bad;
                    const statusShadow = isGood ? mysticTheme.goodGlow : mysticTheme.badGlow;

                    return (
                        <div key={idx} style={{ 
                            marginBottom: idx === health.length - 1 ? '0' : '25px',
                            paddingBottom: idx === health.length - 1 ? '0' : '25px',
                            borderBottom: idx === health.length - 1 ? 'none' : `1px dashed ${mysticTheme.glassBorder}`
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                {/* 🚨 상태 텍스트에 네온 글로우 부여 */}
                                <span style={{ 
                                    color: statusColor, 
                                    textShadow: statusShadow,
                                    fontSize: '14px', 
                                    fontWeight: '400' 
                                }}>
                                    [{hItem.element} {hItem.status_code}]
                                </span>
                                <strong style={{ color: mysticTheme.text, fontSize: '15px', fontWeight: '400' }}>
                                    취약 장기: {hItem.organ}
                                </strong>
                            </div>
                            
                            {/* 🚨 폰트 하한선 14px 방어 및 색상(A0AEC0) 조정을 통한 가독성 극대화 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: mysticTheme.textMuted, lineHeight: '1.7', fontWeight: '300' }}>
                                <div><strong style={{ color: mysticTheme.text, marginRight: '8px', fontWeight: '400' }}>발현 증상:</strong> {hItem.symptom}</div>
                                <div><strong style={{ color: mysticTheme.text, marginRight: '8px', fontWeight: '400' }}>식이 요법:</strong> {hItem.diet_advice}</div>
                                <div><strong style={{ color: mysticTheme.text, marginRight: '8px', fontWeight: '400' }}>부부 밸런스:</strong> {hItem.marriage_focus}</div>
                            </div>
                            
                            {/* 🚨 대표님 픽 💡 아이콘 보존 & 시꺼먼 박스를 유리 상자로 교체 */}
                            <div style={{ 
                                marginTop: '16px', 
                                padding: '16px', 
                                background: mysticTheme.glassInner, // 유리 배경
                                border: `1px solid ${mysticTheme.glassBorder}`, 
                                borderRadius: '12px',
                                fontSize: '14px', 
                                color: mysticTheme.text, 
                                lineHeight: '1.7',
                                fontWeight: '300'
                            }}>
                                <strong>💡 조언:</strong> {hItem.advice}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 2. 직업 및 재테크 분석 */}
            <div>
                <h4 style={{ 
                    color: mysticTheme.text, 
                    borderBottom: `1px solid ${mysticTheme.glassBorder}`, 
                    paddingBottom: '12px', 
                    margin: '0 0 20px 0', 
                    fontSize: '15px', 
                    fontWeight: '400',
                    letterSpacing: '0.5px'
                }}>
                    ✧ 직업 / 재테크 / 가계 역할
                </h4>
                
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        {/* 🚨 네온 글로우 부여 */}
                        <span style={{ 
                            color: mysticTheme.accent, 
                            textShadow: mysticTheme.accentGlow,
                            fontSize: '15px', 
                            fontWeight: '400', 
                            borderBottom: `1px solid ${mysticTheme.accent}`,
                            paddingBottom: '4px'
                        }}>
                            {career.core_trait}
                        </span>
                    </div>
                    
                    {/* 🚨 폰트 하한선 14px 방어 및 시인성 향상 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: mysticTheme.textMuted, lineHeight: '1.7', fontWeight: '300' }}>
                        <div style={{ display: 'flex' }}>
                            <strong style={{ color: mysticTheme.text, minWidth: '95px', fontWeight: '400' }}>추천 직업:</strong> 
                            <span style={{ flex: 1 }}>{career.recommended_jobs}</span>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <strong style={{ color: mysticTheme.text, minWidth: '95px', fontWeight: '400' }}>재테크 성향:</strong> 
                            <span style={{ flex: 1 }}>{career.wealth_management}</span>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <strong style={{ color: mysticTheme.text, minWidth: '95px', fontWeight: '400' }}>가정 내 역할:</strong> 
                            <span style={{ flex: 1 }}>{career.marriage_role}</span>
                        </div>
                    </div>
                    
                    {/* 🚨 대표님 픽 💡 아이콘 보존 & 시꺼먼 박스를 유리 상자로 교체 */}
                    <div style={{ 
                        marginTop: '20px', 
                        padding: '16px', 
                        background: mysticTheme.glassInner, 
                        border: `1px solid ${mysticTheme.glassBorder}`, 
                        borderRadius: '12px',
                        fontSize: '14px', 
                        color: mysticTheme.text, 
                        lineHeight: '1.7',
                        fontWeight: '300'
                    }}>
                        <strong style={{ color: mysticTheme.accent, textShadow: mysticTheme.accentGlow, fontWeight: '400' }}>💡 근무 환경 팁:</strong> {career.work_environment}
                    </div>
                </div>
            </div>
        </div>
    );
}