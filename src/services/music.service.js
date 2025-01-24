import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import {
  responseFromArtist,
  responseFromAlbum,
  responseFromMusic,
  responseFromHiddenMusics,
  responseFromGenres,
  responseFromSpecificArtist,
  responseFromAllArtists,
} from "../dtos/music.dto.js";
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
import { recommandArtist } from "../middleware/gpt.js"
export const listNominationMusic = async (user_id) => {
  const preferArtists = await getUserArtistPrefers(user_id);
  const userHistory = await getUserHistory(user_id);
  let recommendedMusics = [];
  for (const prefer of preferArtists) {
    const artists = await recommandArtist(`${userHistory} ${prefer}`);
    for (const artist of artists) {
      const musics = await getAlbumItunes("", artist);
      if (musics) {
        recommendedMusics.push(
          await listMusic(artist, musics.trackName.split("(")[0])
        );
      }
    }
  }
  return recommendedMusics;
};
export const listNominationAlbum = async (user_id) => {
  const preferArtists = await getUserArtistPrefers(user_id);
  const userHistory = await getUserHistory(user_id);
  let recommendedAlbums = [];
  for (const prefer of preferArtists) {
    const artists = await recommandArtist(`${userHistory} ${prefer}`);
    for (const artist of artists) {
      const albums = await getAlbumItunesEntity("", artist, "album");
      if (albums) {
        recommendedAlbums.push(await listAlbum(artist, albums.collectionName));
      }
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
  try {
    const genres = await getAllStoreGenres();

    if (!genres || genres.length === 0) {
      return response(status.BAD_REQUEST, null);
    }

    return response(status.SUCCESS, responseFromGenres(genres));
  } catch (error) {
    return response(status.INTERNAL_SERVER_ERROR, null);
  }
};

// 검색한 특정 아티스트 정보 가져오기
export const listSpecificArtistInfo = async (user_id, artist_name) => {
  try {
    const specificArtist = await getSpecificArtistAPI(artist_name);
    return response(status.SUCCESS, responseFromSpecificArtist(specificArtist));
  } catch (error) {
    return response(status.INTERNAL_SERVER_ERROR, null);
  }
};

export const listAllArtistInfo = async (user_id) => {
  try {
    const AllArtists = await getallArtistsAPI(user_id);

    if (!AllArtists) {
      return response(status.LOGIN_ID_NOT_EXIST, null);
    }

    return response(status.SUCCESS, responseFromAllArtists({ AllArtists }));
  } catch (error) {
    return response(status.INTERNAL_SERVER_ERROR, null);
  }
};
