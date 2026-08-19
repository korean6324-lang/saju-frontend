// src/components/DaewunScanner.jsx
import React, { useRef, useState } from 'react';

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
export default function DaewunScanner({ daewunData, isDarkMode }) {
    // 마우스 드래그 스크롤을 위한 상태 및 Ref
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    if (!daewunData || !daewunData.daewun_flow || !daewunData.daewun_flow.pillars) return null;

    const { pillars, ages } = daewunData.daewun_flow;
    const { active_daewun, frontend_ui_payload } = daewunData.current_status || {};
    const currentDaewunAge = active_daewun ? active_daewun.started_at_age : null;

    // 🔮 모던 미스틱 테마 변수 설정
    const mysticTheme = {
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        glassHighlight: 'rgba(255, 255, 255, 0.05)', // 현재 대운 강조용 투명 박스
        text: '#F4F4F5',
        textMuted: '#A0AEC0',
        accent: '#D6BCFA',
    };

    // 🚨 마우스 드래그 이벤트 핸들러 추가
    const onMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };
    const onMouseLeave = () => setIsDragging(false);
    const onMouseUp = () => setIsDragging(false);
    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // 스크롤 속도 배율
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div style={{ width: '100%', padding: '0', fontFamily: '"Noto Sans KR", sans-serif' }}>
            <p style={{ fontSize: '11px', color: mysticTheme.textMuted, marginBottom: '20px', letterSpacing: '0.5px', textAlign: 'center', fontWeight: '300' }}>
                ※ 좌우로 드래그하여 10년 단위 인생 흐름을 확인하세요.
            </p>
            
            {/* 가로 스크롤 컨테이너 (스크롤바 숨김 + 마우스 드래그 이벤트 연결) */}
            <div 
                ref={scrollRef}
                className="hide-scrollbar" 
                style={{ 
                    overflowX: 'auto', 
                    paddingBottom: '10px',
                    cursor: isDragging ? 'grabbing' : 'grab' // 드래그 커서 표시
                }}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
            >
                {/* 🚨 엑셀 테두리를 없애고 가로로 나열 */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', padding: '0 10px' }}>
                    {pillars.map((ganjiStr, idx) => {
                        const age = ages && ages[idx] !== undefined ? ages[idx] : "-";
                        const safeStem = ganjiStr ? ganjiStr.charAt(0) : "";
                        const safeBranch = ganjiStr && ganjiStr.length > 1 ? ganjiStr.charAt(1) : "";

                        const isCurrent = currentDaewunAge === age;
                        const isPast = currentDaewunAge && age < currentDaewunAge;

                        const stemStyle = getMysticGlowStyle(safeStem);
                        const branchStyle = getMysticGlowStyle(safeBranch);

                        return (
                            <div key={idx} style={{
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                // 🚨 촌스러운 선 삭제, 현재 대운만 유리 상자로 강조
                                background: isCurrent ? mysticTheme.glassHighlight : 'transparent',
                                border: isCurrent ? `1px solid ${mysticTheme.glassBorder}` : '1px solid transparent',
                                borderRadius: '16px',
                                padding: '16px 12px',
                                minWidth: '55px',
                                opacity: isPast ? 0.3 : 1, // 지나간 대운은 투명하게
                                transition: 'all 0.3s ease',
                                userSelect: 'none' // 드래그 시 텍스트 선택 방지
                            }}>
                                {/* 시작 나이 */}
                                <div style={{ 
                                    fontSize: '12px', 
                                    fontWeight: '300', 
                                    color: isCurrent ? mysticTheme.accent : mysticTheme.textMuted,
                                    marginBottom: '16px',
                                    letterSpacing: '1px'
                                }}>
                                    {age}세
                                </div>
                                
                                {/* 천간 글자 (네온 글로우) */}
                                <div style={{
                                    fontSize: '24px', 
                                    fontWeight: '300', 
                                    fontFamily: '"Noto Serif KR", serif',
                                    color: stemStyle.color,
                                    textShadow: stemStyle.textShadow,
                                    marginBottom: '8px'
                                }}>
                                    {safeStem}
                                </div>
                                
                                {/* 지지 글자 (네온 글로우) */}
                                <div style={{
                                    fontSize: '24px', 
                                    fontWeight: '300', 
                                    fontFamily: '"Noto Serif KR", serif',
                                    color: branchStyle.color,
                                    textShadow: branchStyle.textShadow,
                                }}>
                                    {safeBranch}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* 고급 프론트엔드 UI 페이로드 (유리 질감 박스 적용) */}
            {frontend_ui_payload && (
                <div style={{ 
                    marginTop: '25px', 
                    padding: '20px', 
                    background: 'rgba(255,255,255,0.03)', // 반투명 유리 박스
                    border: `1px solid ${mysticTheme.glassBorder}`, 
                    borderRadius: '16px', // 둥근 모서리
                    fontSize: '13px', 
                    lineHeight: '1.7' 
                }}>
                    <strong style={{color: mysticTheme.text, display: 'block', marginBottom: '8px', fontWeight: '400', fontSize: '14px'}}>
                        {frontend_ui_payload.title}
                    </strong>
                    <span style={{color: mysticTheme.textMuted, display: 'block', marginBottom: '6px', fontWeight: '300'}}>
                        {frontend_ui_payload.subtitle}
                    </span>
                    <span style={{color: mysticTheme.accent, fontWeight: '400'}}>
                        {frontend_ui_payload.progress_message}
                    </span>
                </div>
            )}
        </div>
    );
}