// src/components/DangsajuScanner.jsx
import React from 'react';

// 🚨 데이터 매핑 로직 100% 보존. 허공에 뜬 텍스트와 암흑 박스를 걷어내고 '모던 미스틱'으로 완벽 세공
export default function DangsajuScanner({ dangsajuData, isDarkMode }) {
    if (!dangsajuData || Object.keys(dangsajuData).length === 0) return null;

    const stages = ["초년운 (연성)", "청년운 (월성)", "중년운 (일성)", "말년운 (시성)"];

    // 🔮 모던 미스틱 컬러 팔레트 (유리 질감 및 미스틱 골드 연동)
    const mysticTheme = {
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        glassInner: 'rgba(255, 255, 255, 0.03)', // 반투명 유리 캡슐
        text: '#F4F4F5',
        textMuted: '#A0AEC0', // 시인성이 확보된 라벤더 그레이
        gold: '#F6E05E', // 당사주 전용 미스틱 골드
        goldGlow: '0 0 10px rgba(246, 224, 94, 0.4)', // 황금빛 네온 글로우
    };

    return (
        <div style={{ width: '100%', fontFamily: '"Noto Sans KR", sans-serif' }}>
            
            {/* 🚨 칙칙한 암흑 박스 파괴 -> 반투명 유리 상자 및 감성 아이콘(📜) 추가 */}
            <div style={{ 
                padding: '24px 20px', 
                border: `1px solid ${mysticTheme.glassBorder}`,
                borderRadius: '16px',
                marginBottom: '24px',
                fontSize: '14px', // 폰트 하한선 보장
                lineHeight: '1.7',
                color: mysticTheme.textMuted,
                background: mysticTheme.glassInner,
                fontWeight: '300'
            }}>
                <strong style={{ color: mysticTheme.text, display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: '400' }}>
                    📜 참고용 부록
                </strong>
                당사주는 태어난 해(띠)를 기준으로 보는 고대의 단순화된 점술 기법입니다. 수만 가지의 변수를 정밀하게 연산하는 현대 명리학에 비해 실질적인 적중률은 떨어지므로 가벼운 참고용으로만 활용하십시오.
            </div>
            
            {/* 🚨 점선 형태의 플랫한 리스트를 독립된 유리 상자로 캡슐화 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {stages.map((stage, idx) => {
                    const data = dangsajuData[stage];
                    if (!data) return null;

                    const isUnknown = data.name_clean === "시간 모름";
                    const textColor = mysticTheme.textMuted;
                    const titleColor = isUnknown ? mysticTheme.textMuted : mysticTheme.gold;
                    const titleGlow = isUnknown ? 'none' : mysticTheme.goldGlow;

                    return (
                        <div key={idx} style={{ 
                            background: mysticTheme.glassInner,
                            border: `1px solid ${mysticTheme.glassBorder}`,
                            borderRadius: '16px',
                            padding: '24px 20px'
                        }}>
                            <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '14px', fontWeight: '400', color: mysticTheme.text }}>
                                    {stage}
                                </span>
                                {/* 🚨 당사주 핵심 별자리에 황금빛 네온 글로우 이펙트 적용 */}
                                <h4 style={{ 
                                    margin: 0, 
                                    color: titleColor, 
                                    textShadow: titleGlow,
                                    fontSize: '18px', 
                                    fontWeight: '300',
                                    fontFamily: '"Noto Serif KR", serif',
                                    letterSpacing: '0.5px'
                                }}>
                                    {data.name_clean} <span style={{ fontSize: '14px', fontWeight: '300', color: mysticTheme.textMuted, textShadow: 'none' }}>({data.hanja_clean})</span>
                                </h4>
                            </div>
                            {/* 🚨 폰트 최소 14px 강제 방어 및 가독성 쾌적화 */}
                            <p style={{ fontSize: '14px', lineHeight: '1.7', margin: 0, color: textColor, fontWeight: '300' }}>
                                {data.desc}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}