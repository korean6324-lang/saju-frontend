// src/components/DynamicsScanner.jsx
import React from 'react';

// 🚨 기존 데이터 맵핑 로직 100% 보존. 아이콘과 유리 질감 캡슐화로 모던 미스틱 세공
export default function DynamicsScanner({ dynamicsData, isDarkMode }) {
    if (!dynamicsData) return null;
    
    const { special_stars, disasters } = dynamicsData;

    // 🔮 모던 미스틱 컬러 팔레트 연동
    const mysticTheme = {
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        glassInner: 'rgba(255, 255, 255, 0.03)', // 반투명 유리 상자 배경
        text: '#F4F4F5',
        textMuted: '#A0AEC0',
        good: '#D6BCFA', // 길성용 오로라 퍼플
        goodGlow: '0 0 10px rgba(214, 188, 250, 0.4)',
        bad: '#FC8181', // 흉살용 코랄 핑크
        badGlow: '0 0 10px rgba(252, 129, 129, 0.4)',
    };

    // 모던 미스틱 스타일이 적용된 리스트 렌더러
    const renderList = (title, items, isAlert = false) => {
        const titleColor = isAlert ? mysticTheme.bad : mysticTheme.text;
        const titleIcon = isAlert ? '⚡' : '🌟';
        const itemTitleColor = isAlert ? mysticTheme.bad : mysticTheme.good;
        const itemGlow = isAlert ? mysticTheme.badGlow : mysticTheme.goodGlow;

        return (
            <div style={{ marginBottom: '35px' }}>
                <h4 style={{ 
                    color: titleColor, 
                    borderBottom: `1px solid ${mysticTheme.glassBorder}`, 
                    paddingBottom: '12px', 
                    margin: '0 0 20px 0',
                    fontSize: '15px',
                    fontWeight: '400',
                    letterSpacing: '0.5px'
                }}>
                    {titleIcon} {title}
                </h4>
                
                {items.length === 0 ? (
                    <p style={{ color: mysticTheme.textMuted, fontSize: '14px', margin: 0, fontWeight: '300' }}>해당하는 기운이 없습니다.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {items.map((item, idx) => (
                            // 🚨 각 항목을 반투명 유리 상자로 캡슐화하여 텍스트 뭉개짐 방지
                            <div key={idx} style={{ 
                                background: mysticTheme.glassInner,
                                border: `1px solid ${mysticTheme.glassBorder}`,
                                borderRadius: '16px',
                                padding: '24px 20px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                                    {/* 🚨 네온 글로우 적용된 핵심 기운 명칭 */}
                                    <strong style={{ 
                                        color: itemTitleColor, 
                                        textShadow: itemGlow, 
                                        fontSize: '15px', 
                                        fontWeight: '400',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {item.name_clean} <span style={{ fontSize: '13px', fontWeight: '300', color: mysticTheme.textMuted, textShadow: 'none' }}>({item.hanja_clean})</span>
                                    </strong>
                                    {/* 깔끔하게 정돈된 발현 위치 */}
                                    <span style={{ 
                                        background: 'rgba(255,255,255,0.05)',
                                        border: `1px solid ${mysticTheme.glassBorder}`,
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        color: mysticTheme.textMuted, 
                                        fontSize: '12px',
                                        fontWeight: '300'
                                    }}>
                                        발현 위치: {item.position}
                                    </span>
                                </div>
                                {/* 🚨 폰트 하한선 14px 적용 및 가독성 최적화 */}
                                <p style={{ fontSize: '14px', color: mysticTheme.text, lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: 0, fontWeight: '300' }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ width: '100%', fontFamily: '"Noto Sans KR", sans-serif' }}>
            {/* 대표님 지시에 맞춰 명확한 아이콘과 네온 글로우가 적용된 리스트 호출 */}
            {renderList("타고난 특별한 능력 (길성/신살)", special_stars, false)}
            {renderList("주의해야 할 기운 (충/형/해/파)", disasters, true)}
        </div>
    );
}