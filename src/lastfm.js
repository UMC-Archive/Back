import { lastfm } from "./auth.config.js";
export const getArtistInfo = (artist_name) => {
  return new Promise((resolve, reject) => {
    lastfm.artist.getInfo({ artist: artist_name }, (err, artist) => {
      if (err) {
        resolve(null);
      } else {
        resolve(artist);
      }
    });
  });
};

export const getAlbumInfo = (artist_name, album_name) => {
  return new Promise((resolve, reject) => {
    lastfm.album.getInfo(
      { artist: artist_name, album: album_name },
      (err, album) => {
        if (err) {
          resolve(null);
        } else {
          resolve(album);
        }
      }
    );
  });
};

export const getMusicInfo = (artist_name, music_name) => {
  return new Promise((resolve, reject) => {
    lastfm.track.getInfo(
      { artist: artist_name, track: music_name },
      (err, music) => {
        if (err) {
          resolve(null);
        } else {
          resolve(music);
        }
      }
    );
  });
};
export const getArtistSearch = (artist_name) => {
  return new Promise((resolve, reject) => {
    lastfm.track.search({ track: artist_name }, (err, music) => {
      if (err) {
        resolve(null);
      } else {
        resolve(music);
      }
    });
  });
};
export const getAlbumSearch = (album_name) => {
  return new Promise((resolve, reject) => {
    lastfm.track.search({ track: album_name }, (err, music) => {
      if (err) {
        resolve(null);
      } else {
        resolve(music);
      }
    });
  });
};
export const getMusicSearch = (music_name) => {
  return new Promise((resolve, reject) => {
    lastfm.track.search({ track: music_name }, (err, music) => {
      if (err) {
        resolve(null);
      } else {
        resolve(music);
      }
    });
  });
};

// 아티스트 검색
export const searchArtist = async (artist_name) => {
  return new Promise((resolve, reject) => {
    lastfm.artist.search({ artist: artist_name, limit: 1 }, (err, data) => {
      if (err) {
        resolve(null);
      } else {
        const artist = data.artistmatches.artist[0];
        resolve({
          name: artist.name,
          image: artist.image[2]?.["#text"],
        });
      }
    });
  });
};

// 장르 기반 아티스트 검색 (각 10개)
export const getGenreArtist = async (genre) => {
  return new Promise((resolve, reject) => {
    const genreName = genre.name;

    lastfm.tag.getTopArtists({ tag: genreName, limit: 10 }, (err, data) => {
      if (err) {
        resolve(null);
      }
      const artists = data?.artist; // 중간에 topartists 제외해야함
      if (!artists) {
        resolve(null);
        return;
      }

      const results = artists.map((artist) => ({
        name: artist.name,
        image: artist.image?.[2]?.["#text"],
      }));

      resolve(results);
    });
  });
};
