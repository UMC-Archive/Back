import {
  getArtistInfo,
  getAlbumInfo,
  getMusicInfo,
  getMusicSearch,
  getAlbumSearch,
  searchArtist,
  getGenreArtist,
} from "../lastfm.js";
import { prisma } from "../db.config.js";
import lrclib from "lrclib-api";
import { billboard } from "../billboard.js";
import { getAlbumItunes, getAlbumItunesEntity } from "../itunes.js";
import { recommandCuration } from "../middleware/gpt.js"
//당신을 위한 앨범 추천(연도)
export const getUserHistory = async (user_id) => {
  const userHistory = prisma.timeHistory.findMany({
    where: { userId: user_id },
    orderBy: { createdAt: "desc" },
  });
  return userHistory;
};
export const getUserArtistPrefers = async (user_id) => {
  const userArtist = prisma.userArtist.findMany({
    select: { artist: true },
    where: { userId: user_id },
    orderBy: { createdAt: "asc" },
    take: 3,
  });
  return userArtist;
};
//숨겨진 명곡
export const getBillboardAPI = async (date) => {
  const result = await billboard("hot-100", date, "1-10");
  return result.content;
  //return result.content
};
export const extractBillboard = async (billboard) => {
  const values = Object.values(billboard).slice(0, 10);
  const titles = values.map((item) => item.title.replace(/\(.*$/i, "").trim());
  const artists = values.map((item) =>
    item.artist.replace(/( featuring| &| and).*$/i, "").trim()
  );
  return {
    titles,
    artists,
  };
};

//음악 정보 가져오기
//prisma에서 정보 가져오기
export const getMusicDB = async (music_name) => {
  const music = await prisma.music.findFirst({ where: { title: music_name } });
  return music;
};

// //itunes에서 앨범 검색 (중복되는 기능)
// export const searchAlbumAPI = async (music_name, artist_name) => {
//   return getAlbumItunes(music_name, artist_name);
// };

export const getLyricsAPI = async (artist_name, music_name) => {
  const lyrics = await lrclib.searchLyrics({
    artist_name: artist_name,
    track_name: music_name,
  });
  if (!lyrics[0]) return null;
  return lyrics[0].syncedLyrics
    ? lyrics[0].syncedLyrics
    : lyrics[0].plainLyrics; //지금은 시간 있는 값으로 불러 와서 바꾸고 싶으면 여기 수정하면 됨
};
export const getMusicAPI = async (album, lyrics, artist_name, music_name) => {
  const music = await getAlbumItunes(music_name, artist_name);
  const musicInfo = await getMusicInfo(artist_name, music_name);
  if (!album) return null;
  const data = {
    albumId: album.id,
    music: music ? music.previewUrl : "",
    title: musicInfo ? musicInfo.name : music_name,
    lyrics: lyrics,
    releaseTime: album.releaseTime,
    image: album.image,
  };
  return data;
};

export const addMusic = async (data) => {
  if (!data) return null;
  const created = await prisma.music.create({ data: data });
  return created;
};

export const addMusicArtist = async (artist, music) => {
  if (!(artist || music)) return null;
  const data = {
    artistId: artist.id,
    musicId: music.id,
  };
  const musicArtist = await prisma.musicArtist.create({ data: data });
  return musicArtist;
};
export const addMusicGenre = async (genre, music) => {
  if (!(genre || music)) return null;
  const data = {
    genreId: genre.id,
    musicId: music.id,
  };
  const musicArtist = await prisma.musicGenre.create({ data: data });
  return musicArtist;
};
//앨범 정보 가져오기
//prisma에서 정보 가져오기
export const getAlbumDB = async (album_name) => {
  const album = await prisma.album.findFirst({ where: { title: album_name } });
  return album;
};

//lastfm에서 정보 가저오기
export const getAlbumAPI = async (artist_name, album_name) => {
  const albumInfo = await getAlbumInfo(artist_name, album_name);
  const albumItunes = await getAlbumItunesEntity(
    album_name,
    artist_name,
    "album"
  );
  //const description = await recommandCuration(`${artist_name} ${album_name}`) //앨범과 큐레이션 분리
  if (!albumInfo && !albumItunes) {
    return null
  }
  let image;
  if (albumInfo) {
    image = albumInfo.image[4]["#text"]
    if (albumInfo == "") {
      image = null;
    }
  }
  const data = {
    title: albumInfo ? albumInfo.name : albumItunes ? albumItunes.collectionName : album_name,
    //description: description ? description : albumInfo.wiki ? albumInfo.wiki.summary : "none",
    releaseTime: new Date(
      albumInfo ? albumInfo.wiki ? albumInfo.wiki.published : albumItunes ? albumItunes.releaseDate : "1970-01-01" : "1970-01-01"
    ),
    image: albumInfo ? image : albumItunes ? albumItunes.artworkUrl100 : "none",
  };
  return data;
};
export const getAlbumItunesAPI = async (artist_name, music_name) => {
  const albumInfo = await getAlbumItunes(music_name, artist_name);
  //data에서 albumInfo.wiki가 없는 경우가 있음
  if (!albumInfo) return null;

  const data = {
    title: albumInfo.collectionName,
    description: "none",
    releaseTime: albumInfo.releaseDate,
    image: albumInfo.artworkUrl100,
  };
  return data;
};

//prisma에 정보 추가하기
export const addAlbum = async (data) => {
  const created = await prisma.album.create({ data: data });
  return created;
};

//아티스트 정보 가져오기
//prisma에서 정보 가져오기
export const getArtistDB = async (artist_name) => {
  const artist = await prisma.artist.findFirst({
    where: { name: artist_name },
  });
  return artist;
};

//lastfm에서 정보 가저오기
export const getArtistAPI = async (artist_name) => {
  const artistInfo = await getArtistInfo(artist_name);
  const data = {
    name: artistInfo.name,
    image: artistInfo.image[4]["#text"],
  };
  return data;
};

//prisma에 정보 추가하기
export const addArtist = async (artist) => {
  const data = {
    name: artist.name,
    image: artist.image,
  }
  const created = await prisma.artist.create({ data: data });
  return created;
};

export const getAllStoreGenres = async () => {
  const genres = await prisma.genre.findMany();
  return genres;
};

export const getSpecificArtistAPI = async (artist_name) => {
  const specificArtist = await searchArtist(artist_name);
  return specificArtist;
};

export const getallArtistsAPI = async (user_id) => {
  const userGenres = await prisma.userGenre.findMany({
    where: { userId: user_id },
    select: { genreId: true },
  });

  if (!userGenres || userGenres.length === 0) {
    return null;
  }

  const genreIds = userGenres.map((ug) => ug.genreId);

  const genreInfos = await prisma.genre.findMany({
    where: {
      id: {
        in: genreIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const artistsPromises = genreInfos.map((genre) => getGenreArtist(genre));
  const artistsByGenre = await Promise.all(artistsPromises);

  // 모든 배열을 하나로 합치기
  const allArtists = artistsByGenre.flat().filter((artist) => artist !== null); // null 값 제거

  // 중복 제거
  const uniqueArtists = Array.from(
    new Map(allArtists.map((artist) => [artist.name, artist])).values()
  );

  return uniqueArtists;
};

//앨범 큐레이션
//앨범 정보 얻기
export const getAlbumById = async (album_id) => {
  const album = await prisma.album.findFirst({ where: { id: album_id } });
  return album;
}
export const getArtistByAlbum = async (album) => {
  let albumApi = await getAlbumSearch(album.title);
  let artist;
  if (albumApi) {
    artist = albumApi.trackmatches.track[0].artist;
  }
  else {
    albumApi = await getAlbumItunesEntity(album.title, "", "album");
    artist = albumApi.artistName
  }
  return artist;
}
//앨범 큐레이션 얻기
export const getAlbumCuration = async (album_id) => {
  const albumCuration = await prisma.albumCuration.findFirst({ where: { albumId: album_id } })
  return albumCuration;
}

//앨범 큐레이션 생성
export const setAlbumCuration = async (album_id, album_name, artistName) => {
  const description = await recommandCuration(`${artistName} ${album_name}`)
  const data = {
    albumId: album_id,
    description: description,
  }
  const created = await prisma.albumCuration.create({ data: data });
  return created;
}
//아티스트 큐레이션
//아티스트 정보 얻기
export const getArtistById = async (artist_id) => {
  const artist = await prisma.artist.findFirst({ where: { id: artist_id } });
  return artist;
}
//아티스트 큐레이션 얻기
export const getArtistCuration = async (artist_id) => {
  const artistCuration = await prisma.artistCuration.findFirst({ where: { artistId: artist_id } })
  return artistCuration;
}

//아티스트 큐레이션 생성
export const setArtistCuration = async (artist_id, artist_name) => {
  const description = await recommandCuration(artist_name)
  const data = {
    artistId: artist_id,
    description: description,
  }
  const created = await prisma.artistCuration.create({ data: data });
  return created;
}