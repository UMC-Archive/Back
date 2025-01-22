import {
  responseFromArtist,
  responseFromAlbum,
  responseFromMusic,
  responseFromHiddenMusics,
  responseFromGenres,
  responseFromSpecificArtist,
  responseFromAllArtists,
} from "../dtos/music.dto.js";
import { getArtistInfo } from "../lastfm.js";
import { getAlbumItunes, getAlbumItunesEntity } from "../itunes.js";
import {
  getBillboardAPI,
  extractBillboard,
  getMusicDB,
  getMusicAPI,
  addMusic,
  addMusicArtist,
  getLyricsAPI,
  getAlbumDB,
  getAlbumAPI,
  addAlbum,
  searchAlbumAPI,
  getArtistDB,
  getArtistAPI,
  addArtist,
  getAlbumItunesAPI,
  addMusicGenre,
  getUserHistory,
  getUserArtistPrefers,
  getAllStoreGenres,
  getSpecificArtistAPI,
  getallArtistsAPI,
} from "../repositories/music.repository.js";
//당신을 위한 앨범 추천(연도)
// export const listNominationAlbum = async (user_id) => {
//     const userHistory = await getUserHistory(user_id);
//     const year = userHistory[0].history;
//     const userArtistPrefers = await getUserArtistPrefers(user_id)
//     const { artists } = await extractBillboard(await getBillboardAPI(year));
//     let totalTag = [];
//     for (const artist of artists) {
//         const tags = (await getArtistInfo(artist)).tags.tag
//         for (const tag in tags) {
//             if (!totalTag.includes(tags[tag].name)) {
//                 totalTag.push(tags[tag].name);
//             }
//         }
//     }
//     let userTags = [];
//     for (const userArtistPrefer of userArtistPrefers) {
//         const tags = (await getArtistInfo(userArtistPrefer.artist.name)).tags.tag
//         for (const tag in tags) {
//             if (!userTags.includes(tags[tag].name)) {
//                 userTags.push(tags[tag].name);
//             }
//         }
//     }
//     let totalArtists = [];
//     const duplicates = totalTag.filter(value => userTags.includes(value.toLowerCase()));
//     for (const artist of artists) {
//         const artist_a = await getArtistInfo(artist);
//         for (const tag in artist_a.tags.tag) {
//             for (const duplicate in duplicates) {
//                 if (artist_a.tags.tag[tag].name === duplicates[duplicate]) {
//                     if (!totalArtists.includes(artist_a.name)) {
//                         totalArtists.push(artist_a.name);
//                         for (let a in artist_a.similar.artist) {
//                             if (!totalArtists.includes(artist_a.similar.artist[a].name)) {
//                                 totalArtists.push(artist_a.similar.artist[a].name);
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     totalArtists.map(a => console.log(a));
// }
const artistNomination = async (user_id) => {
  const userHistory = await getUserHistory(user_id);
  const year = new Date(userHistory[0].history).toISOString().split("T")[0];

  const userArtistPrefers = await getUserArtistPrefers(user_id);
  const { artists } = await extractBillboard(await getBillboardAPI(year));

  // Set을 사용하여 중복을 제거
  const totalTag = new Set();
  const userTags = new Set();

  // 아티스트 정보를 캐싱하기 위한 객체
  const artistInfoCache = {};

  // 아티스트의 태그를 캐시 또는 API에서 가져오는 함수
  const getArtistTags = async (artist) => {
    if (artistInfoCache[artist]) {
      return artistInfoCache[artist];
    }
    const artistInfo = await getArtistInfo(artist);
    artistInfoCache[artist] = artistInfo;
    return artistInfo;
  };

  // Billboard 아티스트들의 태그를 totalTag에 추가
  for (const artist of artists) {
    const artistInfo = await getArtistTags(artist);
    artistInfo.tags.tag.forEach((tag) => totalTag.add(tag.name.toLowerCase()));
  }

  // 사용자 선호 아티스트들의 태그를 userTags에 추가
  for (const userArtistPrefer of userArtistPrefers) {
    const artistInfo = await getArtistTags(userArtistPrefer.artist.name);
    artistInfo.tags.tag.forEach((tag) => userTags.add(tag.name.toLowerCase()));
  }

  // 중복되는 태그를 찾아서 Set으로 변환
  const duplicates = [...totalTag].filter((tag) => userTags.has(tag));

  // 추천 아티스트를 Set에 저장 (중복을 자동으로 제거)
  const totalArtists = new Set();

  // Billboard 아티스트에 대한 정보를 비동기적으로 가져오기
  await Promise.all(
    artists.map(async (artist) => {
      const artistInfo = await getArtistTags(artist);

      // 중복된 태그가 있을 경우, 해당 아티스트를 추가
      for (const tag of artistInfo.tags.tag) {
        if (duplicates.includes(tag.name.toLowerCase())) {
          totalArtists.add(artistInfo.name); // 현재 아티스트 추가

          // 유사 아티스트가 있을 경우, 유사 아티스트들도 추가
          if (artistInfo.similar && artistInfo.similar.artist) {
            artistInfo.similar.artist.forEach((similarArtist) => {
              totalArtists.add(similarArtist.name);
            });
          }
        }
      }
    })
  );
  const cleanArtists = [...totalArtists].map((artist) => {
    const andIndex = artist.toLowerCase().indexOf("and");
    if (andIndex !== -1) {
      return artist.slice(0, andIndex).trim(); // "and" 앞 부분만 남김
    }
    return artist;
  });
  // 중복을 제거하기 위해 Set으로 변환
  const finalArtists = new Set(cleanArtists);

  return finalArtists;
};
export const listNominationMusic = async (user_id) => {
  const artists = await artistNomination(user_id);
  // 추천된 아티스트들의 앨범을 가져오기
  let recommendedMusics = [];
  for (const artist of artists) {
    const musics = await getAlbumItunes("", artist);
    if (musics) {
      recommendedMusics.push(
        await listMusic(artist, musics.trackName.split("(")[0])
      );
    }
  }
  return recommendedMusics;
};
export const listNominationAlbum = async (user_id) => {
  const artists = await artistNomination(user_id);
  // 추천된 아티스트들의 앨범을 가져오기
  let recommendedAlbums = [];
  for (const artist of artists) {
    const albums = await getAlbumItunesEntity("", artist, "album");
    if (albums) {
      recommendedAlbums.push(await listAlbum(artist, albums.collectionName));
    }
  }
  return recommendedAlbums;
};

//숨겨진 명곡
export const listHiddenMusics = async (date) => {
  const billboardTop10 = await getBillboardAPI(date);
  const { titles, artists } = await extractBillboard(billboardTop10);
  const musics = await Promise.all(
    artists.map((artist, i) => listMusic(artist, titles[i]))
  );
  return responseFromHiddenMusics({
    musics,
  });
};
//음악 정보 가져오기
export const listMusic = async (artist_name, music_name) => {
  //DB에 음악이 저장 되어 있을 때
  const musicDB = await getMusicDB(music_name);
  if (musicDB) {
    return responseFromMusic(musicDB);
  }
  //DB에 음악이 저장 되어 있지 않을 때
  //아티스트 정보
  const artist = await listArtist(artist_name);
  //앨범 정보
  const album = await listAlbumSearch(music_name, artist_name);
  //음악 가사 정보
  let lyrics = await getLyricsAPI(artist_name, music_name);
  //가사를 불러 올 수 없을 때가 존재함, 추후에 다른 api를 찾으면 none 대신 다른 api를 통해 찾기로 변경
  if (!lyrics) {
    lyrics = "none";
  }
  //음악 정보
  const apiInfo = await getMusicAPI(album, lyrics, artist_name, music_name);
  const music = await addMusic(apiInfo);
  if (!artist && !music) await addMusicArtist(artist, music);
  // const musicGenre = await addMusicGenre(genre, music); 아직 미구현
  return responseFromMusic(music);
};
// 앨범 정보 검색하기
const listAlbumSearch = async (music_name, artist_name) => {
  const albumApi = await searchAlbumAPI(music_name, artist_name);
  if (albumApi) {
    const albumName = albumApi.collectionName;
    let album = {};
    album = await getAlbumDB(albumName);
    if (!album) {
      let apiInfo = await getAlbumAPI(artist_name, albumName);
      if (!apiInfo) {
        apiInfo = await getAlbumItunesAPI(artist_name, music_name);
      }
      album = await addAlbum(apiInfo);
    }
    return album;
  }
};
//앨범 정보 가져오기
export const listAlbum = async (artist_name, album_name) => {
  //DB에 앨범이 저장 되어 있을 때
  const albumDB = await getAlbumDB(album_name);
  if (albumDB) {
    return responseFromAlbum(albumDB);
  }
  //DB에 앨범이 저장 되어 있지 않을 때
  let apiInfo = await getAlbumAPI(artist_name, album_name);
  const album = await addAlbum(apiInfo);

  return responseFromAlbum(album);
};

//아티스트 정보 가져오기
export const listArtist = async (artist_name) => {
  //DB에 아티스트가 저장 되어 있을 때
  const artistDB = await getArtistDB(artist_name);
  if (artistDB) {
    return responseFromArtist(artistDB);
  }

  //DB에 아티스트가 저장 되어 있지 않을 때
  const apiInfo = await getArtistAPI(artist_name);
  const artist = await addArtist(apiInfo);

  return responseFromArtist(artist);
};

export const listGenre = async () => {
  const genres = await getAllStoreGenres();
  return responseFromGenres(genres);
};

// 검색한 특정 아티스트 정보 가져오기
export const listSpecificArtistInfo = async (user_id, artist_name) => {
  const specificArtist = await getSpecificArtistAPI(artist_name);
  return responseFromSpecificArtist(specificArtist);
};

export const listAllArtistInfo = async (user_id) => {
  const AllArtists = await getallArtistsAPI(user_id);

  return responseFromAllArtists({ AllArtists });
};
