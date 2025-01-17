import request from 'request';

// request를 Promise로 래핑
const requestPromise = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(body)); // JSON으로 응답을 반환
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