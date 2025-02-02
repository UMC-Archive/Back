import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import {
  responseFromArtist,
  responseFromAlbum,
  responseFromMusic,
  responseFromHiddenMusics,
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
  //searchAlbumAPI,
  getArtistDB,
  getArtistAPI,
  addArtist,
  getAlbumItunesAPI,
  addMusicGenre,
  getUserHistory,
  getUserArtistPrefers,
  getSpecificArtistAPI,
  getallArtistsAPI,
  getSimMusicsAPI,
  getAlbumCuration,
  setAlbumCuration,
  getArtistCuration,
  setArtistCuration,
  getArtistById,
  getAlbumById,
  getArtistByAlbum,
  getGenreIdByName,
  setGenre,
  getGenreImage,
  setGenreImage,
} from "../repositories/music.repository.js";
import { recommandArtist } from "../middleware/gpt.js";
import { getGenrePngFiles } from "../repositories/s3.repository.js";
//추천곡 (연도)
export const listNominationMusic = async (user_id) => {
  const preferArtists = await getUserArtistPrefers(user_id);
  const userHistory = await getUserHistory(user_id);
  let recommendedMusics = [];
  for (const prefer of preferArtists) {
    const artists = await recommandArtist(`${userHistory} ${prefer}`);
    for (const artist of artists) {
      const musics = await getAlbumItunes("", artist);
      if (musics) {
        const musicList = await listMusic(
          artist,
          musics.trackName.split("(")[0]
        );
        recommendedMusics.push({
          music: musicList,
          album: await getAlbumById(musicList.albumId),
          artist: artist,
        });
      }
    }
  }
  if (recommendedMusics.length === 0) return await listNominationMusic(user_id);
  return recommendedMusics;
};
//당신을 위한 앨범 추천(연도)
export const listNominationAlbum = async (user_id) => {
  const preferArtists = await getUserArtistPrefers(user_id);
  const userHistory = await getUserHistory(user_id);
  let recommendedAlbums = [];
  for (const prefer of preferArtists) {
    const artists = await recommandArtist(`${userHistory} ${prefer}`);
    for (const artist of artists) {
      const albums = await getAlbumItunesEntity("", artist, "album");
      if (albums) {
        recommendedAlbums.push({
          album: await listAlbum(artist, albums.collectionName),
          artist: artist,
        });
      }
    }
  }
  if (recommendedAlbums.length === 0) return await listNominationAlbum(user_id);
  return recommendedAlbums;
};

//숨겨진 명곡
export const listHiddenMusics = async (user_id) => {
  const date = await getUserHistory(user_id);
  const billboardTop10 = await getBillboardAPI(
    date[0].history.toISOString().split("T")[0]
  );
  let albums = [];
  const { titles, artists } = await extractBillboard(billboardTop10);
  const musics = await Promise.all(
    artists.map((artist, i) => listMusic(artist, titles[i]))
  );
  for (const music of musics) {
    albums.push(await getAlbumById(music.albumId));
  }
  return responseFromHiddenMusics({
    musics,
    albums,
    artists,
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
  //앨범 정보
  const album = await listAlbumSearch(music_name, artist_name);
  //아티스트 정보
  const artist = await listArtist(artist_name, album.title);
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
  const albumApi = await getAlbumItunesAPI(music_name, artist_name);

  if (albumApi) {
    const albumName = albumApi.title;
    let album = {};
    album = await getAlbumDB(albumName);
    if (!album) {
      let apiInfo = await getAlbumAPI(artist_name, albumName);
      if (apiInfo) {
        album = await addAlbum(apiInfo);
      } else {
        album = await addAlbum(albumApi);
      }
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
  const apiInfo = await getAlbumAPI(artist_name, album_name);
  const album = await addAlbum(apiInfo);
  await listArtist(artist_name, album_name);
  return responseFromAlbum(album);
};

//아티스트 정보 가져오기
export const listArtist = async (artist_name, album_name) => {
  //DB에 아티스트가 저장 되어 있을 때
  const artistDB = await getArtistDB(artist_name);
  if (artistDB) {
    return responseFromArtist(artistDB);
  }

  //DB에 아티스트가 저장 되어 있지 않을 때
  const apiInfo = await getArtistAPI(artist_name, album_name);
  //const description = await recommandCuration(artist_name); // 아티스트와 큐레이션 분리
  const artist = await addArtist(apiInfo);

  return responseFromArtist(artist);
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

export const listNomMusics = async (music_name, artist_name) => {
  const tracks = await getSimMusicsAPI(music_name, artist_name);

  const shuffledTracks = tracks.sort(() => Math.random() - 0.5).slice(1, 11);

  return { shuffledTracks };
};

//앨범 큐레이션
export const albumCuration = async (album_id) => {
  const album = await getAlbumById(album_id);
  const artistName = await getArtistByAlbum(album);
  let albumCuration = await getAlbumCuration(album_id);
  // if (albumCuration) {
  //   return albumCuration;
  // }
  albumCuration = await setAlbumCuration(album_id, album.title, artistName);
  if (!albumCuration) {
    return null;
  }
  return albumCuration;
};
//아티스트 큐레이션
export const artistCuration = async (artist_id) => {
  let artistCuration = await getArtistCuration(artist_id);
  if (artistCuration) {
    return artistCuration;
  }
  const artist = await getArtistById(artist_id);
  if (!artist) {
    return null;
  }
  artistCuration = await setArtistCuration(artist_id, artist.name);
  if (!artistCuration) {
    return null;
  }
  return artistCuration;
};

//장르 이미지 가져오기
export const genreImage = async () => {
  // AWS S3에서 genre/ 값 불러오기
  const genres = await getGenrePngFiles();
  const genreImages = [];

  for (const genre in genres) {
    // 장르 정보 DB에서 찾기
    let genreDB = await getGenreIdByName(genre);

    // DB에 없는 값은 장르 추가
    if (!genreDB) genreDB = await setGenre(genre);
    const randomIndex = Math.floor(Math.random() * 3); // 3개의 사진 중 1개 선택하기 위한 랜덤 값

    // 장르 이미지 값 저장 및 불러오기
    await Promise.all(
      genres[genre].map(async (image, index) => {
        const data = {
          genreId: genreDB.id,
          image: image.url,
        };
        let genreImage = await getGenreImage(data);
        if (!genreImage) genreImage = await setGenreImage(data);
        if (index === randomIndex)
          genreImages.push({
            id: genreDB.id.toString(),
            name: genreDB.name,
            image: genreImage.image,
          }); // 출력 되는 값 지정
      })
    );
  }
  return genreImages;
};
