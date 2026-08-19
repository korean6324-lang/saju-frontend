// src/components/ManseryeokCalendar.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 🚨 솔리드 배경색 싹 걷어내고 우주 배경에 어울리는 투명한 유리 질감 세공
const getMysticBgColor = (branch) => {
    // 모두 반투명한 유리 상자 느낌으로 통일하되, 오행별로 아주 미세한 틴트(Tint)만 줍니다.
    if (['寅', '卯'].includes(branch)) return 'rgba(79, 209, 197, 0.05)'; // 목(민트)
    if (['巳', '午'].includes(branch)) return 'rgba(252, 129, 129, 0.05)'; // 화(코랄)
    if (['辰', '戌', '丑', '未'].includes(branch)) return 'rgba(246, 224, 94, 0.05)'; // 토(골드)
    if (['申', '酉'].includes(branch)) return 'rgba(255, 255, 255, 0.05)'; // 금(화이트)
    if (['亥', '子'].includes(branch)) return 'rgba(183, 148, 244, 0.05)'; // 수(퍼플)
    return 'rgba(255, 255, 255, 0.03)';
};

// 🚨 다크/유리 테마에서 영롱하게 빛나는 오행별 파스텔 네온 컬러 매핑
const getMysticTextColor = (char) => {
    if (['甲', '乙', '寅', '卯'].includes(char)) return '#4FD1C5'; // 목 (민트)
    if (['丙', '丁', '巳', '午'].includes(char)) return '#FC8181'; // 화 (코랄 핑크)
    if (['戊', '己', '辰', '戌', '丑', '未'].includes(char)) return '#F6E05E'; // 토 (미스틱 골드)
    if (['庚', '辛', '申', '酉'].includes(char)) return '#E2E8F0'; // 금 (화이트 실버)
    if (['壬', '癸', '亥', '子'].includes(char)) return '#D6BCFA'; // 수 (오로라 퍼플)
    return '#A0AEC0';
};

export default function ManseryeokCalendar() {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const [calendarData, setCalendarData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const fetchCalendar = async (year, month) => {
        setIsFetching(true); 
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/calendar?year=${year}&month=${month}`);
            setCalendarData(response.data.calendar || []);
        } catch (error) {
            console.error("만세력 데이터를 불러오는 데 실패했습니다.", error);
        } finally {
            setIsFetching(false); 
        }
    };

    useEffect(() => {
        fetchCalendar(currentYear, currentMonth);
    }, [currentYear, currentMonth]);

    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentYear(prev => prev - 1);
            setCurrentMonth(12);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentYear(prev => prev + 1);
            setCurrentMonth(1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month - 1, 1).getDay(); 
    };

    const firstDayOffset = getFirstDayOfMonth(currentYear, currentMonth);
    const emptyCells = Array.from({ length: firstDayOffset }, (_, i) => i);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>✧ 만세력 일진 달력 ✧</h3>
            
            {/* 달력 컨트롤러 */}
            <div style={styles.header}>
                <button onClick={handlePrevMonth} style={styles.navBtn} disabled={isFetching}>◀</button>
                <div style={styles.monthTitle}>{currentYear}년 {currentMonth}월</div>
                <button onClick={handleNextMonth} style={styles.navBtn} disabled={isFetching}>▶</button>
            </div>

            <div style={{ ...styles.gridWrapper, opacity: isFetching ? 0.5 : 1 }}>
                
                {/* 요일 표시줄 (다크 모드 컬러 최적화) */}
                <div style={styles.grid}>
                    {weekdays.map(day => (
                        <div key={day} style={{...styles.weekdayCell, color: day === '일' ? '#FC8181' : day === '토' ? '#63B3ED' : '#A0AEC0'}}>
                            {day}
                        </div>
                    ))}
                    
                    {emptyCells.map(cell => <div key={`empty-${cell}`} style={styles.emptyCell} />)}
                    
                    {/* 실제 날짜 렌더링 */}
                    {calendarData.map((dayData, idx) => {
                        const isToday = 
                            currentYear === today.getFullYear() && 
                            currentMonth === today.getMonth() + 1 && 
                            dayData.day === today.getDate();

                        const bgColor = getMysticBgColor(dayData.branch);
                        
                        return (
                            <div key={idx} style={{
                                ...styles.dateCell,
                                backgroundColor: bgColor,
                                // 🚨 촌스러운 회색 테두리 날리고 반투명 유리 경계선 세공
                                border: isToday ? '1px solid #D6BCFA' : '1px solid rgba(255, 255, 255, 0.08)',
                                boxShadow: isToday ? '0 0 10px rgba(214, 188, 250, 0.4)' : 'none'
                            }}>
                                <div style={styles.dayHeaderRow}>
                                    <span style={{...styles.solarDay, color: isToday ? '#D6BCFA' : '#E2E8F0'}}>{dayData.day}</span>
                                    <span style={styles.lunarDay}>음{dayData.lunar_month}.{dayData.lunar_day}</span>
                                </div>
                                
                                <div style={styles.ganjiBox}>
                                    {/* 🚨 오행별 네온 텍스트 컬러 매핑 */}
                                    <div style={{ color: getMysticTextColor(dayData.stem), fontSize: '15px', fontWeight: '400', textShadow: `0 0 8px ${getMysticTextColor(dayData.stem)}66` }}>
                                        {dayData.stem}
                                    </div>
                                    <div style={{ color: getMysticTextColor(dayData.branch), fontSize: '15px', fontWeight: '400', textShadow: `0 0 8px ${getMysticTextColor(dayData.branch)}66` }}>
                                        {dayData.branch}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { 
        padding: '0', 
        backgroundColor: 'transparent',
    },
    title: { 
        color: '#D6BCFA', // 타이틀도 오로라 퍼플로 변경
        margin: '0 0 15px 0', 
        fontSize: '18px', 
        fontFamily: '"Noto Serif KR", serif',
        borderBottom: '1px solid rgba(255,255,255,0.08)', 
        paddingBottom: '12px',
        textAlign: 'center',
        fontWeight: '300'
    },
    header: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px' 
    },
    navBtn: { 
        padding: '6px 12px', 
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // 버튼도 유리 질감화
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontSize: '12px', 
        color: '#E2E8F0',
        transition: 'background-color 0.2s'
    },
    monthTitle: { 
        fontSize: '16px', 
        fontWeight: '400', 
        color: '#F4F4F5' // 텍스트 컬러 밝게
    },
    gridWrapper: {
        transition: 'opacity 0.2s ease-in-out', 
    },
    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '4px' 
    },
    weekdayCell: { 
        textAlign: 'center', 
        padding: '8px 0', 
        fontSize: '13px', 
        fontWeight: '300', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)', 
        marginBottom: '4px'
    },
    emptyCell: { 
        backgroundColor: 'transparent', 
        minHeight: '70px', 
        borderRadius: '8px' 
    },
    dateCell: { 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '6px', 
        minHeight: '70px', 
        borderRadius: '8px', // 좀 더 둥근 유리 캡슐 느낌
        cursor: 'default',
        boxSizing: 'border-box'
    },
    dayHeaderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        width: '100%',
        marginBottom: '4px'
    },
    solarDay: { 
        fontSize: '13px', 
        fontWeight: '300', 
    },
    lunarDay: { 
        fontSize: '9px', 
        color: '#718096', 
        letterSpacing: '-0.5px'
    },
    ganjiBox: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1,
        lineHeight: '1.2' 
    }
};