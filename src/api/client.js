// src/api/client.js

// 백엔드 서버 기본 주소
const API_BASE_URL = 'http://localhost:8000/api/v1'; 

/**
 * 1. 개인 사주 및 운세 종합 분석 API 호출
 */
export const fetchSajuAnalysis = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/saju`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userData }),
        });
        
        if (!response.ok) {
            // 🚨 [에러 은폐 방지] 백엔드 FastAPI가 내려주는 상세 에러(detail)를 추출합니다.
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.detail || `서버 에러가 발생했습니다. (상태 코드: ${response.status})`;
            throw new Error(errorMessage);
        }
        
        return await response.json();
    } catch (error) {
        console.error("🔮 [Saju API Error]:", error);
        throw error; // UI 컴포넌트로 에러를 그대로 전달하여 화면에 표시되게 함
    }
};

/**
 * 2. 혼택촬요 (궁합 및 택일) 분석 API 호출
 * @param {Object} gunghapData - { groom: UserInfo, bride: UserInfo, target_date: "YYYY-MM-DD HH:MM" }
 */
export const fetchGunghapAnalysis = async (gunghapData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/gunghap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gunghapData),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.detail || `궁합 연산 중 서버 에러가 발생했습니다. (상태 코드: ${response.status})`;
            throw new Error(errorMessage);
        }
        
        return await response.json();
    } catch (error) {
        console.error("💞 [Gunghap API Error]:", error);
        throw error;
    }
};

/**
 * 3. 역학 백과사전 검색 API 호출
 * @param {string} query - 검색어
 * @param {string} category - (선택) 카테고리
 */
export const fetchDictionary = async (query, category = '') => {
    try {
        // GET 요청이므로 URL 파라미터 조합
        const url = new URL(`${API_BASE_URL}/dictionary`);
        url.searchParams.append('query', query);
        if (category) {
            url.searchParams.append('category', category);
        }

        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.detail || `사전 검색 중 서버 에러가 발생했습니다. (상태 코드: ${response.status})`;
            throw new Error(errorMessage);
        }
        
        return await response.json();
    } catch (error) {
        console.error("📚 [Dictionary API Error]:", error);
        throw error;
    }
};