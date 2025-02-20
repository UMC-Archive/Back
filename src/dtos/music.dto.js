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
  return data;
};

export const responseFromSpecificArtist = (artist) => {
  return {
    id: artist.id.toString(),
    name: artist.name,
    image: artist.image,
  };
};

export const responseFromAllArtists = (data) => {
  return data.allArtists.map((artist) => ({
    id: artist.id.toString(),
    name: artist.name,
    image: artist.image,
  }));
};

export const responseFromAlbumTrackList = (data) => {
  return {
    album: {
      id: data.albumInfo.id.toString(),
      title: data.albumInfo.title,
      image: data.albumInfo.image,
      artistId: data.artist.id,
      artist: data.albumInfo.Musics[0].MusicArtists[0].artist.name,
      artistImage: data.artist.image,
      releaseTime: new Date(data.albumInfo.releaseTime).getFullYear(),
      totalDuration: data.roundedMinutes,
      trackCount: data.count,
    },
    tracks: data.tracks.map((track) => ({
      id: track.id,
      title: track.title,
      artist: track.MusicArtists[0].artist.name,
      image: data.albumInfo.image,
      releaseTime: new Date(track.releaseTime).getFullYear(),
    })),
  };
};
