//아티스트 정보 가져오기
export const responseFromArtist = (artist) => {
  return artist;
};
//앨범 정보 가져오기
export const responseFromAlbum = (album) => {
  return album;
};
//음악 정보 가져오기
export const responseFromMusic = (music) => {
  return music;
};

export const responseFromHiddenMusics = (data) => {
  const combined = [];
  const length = Math.min(
    data.musics.length,
    data.artists.length,
    data.albums.length
  );
  for (let i = 0; i < length; i++) {
    combined.push({
      music: data.musics[i],
      album: data.albums[i],
      artist: data.artists[i],
    });
  }
  return combined;
};

export const responseFromSpecificArtist = (artist) => {
  return {
    id: artist.id.toString(),
    name: artist.name,
    image: artist.image,
  };
};

export const responseFromAllArtists = ({ AllArtists }) => {
  return {
    artists: AllArtists.map((artist) => ({
      id: artist.id.toString(),
      name: artist.name,
      image: artist.image,
    })),
  };
};

export const responseFromAlbumTrackList = ({ album_info, tracks }) => {
  return {
    album: {
      id: album_info.id.toString(),
      title: album_info.title,
      image: album_info.image,
      artist: album_info.Musics[0].MusicArtists[0].artist.name,
      releaseTime: new Date(album_info.releaseTime).getFullYear(),
    },
    tracks: tracks.map((track) => ({
      id: track.id,
      title: track.title,
      artist: track.MusicArtists[0].artist.name,
      image: album_info.image,
      releaseTime: new Date(track.releaseTime).getFullYear(),
    })),
  };
};
