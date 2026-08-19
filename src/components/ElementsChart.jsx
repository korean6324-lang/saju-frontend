// src/components/ElementsChart.jsx
import React from 'react';

// 🚨 기존 로직 100% 보존, 디자인만 네온 튜브 스타일로 업그레이드
export default function ElementsChart({ elementsData, isDarkMode }) {
    if (!elementsData) return null;

    // 모던 미스틱 테마에 맞춘 고급스러운 네온 오행 컬러
    const elementKeys = ['목', '화', '토', '금', '수'];
    const elementStyles = {
        '목': { color: '#4FD1C5', glow: '0 0 10px rgba(79, 209, 197, 0.4)' },
        '화': { color: '#FC8181', glow: '0 0 10px rgba(252, 129, 129, 0.4)' },
        '토': { color: '#F6E05E', glow: '0 0 10px rgba(246, 224, 94, 0.4)' },
        '금': { color: '#E2E8F0', glow: '0 0 10px rgba(226, 232, 240, 0.4)' },
        '수': { color: '#90CDF4', glow: '0 0 10px rgba(144, 205, 244, 0.4)' }
    };

    // 데이터 정규화 (기존 로직 보존)
    const rawValues = elementKeys.map(key => parseFloat(elementsData[key]) || 0);
    const total = rawValues.reduce((sum, val) => sum + val, 0) || 1; 
    const dataValues = rawValues.map(val => (val / total) * 100);

    return (
        <div style={{ width: '100%', fontFamily: '"Noto Sans KR", sans-serif' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {elementKeys.map((key, idx) => {
                    const val = dataValues[idx];
                    const style = elementStyles[key];
                    
                    return (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {/* 라벨 (네온 글로우) */}
                            <div style={{ width: '25px', fontSize: '14px', textAlign: 'center', color: style.color, textShadow: style.glow, fontWeight: '400' }}>
                                {key}
                            </div>
                            
                            {/* 🚨 네온 튜브 프로그레스 바 (부드러운 라운드 적용) */}
                            <div style={{ 
                                flex: 1, 
                                height: '10px', 
                                background: 'rgba(0,0,0,0.3)', // 빈 트랙은 투명하고 어둡게
                                borderRadius: '6px', // 🚨 모서리를 부드럽게
                                overflow: 'hidden' 
                            }}>
                                <div style={{ 
                                    height: '100%', 
                                    backgroundColor: style.color, 
                                    boxShadow: style.glow, // 막대 자체에도 빛 번짐
                                    width: `${val}%`,
                                    borderRadius: '6px', // 🚨 채워지는 막대도 둥글게
                                    transition: 'width 0.8s ease-in-out'
                                }} />
                            </div>
                            
                            {/* 수치 (네온 글로우 통일) */}
                            <div style={{ width: '45px', fontSize: '13px', color: style.color, textShadow: style.glow, textAlign: 'right', fontWeight: '300' }}>
                                {val.toFixed(1)}%
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}