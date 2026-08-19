// src/components/BaziMatrix.jsx
import React from 'react';

// 🔮 모던 미스틱 전용: 불투명 배경색을 삭제하고, 텍스트 자체에서 빛이 나는 네온 글로우 적용
const getMysticGlowStyle = (char) => {
    // 목(木) - 신비로운 옥색/민트
    if (['甲', '乙', '寅', '卯'].includes(char)) {
        return { color: '#4FD1C5', textShadow: '0 0 15px rgba(79, 209, 197, 0.4)' };
    }
    // 화(火) - 빛나는 코랄 핑크
    if (['丙', '丁', '巳', '午'].includes(char)) {
        return { color: '#FC8181', textShadow: '0 0 15px rgba(252, 129, 129, 0.4)' };
    }
    // 토(土) - 달빛 같은 옅은 골드
    if (['戊', '己', '辰', '戌', '丑', '未'].includes(char)) {
        return { color: '#F6E05E', textShadow: '0 0 15px rgba(246, 224, 94, 0.4)' };
    }
    // 금(金) - 루미너스 화이트
    if (['庚', '辛', '申', '酉'].includes(char)) {
        return { color: '#E2E8F0', textShadow: '0 0 15px rgba(226, 232, 240, 0.4)' };
    }
    // 수(水) - 심연의 오로라 블루
    if (['壬', '癸', '亥', '子'].includes(char)) {
        return { color: '#90CDF4', textShadow: '0 0 15px rgba(144, 205, 244, 0.4)' };
    }
    // 기본값
    return { color: '#A0AEC0', textShadow: 'none' };
};

// 🚨 데이터 매핑 로직 100% 보존
export default function BaziMatrix({ matrixData, pillarStars = {}, isDarkMode = false }) {
    if (!matrixData) return null;

    const pillars = [
        { key: 'hour', label: '시주' },
        { key: 'day', label: '일주' },
        { key: 'month', label: '월주' },
        { key: 'year', label: '연주' }
    ];

    // 🔮 모던 미스틱 테마 변수 (엑셀 선을 투명한 유리 테두리로 변경)
    const mysticTheme = {
        border: 'rgba(255, 255, 255, 0.08)',
        textMuted: '#A0AEC0',
        accent: '#D6BCFA'
    };

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            {/* 🚨 엑셀 격자를 부수고 부드러운 Flex 컨테이너로 렌더링 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                
                {pillars.map((p) => {
                    const data = matrixData[p.key];
                    if (!data) return null;

                    const isDay = p.key === 'day'; // 일주 강조용 플래그
                    const stemStyle = getMysticGlowStyle(data.stem);
                    const branchStyle = getMysticGlowStyle(data.branch);
                    const stars = pillarStars[p.key] || []; 

                    return (
                        <div key={p.key} style={{ 
                            flex: 1, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            // 🚨 불투명 배경 대신 일주에만 반투명 유리 상자 효과 적용
                            background: isDay ? 'rgba(255,255,255,0.03)' : 'transparent',
                            border: isDay ? `1px solid ${mysticTheme.border}` : '1px solid transparent',
                            borderRadius: '16px',
                            padding: '16px 4px',
                            transition: 'all 0.3s ease'
                        }}>
                            
                            {/* 1. 기둥 이름 (일주만 오로라 퍼플 강조) */}
                            <div style={{ 
                                fontSize: '11px', 
                                color: isDay ? mysticTheme.accent : mysticTheme.textMuted, 
                                fontWeight: '300', 
                                letterSpacing: '1px', 
                                marginBottom: '16px' 
                            }}>
                                {p.label} {isDay ? '(나)' : ''}
                            </div>

                            {/* 2. 천간의 십성 */}
                            <div style={{ fontSize: '11px', color: mysticTheme.textMuted, marginBottom: '6px', fontWeight: '300' }}>
                                {data.stem_tg}
                            </div>

                            {/* 3. 천간 글자 (신비로운 글로우 효과 적용) */}
                            <div style={{ 
                                fontSize: '32px', fontWeight: '300', fontFamily: '"Noto Serif KR", serif', 
                                color: stemStyle.color, textShadow: stemStyle.textShadow,
                                marginBottom: '4px'
                            }}>
                                {data.stem}
                            </div>

                            {/* 4. 지지 글자 (신비로운 글로우 효과 적용) */}
                            <div style={{ 
                                fontSize: '32px', fontWeight: '300', fontFamily: '"Noto Serif KR", serif', 
                                color: branchStyle.color, textShadow: branchStyle.textShadow,
                            }}>
                                {data.branch}
                            </div>

                            {/* 5. 지지의 십성 */}
                            <div style={{ fontSize: '11px', color: mysticTheme.textMuted, marginTop: '6px', fontWeight: '300' }}>
                                {data.branch_tg}
                            </div>

                            {/* 6. 12운성 (유리 재질의 작은 캡슐) */}
                            <div style={{ 
                                fontSize: '10px', color: '#F4F4F5', marginTop: '12px', padding: '4px 10px',
                                border: `1px solid ${mysticTheme.border}`, borderRadius: '12px', background: 'rgba(0,0,0,0.2)'
                            }}>
                                {data.wunseong}
                            </div>

                            {/* 7. 기둥별 신살/귀인 리스트 (텍스트 컬러만 미세조정) */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px', gap: '4px', minHeight: '40px' }}>
                                {stars.length > 0 ? (
                                    stars.map((star, idx) => (
                                        <div key={idx} style={{ 
                                            fontSize: '10px', 
                                            fontWeight: '300',
                                            // 귀인은 푸른빛, 나머지는 은은한 그레이
                                            color: star.includes('귀인') ? '#90CDF4' : mysticTheme.textMuted 
                                        }}>
                                            {star}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ color: 'transparent' }}>-</div>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}