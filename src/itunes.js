import request from "request";

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
      if (body && body.trim() !== "") {
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
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
    query
  )}&media=music&limit=1`;
  try {
    const data = await requestPromise(url);
    return data.results; // 검색된 결과 반환
  } catch (error) {
    console.error("Error fetching data from iTunes API:", error);
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
        return data ? data.results : null; // 검색된 결과 반환
    } catch (error) {
        console.error('Error fetching data from iTunes API:', error);
        return [];
    }
};
export const getAlbumItunesEntity = async (album_name, artist_name, entity) => {
  const results = await searchItunesEntity(
    `${artist_name} ${album_name}`,
    entity
  );
  if (!results[0]) {
    return null;
  }
  return results[0];
};

export const getTrackReleaseYear = async (trackName, artistName) => {
  try {
    // API 호출 전 잠시 대기 (API 요청 제한 회피)
    await new Promise((resolve) => setTimeout(resolve, 100));

    const cleanTrackName = trackName.replace(/\(.*?\)/g, "").trim();
    const query = encodeURIComponent(`${cleanTrackName} ${artistName}`);

    const response = await fetch(
      `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`
    );

    // 응답 확인
    if (!response.ok) {
      return null;
    }

    const text = await response.text(); // 텍스트로 변환
    if (!text) {
      return null;
    }

    const data = JSON.parse(text);

    if (data.results && data.results.length > 0) {
      const releaseDate = data.results[0].releaseDate;
      return releaseDate ? new Date(releaseDate).getFullYear() : null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching data from iTunes API:", error);
    return null;
  }
};
