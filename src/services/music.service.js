import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import {
  responseFromArtist,
  responseFromAlbum,
  responseFromMusic,
  responseFromHiddenMusics,
  responseFromSpecificArtist,
  responseFromAllArtists,
  responseFromAlbumTrackList,
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
  getAlbumSpotifyApi,
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
  getMusicByAlbumId,
  getMusicArtistByMusicId,
  getMusicArtistByArtistId,
  getMusicArtistByMusicIdArtistId,
  getMusicById,
  getTrackList,
  getAlbum,
  getUserMusicsByUserId,
} from "../repositories/music.repository.js";
import { recommandArtist } from "../middleware/gpt.js";
import { getGenrePngFiles } from "../repositories/s3.repository.js";
import {
  getArtistTopAlbum,
  getArtistTopTrack,
  getAlbumInfo,
  getMusicInfo,
  getSimilarArtistsBymbid,
  getArtistTopAlbumsBymbid,
  getArtistTopAlbums,
  getArtistTopMusicsBymbid,
} from "../lastfm.js";

// gpt api에서 선호 아티스트 배열로 집어넣기
const listRecommandArtist = async (user_history, preferArtists) => {
  let artists = [];
  const invalidArtists = [
    "Artist 1 Name",
    "object Object",
    "Object1 Artist",
    "Similar Artist 1",
    "artist1",
    "Artist's Name",
    "Error",
    "[object Object]",
    "invalid data",
    "[artist1]",
    "object1",
  ];

  for (const prefer of preferArtists) {
    let recommend = await recommandArtist(`${user_history}, ${prefer}`);

    // AI 에러 값 검출
    while (invalidArtists.includes(recommend[0]) || !recommend[2]) {
      recommend = await recommandArtist(`${user_history} ${prefer}`);
    }

    artists.push(...recommend);
  }
  return artists;
};
//추천곡 (연도)
export const listNominationMusic = async (user_id) => {
  // 유저 정보 값 가져오기
  const preferArtists = await getUserArtistPrefers(user_id);
  const userHistory = await getUserHistory(user_id);

  // 함수 스코프로 사용될 값
  let recommendedMusics = [];

  const artists = await listRecommandArtist(userHistory, preferArtists);

  // 아티스트로 검색
  for (const num in artists) {
    // Top Album 가져오기 (Top Track으로 하였을 때 안나오는 경우가 있음)
    const albums = await getArtistTopAlbums(artists[num], 4);
    for (let album of albums?.album) {
      // 검증된 앨범 값 검색하여 음악 찾기
      if (album?.name && album?.name !== "(null)") {
        const albumName = album?.name;
        const api = await getAlbumInfo(artists[num], albumName);
        if (api?.tracks?.track[0]?.name) {
          const musicName = api.tracks.track[0].name;
          const all = await listAll(artists[num], albumName, musicName);
          recommendedMusics.push({
            music: all.music,
            album: all.album,
            artist: all.artist.name,
          });
        }
      }
    }
  }
  return recommendedMusics;
};
//당신을 위한 앨범 추천(연도)
export const listNominationAlbum = async (user_id) => {
  // 유저 정보 값 가져오기
  const preferArtists = await getUserArtistPrefers(user_id);
  const userHistory = await getUserHistory(user_id);

  // 함수 스코프로 사용될 값
  let recommendedAlbums = [];

  const artists = await listRecommandArtist(userHistory, preferArtists);
  // 아티스트로 검색
  for (const num in artists) {
    // Top Album 가져오기 (Top Track으로 하였을 때 안나오는 경우가 있음)
    const albums = await getArtistTopAlbums(artists[num], 4);
    for (let album of albums?.album) {
      // 검증된 앨범 값 검색하여 음악 찾기
      if (album?.name && album?.name !== "(null)") {
        const albumName = album?.name;
        const api = await getAlbumInfo(artists[num], albumName);
        if (api?.tracks?.track[0]?.name) {
          const musicName = api.tracks.track[0].name;
          const all = await listAll(artists[num], albumName, musicName);
          recommendedAlbums.push({
            album: all.album,
            artist: all.artist.name,
          });
        }
      }
    }
  }
  return recommendedAlbums;
};

//숨겨진 명곡
export const listHiddenMusics = async (user_id) => {
  const dates = await getUserHistory(user_id);
  const date = dates[0]?.history?.toISOString().split("T")[0];
  const first = 80;
  const last = 100;
  const billboardApi = await getBillboardAPI(date, first, last);
  const billboard = await extractBillboard(billboardApi);

  let hiddenMusics = [];
  for (let i = 0; i < last - first + 1; i++) {
    const album = await getAlbumSpotifyApi(
      billboard.artists[i],
      billboard.titles[i]
    );
    const albumApi = await getAlbumInfo(billboard.artists[i], album);
    const musicApi = await getMusicInfo(billboard.artists[i], billboard.titles[i]);
    if (albumApi?.tracks?.track[0]?.name && musicApi?.name) {
      const artistName = albumApi.artist === musicApi.artist.name ? albumApi.artist : null;
      const albumName = albumApi.name;
      const musicName = musicApi?.name;
      const all = await listAll(artistName, albumName, musicName);
      hiddenMusics.push({
        music: all.music,
        album: all.album,
        artist: all.artist.name,
      });
    }
  }
  return responseFromHiddenMusics(hiddenMusics);
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
  let album = await listAlbumSearch(music_name, artist_name);
  //아티스트 정보
  const artist = await listArtistOnly(artist_name, album.title);

  //음악 가사 정보
  let lyrics = await getLyricsAPI(artist_name, music_name);
  //가사를 불러 올 수 없을 때가 존재함, 추후에 다른 api를 찾으면 none 대신 다른 api를 통해 찾기로 변경
  if (!lyrics) {
    lyrics = "none";
  }
  //음악 정보
  const apiInfo = await getMusicAPI(album, lyrics, artist_name, music_name);
  const music = await addMusic(apiInfo);
  if (artist && music) await addMusicArtist(artist, music);
  return responseFromMusic(music);
};
// 앨범 정보 검색하기
const listAlbumSearch = async (music_name, artist_name) => {
  const music = await getMusicDB(music_name);
  if (music) {
    const album = await getAlbumById(music.albumId);
    if (album) {
      return album;
    }
  }
  const spotifyAlbums = await getAlbumSpotifyApi(music_name, artist_name);
  const albumApi = await getAlbumInfo(artist_name, spotifyAlbums)
  if (!albumApi?.tracks?.track) {
    return null;
  }
  const album = await listAlbum(artist_name, albumApi.name);
  return album;
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
  const artist = await listArtistOnly(artist_name, album_name);
  return responseFromAlbum(album);
};

//아티스트 정보 가져오기
const listArtistOnly = async (artist_name, album_name) => {
  //DB에 아티스트가 저장 되어 있을 때
  const artistDB = await getArtistDB(artist_name);
  if (artistDB) {
    return responseFromArtist(artistDB);
  }
  //DB에 아티스트가 저장 되어 있지 않을 때
  const apiInfo = await getArtistAPI(artist_name, album_name);
  const artist = await addArtist(apiInfo);

  return responseFromArtist(artist);
};
export const listArtist = async (artist_name, album_name) => {
  const artistDB = await getArtistDB(artist_name);
  if (artistDB) {
    return responseFromArtist(artistDB);
  }
  const artist = await listArtistOnly(artist_name, album_name);

  //큐레이션 용
  const albumInfo = await getAlbumInfo(artist_name, album_name);
  if (albumInfo?.tracks?.track[0]) {
    const musicName = albumInfo.tracks.track[0].name;
    const albumName = albumInfo.name;
    const artistName = albumInfo.tracks.track[0].artist.name;
    await listAll(artistName, albumName, musicName);
  }

  return responseFromArtist(artist);
};

// 검색한 특정 아티스트 정보 가져오기
export const listSpecificArtistInfo = async (artist_name) => {
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

export const listNomMusics = async (user_id) => {
  // 유저 정보 값 가져오기
  const preferArtists = await getUserArtistPrefers(user_id);

  // 함수 스코프로 사용될 값
  let recommendedMusics = [];

  const artists = await listRecommandBasicArtist(preferArtists);

  // 아티스트로 검색
  for (const num in artists) {
    // Top Album 가져오기 (Top Track으로 하였을 때 안나오는 경우가 있음)
    const albumName = await getArtistTopAlbum(artists[num]);
    // 앨범 검색
    const album = await listAlbum(artists[num], albumName);

    // 검증된 앨범 값 검색하여 음악 찾기
    const api = await getAlbumInfo(artists[num], album.title);
    if (api) {
      const musicName = api.tracks.track[0].name;
      recommendedMusics.push({
        music: await listMusic(artists[num], musicName),
        album: album,
        artist: artists[num],
      });
    }
  }
  return recommendedMusics;
};

//앨범 큐레이션
export const albumCuration = async (album_id) => {
  // 앨범 큐레이션이 있는 경우

  let albumCuration = await getAlbumCuration(album_id);
  if (albumCuration) {
    return albumCuration;
  }

  // 앨범 큐레이션이 없는 경우
  const album = await getAlbumById(album_id);
  const music = await getMusicByAlbumId(album_id);

  if (music) {
    const musicArtist = await getMusicArtistByMusicId(music.id);
    const artist = await getArtistById(musicArtist.artistId);
    albumCuration = await setAlbumCuration(album_id, album.title, artist.name);
  } else {
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
  const artistMusic = await getMusicArtistByArtistId(artist_id);
  const music = await getMusicById(artistMusic.musicId);
  console.log(artist.name, music.title);
  artistCuration = await setArtistCuration(artist_id, artist.name, music.title);
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

const listRecommandBasicArtist = async (preferArtists) => {
  let artists = [];
  const invalidArtists = [
    "Artist 1 Name",
    "object Object",
    "Object1 Artist",
    "Similar Artist 1",
    "artist1",
    "Artist's Name",
    "Error",
    "[object Object]",
    "invalid data",
    "[artist1]",
    "object1",
  ];

  for (const prefer of preferArtists) {
    let recommend = await recommandArtist(`${prefer}`);

    // AI 에러 값 검출
    while (invalidArtists.includes(recommend[0]) || !recommend[2]) {
      recommend = await recommandArtist(`${prefer}`);
    }

    artists.push(...recommend);
  }
  return artists;
};

export const listNomAlbums = async (user_id) => {
  const preferArtists = await getUserArtistPrefers(user_id);

  // 함수 스코프로 사용될 값
  let recommendedAlbums = [];
  let artists = [];

  // gpt api에서 선호 아티스트 배열로 집어넣기
  for (const prefer of preferArtists) {
    const recommend = await recommandArtist(`${prefer}`);
    artists.push(...recommend);
  }

  // 아티스트로 검색
  for (const num in artists) {
    // Top Album 가져오기
    const albumName = await getArtistTopAlbum(artists[num]);
    // 앨범 검색
    recommendedAlbums.push({
      album: await listAlbum(artists[num], albumName),
      artist: artists[num],
    });
  }
  return recommendedAlbums;
};

export const listAlbumTrackList = async (album_id) => {
  const album_info = await getAlbum(album_id);
  if (!album_info) {
    return response(status.ALBUM_NOT_EXIST, null);
  }
  const { roundedMinutes, count, tracks } = await getTrackList(album_id);

  const artist = await getSpecificArtistAPI(album_info.artist);

  if (!tracks || tracks.length === 0) {
    return response(status.MUSIC_NOT_EXIST, null);
  }

  return response(
    status.SUCCESS,
    responseFromAlbumTrackList({
      album_info,
      tracks,
      artist,
      roundedMinutes,
      count,
    })
  );
};

const listAll = async (artist_name, album_name, music_name) => {
  let artist = await getArtistDB(artist_name);
  if (!artist) {
    const data = await getArtistAPI(artist_name, album_name);
    artist = await addArtist(data);
  }

  let album = await getAlbumDB(album_name);
  if (!album) {
    const data = await getAlbumAPI(artist_name, album_name);
    album = await addAlbum(data);
  }

  let music = await getMusicDB(music_name);
  if (!music) {
    let lyrics = await getLyricsAPI(artist_name, music_name);
    if (!lyrics) {
      lyrics = "none";
    }
    const data = await getMusicAPI(album, lyrics, artist_name, music_name);
    music = await addMusic(data);
  }
  let musicArtist = await getMusicArtistByMusicIdArtistId(music.id, artist.id);
  if (!musicArtist) {
    musicArtist = await addMusicArtist(artist, music);
  }
  return {
    music,
    album,
    artist,
  };
};

export const listSimilarArtists = async (artistId) => {
  const artist = await getArtistById(artistId);
  const musicArtist = await getMusicArtistByArtistId(artistId);
  const music = await getMusicById(musicArtist.musicId);
  const musicInfo = await getMusicInfo(artist.name, music.title);
  const similar = await getSimilarArtistsBymbid(
    artist.name,
    musicInfo?.artist?.mbid
  );
  let similars = [];
  for (let i = 0; i < 5; i++) {
    const artist = similar[i].name;
    const mbid = similar[i].mbid;
    const album = await getArtistTopAlbumsBymbid(artist, mbid);
    const info = await getAlbumInfo(
      artist,
      album?.album[0].name !== "(null)"
        ? album?.album[0].name
        : album?.album[1].name
    );

    if (info?.tracks?.track[0]?.name) {
      similars.push({
        artist,
        album: info.name,
        music: info.tracks.track[0].name,
      });
    }
  }
  let artistAlbums = [];
  for (let sim in similars) {
    const all = await listAll(
      similars[sim].artist,
      similars[sim].album,
      similars[sim].music
    );
    artistAlbums.push({
      album: all.album,
      artist: all.artist,
    });
  }
  return artistAlbums;
};

export const listDifferentAlbum = async (artistId, albumId) => {
  const artist = await getArtistById(artistId);
  const album = await getAlbumById(albumId);
  const api = await getAlbumInfo(artist.name, album.title);
  const ambid = api?.tracks?.track[0]?.artist?.mbid;
  const mbid = ambid !== "" ? ambid : null;
  const albumsApi = await getArtistTopAlbumsBymbid(artist.name, mbid);
  const albums = [];

  for (let i = 0; i < 10; i++) {
    const albumName = albumsApi?.album[i]?.name;
    if (albumName && albumName != album.title) {
      const info = await getAlbumInfo(artist.name, albumName);
      if (info?.tracks?.track[0]?.name) {
        const all = await listAll(
          artist.name,
          info.name,
          info.tracks.track[0].name
        );
        albums.push(all.album);
      }
    }
  }
  return albums;
};

//정보 불러오기
export const findMusic = async (musicName) => {
  if (musicName) {
    const music = await getMusicDB(musicName);
    if (music) {
      return { name: true, value: true, info: music };
    }
    return { name: true, value: false, info: {} };
  }
  return { name: false, value: false, info: {} };
};

export const findAlbum = async (albumName) => {
  if (albumName) {
    const album = await getAlbumDB(albumName);
    if (album) {
      return { name: true, value: true, info: album };
    }
    return { name: true, value: false, info: {} };
  }
  return { name: false, value: false, info: {} };
};

export const findArtist = async (artistName) => {
  if (artistName) {
    const artist = await getArtistDB(artistName);
    if (artist) {
      return { name: true, value: true, info: artist };
    }
    return { name: true, value: false, info: {} };
  }
  return { name: false, value: false, info: {} };
};

//빠른 선곡
const getMusicStatistics = (userMusics) => {
  const stats = {};

  // userMusics 배열을 순회하면서 musicId별로 개수를 세는 방식
  userMusics.forEach((music) => {
    const { musicId } = music;

    if (stats[musicId]) {
      stats[musicId] += 1; // 이미 있으면 카운트를 증가
    } else {
      stats[musicId] = 1; // 처음 나온 음악이면 1로 초기화
    }
  });

  return stats;
};
export const listSelectionMusic = async (user_id) => {
  // 유저 정보 값 가져오기
  const preferArtists = await getUserArtistPrefers(user_id);

  // 함수 스코프로 사용될 값
  let recommendedMusics = [];

  const artists = await listRecommandBasicArtist(preferArtists);

  // 아티스트로 검색
  for (const num in artists) {
    // Top Album 가져오기 (Top Track으로 하였을 때 안나오는 경우가 있음)
    const albums = await getArtistTopAlbums(artists[num], 4);
    for (let album of albums?.album) {
      // 검증된 앨범 값 검색하여 음악 찾기
      if (album?.name && album?.name !== "(null)") {
        const albumName = album?.name;
        const api = await getAlbumInfo(artists[num], albumName);
        if (api?.tracks?.track[0]?.name) {
          const musicName = api.tracks.track[0].name;
          const all = await listAll(artists[num], albumName, musicName);
          recommendedMusics.push({
            music: all.music,
            album: all.album,
            artist: all.artist.name,
          });
        }
      }
    }
  }
  const userMusics = await getUserMusicsByUserId(user_id);
  const stat = getMusicStatistics(userMusics);

  return recommendedMusics.sort((a, b) => {
    const idA = a.music.id;
    const idB = b.music.id;

    // stat[id] 값이 존재하지 않으면 기본값을 0으로 처리
    const statA = stat[idA] || 0;
    const statB = stat[idB] || 0;

    // 값이 큰 순으로 내림차순 정렬
    return statB - statA;
  });
};

// 아티스트의 가장 인기있는 곡 불러오는 service
export const listTopMusicArtists = async (artistId) => {
  const artist = await getArtistById(artistId);
  const musicArtist = await getMusicArtistByArtistId(artistId);
  const music = await getMusicById(musicArtist.musicId);
  const musicInfo = await getMusicInfo(artist.name, music.title);
  const tops = await getArtistTopMusicsBymbid(artist.name, musicInfo?.artist?.mbid);
  const tracks = tops.track;
  let toplist = [];
  for (let top in tracks) {
    const album = await getAlbumSpotifyApi(
      artist.name,
      tracks[top].name
    );
    const albumApi = await getAlbumInfo(artist.name, album);
    if (albumApi?.tracks?.track[0]?.name) {
      const albumName = albumApi.name;
      const all = await listAll(artist.name, albumName, tracks[top].name);
      toplist.push({
        music: all.music,
        album: all.album,
        artist: all.artist.name,
      });
    }
  }
  return toplist;
};

// 아티스트의 가장 인기있는 앨범 불러오는 service
export const listTopAlbumArtists = async (artistId) => {
  const artist = await getArtistById(artistId);
  const musicArtist = await getMusicArtistByArtistId(artistId);
  const music = await getMusicById(musicArtist.musicId);
  const musicInfo = await getMusicInfo(artist.name, music.title);
  const tops = await getArtistTopAlbumsBymbid(artist.name, musicInfo?.artist?.mbid);
  const albums = tops.album;
  let toplist = [];

  for (let top in albums) {
    const albumName = albums[top].name;
    if (albumName) {
      const info = await getAlbumInfo(artist.name, albumName);
      if (info?.tracks?.track[0]?.name) {
        const all = await listAll(
          artist.name,
          info.name,
          info.tracks.track[0].name
        );
        toplist.push(all.album);
      }
    }
  }
  return toplist;
};
