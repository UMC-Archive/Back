import request from 'request';

// request를 Promise로 래핑
const requestPromise = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                return resolve(null);
            }

            // 응답 상태 코드가 200이 아닌 경우 에러 처리
            if (response.statusCode !== 200) {
                return resolve(null);
            }

            // 응답 본문이 비어 있지 않은지 확인
            if (body && body.trim() !== '') {
                try {
                    // JSON 응답 파싱
                    const data = JSON.parse(body);
                    resolve(data);
                } catch (e) {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    });
};

// 검색을 위한 함수 (비동기)
const searchItunes = async (query) => {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=1`;
    try {
        const data = await requestPromise(url);
        return data.results; // 검색된 결과 반환
    } catch (error) {
        console.error('Error fetching data from iTunes API:', error);
        return [];
    }
};
export const getAlbumItunes = async (music_name, artist_name) => {
    const results = await searchItunes(`${artist_name} ${music_name}`);
    return results[0];
};
const searchItunesEntity = async (query, entity) => {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=${encodeURIComponent(entity)}&limit=1`;
    try {
        const data = await requestPromise(url);
        return data.results; // 검색된 결과 반환
    } catch (error) {
        console.error('Error fetching data from iTunes API:', error);
        return [];
    }
};
export const getAlbumItunesEntity = async (album_name, artist_name, entity) => {
    const results = await searchItunesEntity(`${artist_name} ${album_name}`, entity);
    if (!results[0]) {
        return null;
    }
    return results[0];
};