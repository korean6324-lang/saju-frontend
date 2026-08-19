// src/components/SecretScanner.jsx
import React from 'react';

// 🚨 기존 데이터 매핑 로직 100% 보존. 탁한 배경을 없애고 네온 글로우로 '모던 미스틱' 완성
export default function SecretScanner({ secretData, isDarkMode }) {
    if (!secretData) return null;

    const { guiguzi, secret_patterns, marriage_secrets, critical_ages } = secretData;

    // 🔮 모던 미스틱 (순수 유리 질감) 컬러 팔레트 
    const mysticTheme = {
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        glassBg: 'rgba(255, 255, 255, 0.03)', // 🚨 붉은 배경을 버리고 순수 투명 유리로 통일
        text: '#F4F4F5',
        textMuted: '#A0AEC0',
        accent: '#D6BCFA', // 오로라 퍼플 (귀곡산명술)
        accentGlow: '0 0 10px rgba(214, 188, 250, 0.4)',
        danger: '#FC8181', // 코랄 핑크 (흉살 경고)
        dangerGlow: '0 0 10px rgba(252, 129, 129, 0.4)', // 🚨 텍스트 자체에서 빛나는 붉은 경고
        safe: '#4FD1C5', // 신비로운 민트 (안전)
        safeGlow: '0 0 10px rgba(79, 209, 197, 0.4)',
    };

    return (
        <div style={{ width: '100%', fontFamily: '"Noto Sans KR", sans-serif' }}>
            
            {/* 1. 귀곡산명술 (순수 유리 질감) */}
            <div style={{ background: mysticTheme.glassBg, padding: '24px 20px', borderRadius: '16px', marginBottom: '20px', border: `1px solid ${mysticTheme.glassBorder}` }}>
                <h4 style={{ color: mysticTheme.accent, textShadow: mysticTheme.accentGlow, margin: '0 0 14px 0', fontSize: '15px', fontWeight: '400', letterSpacing: '0.5px' }}>
                    ✧ 귀곡산명술 (전생/운명 비결)
                </h4>
                <div style={{ display: 'inline-block', background: 'rgba(214, 188, 250, 0.05)', color: mysticTheme.accent, padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '400', marginBottom: '14px', border: `1px solid rgba(214, 188, 250, 0.15)` }}>
                    {guiguzi.combination} 격(格)
                </div>
                {/* 🚨 폰트 하한선 14px 적용 */}
                <p style={{ fontSize: '14px', color: mysticTheme.textMuted, lineHeight: '1.7', margin: 0, fontWeight: '300' }}>
                    {guiguzi.description}
                </p>
            </div>

            {/* 2. 대운 천극지충 (투박한 왼쪽 선 삭제 & 붉은 네온 글로우로 위기 강조) */}
            <div style={{ background: mysticTheme.glassBg, padding: '24px 20px', borderRadius: '16px', marginBottom: '20px', border: `1px solid ${mysticTheme.glassBorder}` }}>
                <h4 style={{ color: mysticTheme.danger, textShadow: mysticTheme.dangerGlow, margin: '0 0 12px 0', fontSize: '15px', fontWeight: '400', letterSpacing: '0.5px' }}>
                    ✧ 인생의 대격변기 (천극지충)
                </h4>
                {/* 🚨 폰트 하한선 14px 적용 */}
                <p style={{ fontSize: '14px', color: mysticTheme.textMuted, lineHeight: '1.7', margin: 0, fontWeight: '300' }}>
                    {critical_ages.message}
                </p>
            </div>

            {/* 3. 부부궁 이별수 / 고부갈등 (탁한 팥죽색 배경을 순수 유리로 교체) */}
            {marriage_secrets.length > 0 && (
                <div style={{ background: mysticTheme.glassBg, padding: '24px 20px', borderRadius: '16px', marginBottom: '20px', border: `1px solid ${mysticTheme.glassBorder}` }}>
                    <h4 style={{ color: mysticTheme.danger, textShadow: mysticTheme.dangerGlow, margin: '0 0 16px 0', fontSize: '15px', fontWeight: '400', letterSpacing: '0.5px' }}>
                        ✧ 혼택 경계: 부부궁 흉살
                    </h4>
                    {marriage_secrets.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: idx !== marriage_secrets.length - 1 ? '20px' : '0' }}>
                            {/* 🚨 흉살 이름에 네온 글로우 적용하여 경고 효과 극대화 */}
                            <strong style={{ color: mysticTheme.danger, textShadow: mysticTheme.dangerGlow, display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '400' }}>
                                [{item.name}]
                            </strong>
                            <p style={{ fontSize: '14px', color: mysticTheme.textMuted, lineHeight: '1.7', margin: 0, fontWeight: '300' }}>
                                {item.warning}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* 4. 특수 흉살 주의 (탁한 팥죽색 배경을 순수 유리로 교체) */}
            {secret_patterns.length > 0 && (
                <div style={{ background: mysticTheme.glassBg, padding: '24px 20px', borderRadius: '16px', marginBottom: '20px', border: `1px solid ${mysticTheme.glassBorder}` }}>
                    <h4 style={{ color: mysticTheme.danger, textShadow: mysticTheme.dangerGlow, margin: '0 0 16px 0', fontSize: '15px', fontWeight: '400', letterSpacing: '0.5px' }}>
                        ✧ 주의: 특수 업보 흉살
                    </h4>
                    {secret_patterns.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: idx !== secret_patterns.length - 1 ? '20px' : '0' }}>
                            {/* 🚨 흉살 이름에 네온 글로우 적용 */}
                            <strong style={{ color: mysticTheme.danger, textShadow: mysticTheme.dangerGlow, display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '400' }}>
                                [{item.name}]
                            </strong>
                            <p style={{ fontSize: '14px', color: mysticTheme.textMuted, lineHeight: '1.7', margin: 0, fontWeight: '300' }}>
                                {item.warning}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            
            {/* 5. 흉살이 없을 경우의 세이프 박스 (순수 유리로 교체) */}
            {secret_patterns.length === 0 && marriage_secrets.length === 0 && (
                <div style={{ background: mysticTheme.glassBg, padding: '24px 20px', borderRadius: '16px', fontSize: '14px', color: mysticTheme.safe, textShadow: mysticTheme.safeGlow, textAlign: 'center', border: `1px solid ${mysticTheme.glassBorder}`, lineHeight: '1.7', fontWeight: '300' }}>
                    사주 원국 내에 치명적인 부부 이별수나 법적 구설수를 야기하는 극단적인 흉살은 잠복해 있지 않습니다. 
                    평탄하고 안정적인 인생의 뼈대를 갖추고 있습니다.
                </div>
            )}
        </div>
    );
}