import {
  getArtistInfo,
  getAlbumInfo,
  getMusicInfo,
  getMusicSearch,
  getArtistSearch,
  getAlbumSearch,
  searchArtist,
  getGenreArtist,
  getSimMusics,
  getPublishedYear,
  getSimArtists,
  getArtistTopTrack,
  getArtistTopAlbum,
  getTrackInfoAPI,
} from "../lastfm.js";
import { getTrackReleaseYear } from "../itunes.js";
import { prisma } from "../db.config.js";
import lrclib from "lrclib-api";
import { billboard } from "../billboard.js";
import { spotify } from "../spotify.js";
import { getAlbumItunes, getAlbumItunesEntity } from "../itunes.js";
import { recommandCuration } from "../middleware/gpt.js";
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
  const AllTitles = values.map((item) =>
    item.title.replace(/\(.*$/i, "").trim()
  );
  const AllArtists = values.map((item) =>
    item.artist.replace(/( featuring| &| and).*$/i, "").trim()
  );
  return {
    AllTitles,
    AllArtists,
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
    return null;
  }
  let image;
  if (albumInfo) {
    image = albumInfo.image[4]["#text"][0]
      ? albumInfo.image[4]["#text"]
      : false;
  }
  const data = {
    title: albumInfo
      ? albumInfo.name
      : albumItunes
      ? albumItunes.collectionName
      : album_name,
    //description: description ? description : albumInfo.wiki ? albumInfo.wiki.summary : "none",
    releaseTime: new Date(
      albumInfo
        ? albumInfo.wiki
          ? albumInfo.wiki.published
          : albumItunes
          ? albumItunes.releaseDate
          : "1970-01-01"
        : "1970-01-01"
    ),
    image: image ? image : albumItunes ? albumItunes.artworkUrl100 : "none",
  };
  return data;
};
export const getAlbumItunesAPI = async (artist_name, music_name) => {
  const albumInfo = await getAlbumItunes(music_name, artist_name);
  //data에서 albumInfo.wiki가 없는 경우가 있음
  if (!albumInfo) return null;

  const data = {
    title: albumInfo.collectionName,
    //description: "none",
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
const getArtistIdsByMusic = async (artist_name, music_name) => {
  const url = await spotify(
    {
      q: `${artist_name}, ${music_name}`,
      type: "tracks",
      offset: "0",
      limit: "1",
      numberOfTopResults: "1",
    },
    "search"
  );
  const ids = url.tracks.items[0].data.artists.items[0].uri.replace(
    "spotify:artist:",
    ""
  );
  return ids;
};
const getArtistIdsByAlbum = async (artist_name, album_name) => {
  // 이상하게 작동함
  const url = await spotify(
    {
      q: `${artist_name}, ${album_name}`,
      type: "albums",
      offset: "0",
      limit: "1",
      numberOfTopResults: "1",
    },
    "search"
  );
  const ids = url.albums.items[0].data.artists.items[0].uri.replace(
    "spotify:artist:",
    ""
  );
  return ids;
};
const getArtistByIds = async (ids) => {
  return await spotify(
    {
      ids: ids,
    },
    "artists"
  );
};
//lastfm에서 정보 가저오기
export const getArtistAPI = async (artist_name, album_name) => {
  album_name = album_name.replace(/\(.*$/, "");
  const artistInfo = await getArtistInfo(artist_name);
  const musicName = await getAlbumInfo(artist_name, album_name);
  const ids = await getArtistIdsByMusic(
    artist_name,
    musicName.tracks.track[0].name
  );
  const image = await getArtistByIds(ids);
  const data = {
    name: artistInfo.name,
    image: image
      ? image.artists[0].images[0].url
      : artistInfo.image[4]["#text"],
  };
  return data;
};

//prisma에 정보 추가하기
export const addArtist = async (artist) => {
  const data = {
    name: artist.name,
    image: artist.image,
  };
  const created = await prisma.artist.create({ data: data });
  return created;
};

export const getSpecificArtistAPI = async (artist_name) => {
  try {
    // 1. DB에서 아티스트 검색
    const existingArtist = await getArtistDB(artist_name);

    if (existingArtist) {
      return existingArtist;
    }

    // 2. DB에 없는 경우 API에서 아티스트 정보 가져오기
    const specificArtist = await searchArtist(artist_name);

    if (!specificArtist) {
      return null;
    }

    // 3. Spotify에서 이미지 URL 가져오기
    const spotifyData = await spotify(
      {
        q: artist_name,
        type: "artists",
        offset: "0",
        limit: "1",
        numberOfTopResults: "1",
      },
      "search"
    );

    const imageUrl =
      spotifyData?.artists?.items[0]?.data?.visuals?.avatarImage?.sources[0]
        ?.url || null;

    // 4. DB에 새 아티스트 추가
    const artistData = {
      name: artist_name,
      image: imageUrl,
      ...specificArtist, // searchArtist에서 가져온 추가 정보가 있다면 포함
    };

    const newArtist = await addArtist(artistData);
    return newArtist;
  } catch (error) {
    console.error(`Error processing artist ${artist_name}:`, error);
    throw error; // 에러를 상위로 전파하여 적절한 에러 처리 가능하도록 함
  }
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
  const allArtists = artistsByGenre.flat().filter((artist) => artist !== null);

  // 각 아티스트 처리
  const processedArtists = await Promise.all(
    allArtists.map(async (artist) => {
      try {
        // DB에서 아티스트 검색
        const existingArtist = await getArtistDB(artist.name);

        if (existingArtist) {
          return existingArtist;
        }

        // DB에 없는 경우 Spotify에서 정보 가져오기
        const spotifyData = await spotify(
          {
            q: artist.name,
            type: "artists",
            offset: "0",
            limit: "1",
            numberOfTopResults: "1",
          },
          "search"
        );

        const imageUrl =
          spotifyData?.artists?.items[0]?.data?.visuals?.avatarImage?.sources[0]
            ?.url || null;

        const newArtist = await addArtist({
          name: artist.name,
          image: imageUrl,
        });

        return newArtist;
      } catch (error) {
        console.error(`Error processing artist ${artist.name}:`, error);
        return {
          name: artist.name,
          image: null,
        };
      }
    })
  );

  const uniqueArtists = Array.from(
    new Map(processedArtists.map((artist) => [artist.name, artist])).values()
  );
  console.log("uniqueArtists", uniqueArtists);

  return uniqueArtists;
};

export const getSimMusicsAPI = async (music_name, artist_name) => {
  let simMusics = await getSimMusics(music_name, artist_name);

  if (!simMusics || simMusics.length === 0) {
    // 유사 음악이 없을 경우
    const simArtist = await getSimArtistsAPI(artist_name); // 유사 아티스트 기반하여 음악 재추천
    const artistTopTrack = await getArtistTopTrack(simArtist.name);
    simMusics = await getSimMusics(artistTopTrack, simArtist.name);
  }

  const tracksWithDates = await Promise.all(
    simMusics.map(async (track) => {
      const releaseYear = await getTrackReleaseYear(track.name, track.artist);
      return {
        ...track,
        releaseYear: releaseYear || getPublishedYear(track.name, track.artist),
      };
    })
  );

  return tracksWithDates;
};

export const getSimArtistsAPI = async (artist_name) => {
  const simArtists = await getSimArtists(artist_name);

  return simArtists;
};

//앨범 큐레이션
//앨범 정보 얻기
export const getMusicByAlbumId = async (album_id) => {
  const music = await prisma.music.findFirst({ where: { albumId: album_id } });
  return music;
};
export const getMusicArtistByMusicId = async (music_id) => {
  const musicArtist = await prisma.musicArtist.findFirst({
    where: { musicId: music_id },
  });
  return musicArtist;
};
export const getAlbumById = async (album_id) => {
  const album = await prisma.album.findFirst({ where: { id: album_id } });
  return album;
};
export const getArtistByAlbum = async (album) => {
  let albumApi = await getAlbumSearch(album.title);
  let artist;
  if (albumApi) {
    artist = albumApi.trackmatches.track[0].artist;
  } else {
    albumApi = await getAlbumItunesEntity(album.title, "", "album");
    artist = albumApi.artistName;
  }
  return artist;
};
//앨범 큐레이션 얻기
export const getAlbumCuration = async (album_id) => {
  const albumCuration = await prisma.albumCuration.findFirst({
    where: { albumId: album_id },
  });
  return albumCuration;
};

//앨범 큐레이션 생성
export const setAlbumCuration = async (album_id, album_name, artist_name) => {
  const description = await recommandCuration(`${artist_name}, ${album_name}`);
  const data = {
    albumId: album_id,
    description: description,
  };
  const created = await prisma.albumCuration.create({ data: data });
  return created;
};
//아티스트 큐레이션
//아티스트 정보 얻기
export const getMusicById = async (music_id) => {
  const music = await prisma.music.findFirst({ where: { id: music_id } });
  return music;
};
export const getMusicArtistByArtistId = async (artist_id) => {
  const musicArtist = await prisma.musicArtist.findFirst({
    where: { artistId: artist_id },
  });
  return musicArtist;
};

export const getArtistById = async (artist_id) => {
  const artist = await prisma.artist.findFirst({ where: { id: artist_id } });
  return artist;
};
//아티스트 큐레이션 얻기
export const getArtistCuration = async (artist_id) => {
  const artistCuration = await prisma.artistCuration.findFirst({
    where: { artistId: artist_id },
  });
  return artistCuration;
};

//아티스트 큐레이션 생성
export const setArtistCuration = async (artist_id, artist_name, music_name) => {
  const description = await recommandCuration(
    `${music_name}를 부른 ${artist_name}`
  );
  const data = {
    artistId: artist_id,
    description: description,
  };
  const created = await prisma.artistCuration.create({ data: data });
  return created;
};

//장르 이미지 가져오기
//장르 얻기
export const getGenreIdByName = async (name) => {
  const genre = await prisma.genre.findFirst({ where: { name: name } });
  return genre;
};
//장르 생성
export const setGenre = async (name) => {
  const data = {
    name: name,
  };
  const genre = await prisma.genre.create({ data: data });
  return genre;
};
//장르 이미지 얻기
export const getGenreImage = async (data) => {
  const genreImage = await prisma.genreImage.findFirst({
    where: { genreId: data.genreId, image: data.image },
  });
  return genreImage;
};
//장르 이미지 생성
export const setGenreImage = async (data) => {
  const genre = await prisma.genreImage.create({ data: data });
  return genre;
};

export const getTrackList = async (album_id) => {
  // 1. 앨범 정보 가져오기
  const album = await prisma.album.findFirst({
    where: { id: album_id },
    select: {
      id: true,
      title: true,
      releaseTime: true,
      image: true,
      Musics: {
        take: 1,
        select: {
          MusicArtists: {
            select: {
              artist: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const album_name = album.title;
  const artist_name = album.Musics[0].MusicArtists[0].artist.name;
  const artist_id = album.Musics[0].MusicArtists[0].artist.id;

  // 2. 해당 앨범의 현재 수록곡 확인
  const dbTracks = await prisma.music.findMany({
    where: { albumId: album_id },
  });

  console.log("dbTracks", dbTracks);

  // API에서 전체 수록곡 목록 가져오기
  const apiTracks = await getTrackInfoAPI(album_name, artist_name);
  if (!apiTracks) {
    return [];
  }

  // DB에 저장된 트랙 수가 API의 트랙 수보다 적을 때만 추가 작업 진행
  if (dbTracks.length < apiTracks.length) {
    for (const apiTrack of apiTracks) {
      // 이미 DB에 있는 트랙인지 확인
      const existingTrack = dbTracks.find(
        (dbTrack) => dbTrack.title === apiTrack.title
      );

      // DB에 없는 트랙만 추가
      if (!existingTrack) {
        let lyrics = await getLyricsAPI(artist_name, apiTrack.title);
        if (!lyrics) {
          lyrics = "none";
        }

        await prisma.music.create({
          data: {
            title: apiTrack.title,
            releaseTime: album.releaseTime,
            lyrics: lyrics,
            image: album.image,
            music: apiTrack.url || "",
            albumId: album.id,
            MusicArtists: {
              create: {
                artistId: artist_id,
              },
            },
          },
        });
      }
    }
  }

  // 최종적으로 DB의 모든 트랙 반환
  return await prisma.music.findMany({
    where: { albumId: album_id },
    select: {
      id: true,
      title: true,
      releaseTime: true,
      MusicArtists: {
        select: {
          artist: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

export const getAlbum = async (album_id) => {
  const album = await prisma.album.findFirst({
    where: { id: album_id },
    select: {
      id: true,
      title: true,
      releaseTime: true,
      image: true,
      Musics: {
        take: 1,
        select: {
          MusicArtists: {
            select: {
              artist: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return album;
};
