// src/components/SajuForm.jsx
import React, { useState } from 'react';

export default function SajuForm({ onSubmit, isLoading }) {
    // 🚨 [테스트 고정값 세팅] 개발 편의를 위해 파트너 궁합 모드를 기본으로 켭니다. (기존 로직 보존)
    const [isGunghap, setIsGunghap] = useState(true);

    // 🚨 [테스트 고정값 세팅] 본인: 1976년 02월 22일 음력 오전 01:40 (김정길) (기존 로직 보존)
    const [person1, setPerson1] = useState({
        name: '김정길',
        gender: 'M',
        birth_date: '1976-02-22',
        birth_time: '01:40',
        is_lunar: true, // 음력
    });

    // 🚨 [테스트 고정값 세팅] 상대방: 1971년 12월 18일 음력 오후 08:00 (기존 로직 보존)
    const [person2, setPerson2] = useState({
        name: '상대방',
        gender: 'F',
        birth_date: '1971-12-18',
        birth_time: '20:00',
        is_lunar: true, // 음력
    });

    // 🚨 커서 증발 방지: 상태 업데이트만 순수하게 처리 (기존 로직 보존)
    const handleChange = (e, isP2 = false) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : (name === 'is_lunar' ? value === 'true' : value);
        
        if (isP2) {
            setPerson2({ ...person2, [name]: val });
        } else {
            setPerson1({ ...person1, [name]: val });
        }
    };

    const buildPayload = (data) => ({
        name: data.name || '무명', 
        gender: data.gender,
        birth_date: `${data.birth_date} ${data.birth_time}`,
        is_lunar: Boolean(data.is_lunar),
        current_age: new Date().getFullYear() - parseInt(data.birth_date.split('-')[0]) + 1
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!person1.birth_date || !person1.birth_time) {
            alert('생년월일과 태어난 시간을 정확히 입력해주세요.');
            return;
        }
        if (isGunghap && (!person2.birth_date || !person2.birth_time)) {
            alert('파트너의 생년월일과 태어난 시간을 정확히 입력해주세요.');
            return;
        }

        if (isGunghap) {
            onSubmit({ type: 'gunghap', person1: buildPayload(person1), person2: buildPayload(person2) });
        } else {
            onSubmit({ type: 'single', user: buildPayload(person1) });
        }
    };

    return (
        // 🔮 모던 미스틱(유리 질감) 폼 컨테이너
        <form onSubmit={handleSubmit} style={styles.container}>
            <div style={styles.headerRow}>
                <h2 style={styles.title}>명리 정보 입력</h2>
                <button type="button" onClick={() => setIsGunghap(!isGunghap)} style={styles.toggleBtn}>
                    {isGunghap ? '단일 사주로 변경' : '파트너 궁합 추가'}
                </button>
            </div>
            
            {/* ============================== 파트너 1 입력부 ============================== */}
            <div style={styles.panel}>
                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>이름</label>
                        <input 
                            type="text" name="name" value={person1.name} onChange={(e) => handleChange(e, false)} 
                            placeholder="본인 이름" autoComplete="off" required style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>성별</label>
                        <select name="gender" value={person1.gender} onChange={(e) => handleChange(e, false)} style={styles.select}>
                            <option value="M">남성 (乾命)</option>
                            <option value="F">여성 (坤命)</option>
                        </select>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>역법</label>
                        <select name="is_lunar" value={person1.is_lunar} onChange={(e) => handleChange(e, false)} style={styles.select}>
                            <option value={false}>양력</option>
                            <option value={true}>음력</option>
                        </select>
                    </div>
                </div>

                <div style={styles.row}>
                    <div style={{...styles.inputGroup, flex: 2}}>
                        <label style={styles.label}>생년월일</label>
                        <input 
                            type="date" name="birth_date" value={person1.birth_date} onChange={(e) => handleChange(e, false)} 
                            required style={styles.input}
                        />
                    </div>
                    <div style={{...styles.inputGroup, flex: 1}}>
                        <label style={styles.label}>태어난 시간</label>
                        <input 
                            type="time" name="birth_time" value={person1.birth_time} onChange={(e) => handleChange(e, false)} 
                            required style={styles.input}
                        />
                    </div>
                </div>
            </div>

            {/* ============================== 파트너 2 입력부 ============================== */}
            {isGunghap && (
                <div style={styles.partnerSection}>
                    <h3 style={styles.partnerTitle}>파트너 정보 입력</h3>
                    <div style={styles.panel}>
                        <div style={styles.row}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>이름</label>
                                <input 
                                    type="text" name="name" value={person2.name} onChange={(e) => handleChange(e, true)} 
                                    placeholder="파트너 이름" autoComplete="off" required style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>성별</label>
                                <select name="gender" value={person2.gender} onChange={(e) => handleChange(e, true)} style={styles.select}>
                                    <option value="M">남성 (乾命)</option>
                                    <option value="F">여성 (坤命)</option>
                                </select>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>역법</label>
                                <select name="is_lunar" value={person2.is_lunar} onChange={(e) => handleChange(e, true)} style={styles.select}>
                                    <option value={false}>양력</option>
                                    <option value={true}>음력</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.row}>
                            <div style={{...styles.inputGroup, flex: 2}}>
                                <label style={styles.label}>생년월일</label>
                                <input 
                                    type="date" name="birth_date" value={person2.birth_date} onChange={(e) => handleChange(e, true)} 
                                    required style={styles.input}
                                />
                            </div>
                            <div style={{...styles.inputGroup, flex: 1}}>
                                <label style={styles.label}>태어난 시간</label>
                                <input 
                                    type="time" name="birth_time" value={person2.birth_time} onChange={(e) => handleChange(e, true)} 
                                    required style={styles.input}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button type="submit" disabled={isLoading} style={isLoading ? styles.buttonDisabled : styles.button}>
                {isLoading ? '운명 연산 중... ✧' : (isGunghap ? '유니버설 궁합 분석하기' : '사주 분석하기')}
            </button>
        </form>
    );
}

// 🔮 모던 미스틱(유리 질감) 전용 CSS 스타일 객체
const styles = {
    container: { 
        padding: '30px 20px', 
        background: 'rgba(20, 24, 39, 0.45)', // 🚨 새하얀 배경 대신 반투명 유리 배경 적용
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)', 
        borderRadius: '24px', 
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        fontFamily: '"Noto Sans KR", sans-serif',
        color: '#F4F4F5'
    },
    headerRow: { 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px', marginBottom: '25px' 
    },
    title: { margin: 0, color: '#F4F4F5', fontSize: '18px', fontWeight: '300', fontFamily: '"Noto Serif KR", serif' },
    toggleBtn: { 
        padding: '8px 16px', 
        background: 'rgba(255,255,255,0.05)', // 🚨 촌스러운 핑크색 제거, 유리 버튼으로 변경
        color: '#A0AEC0', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: '16px', 
        cursor: 'pointer', 
        fontSize: '12px',
        transition: 'all 0.3s'
    },
    partnerSection: { marginTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '25px' },
    partnerTitle: { margin: '0 0 20px 0', color: '#D6BCFA', fontSize: '16px', fontWeight: '300', fontFamily: '"Noto Serif KR", serif' },
    panel: { display: 'flex', flexDirection: 'column', gap: '20px' },
    row: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
    inputGroup: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: '100px' },
    label: { fontSize: '12px', color: '#A0AEC0', marginBottom: '8px', fontWeight: '300' },
    input: { 
        padding: '12px 15px', 
        border: '1px solid rgba(255,255,255,0.1)', // 🚨 칙칙한 회색 테두리를 투명한 흰선으로 변경
        borderRadius: '12px', 
        fontSize: '14px', 
        outline: 'none', 
        background: 'rgba(0,0,0,0.2)', // 🚨 투명한 인풋창
        color: '#F4F4F5',
        colorScheme: 'dark' // 달력 아이콘 다크모드 대응
    },
    select: { 
        padding: '12px 15px', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: '12px', 
        fontSize: '14px', 
        outline: 'none', 
        background: 'rgba(0,0,0,0.2)', 
        color: '#F4F4F5', 
        cursor: 'pointer' 
    },
    button: { 
        width: '100%', 
        padding: '18px', 
        background: '#F4F4F5', // 🚨 시퍼런 버튼 대신 깔끔한 화이트 버튼
        color: '#090A0F', 
        border: 'none', 
        borderRadius: '16px', 
        fontSize: '15px', 
        fontWeight: 'bold', 
        cursor: 'pointer', 
        marginTop: '30px',
        letterSpacing: '1px',
        transition: 'all 0.3s'
    },
    buttonDisabled: { 
        width: '100%', 
        padding: '18px', 
        background: 'rgba(255,255,255,0.1)', 
        color: '#A0AEC0', 
        border: '1px solid rgba(255,255,255,0.05)', 
        borderRadius: '16px', 
        fontSize: '15px', 
        fontWeight: 'bold', 
        cursor: 'not-allowed', 
        marginTop: '30px',
        letterSpacing: '1px'
    }
};