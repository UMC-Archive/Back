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

export const responseFromAllArtists = ({ AllArtists }) => {
  return AllArtists.map((artist) => ({
    id: artist.id.toString(),
    name: artist.name,
    image: artist.image,
  }));
};

export const responseFromAlbumTrackList = ({
  album_info,
  tracks,
  artist,
  roundedMinutes,
  count,
}) => {
  return {
    album: {
      id: album_info.id.toString(),
      title: album_info.title,
      image: album_info.image,
      artistId: artist.id,
      artist: album_info.Musics[0].MusicArtists[0].artist.name,
      artistImage: artist.image,
      releaseTime: new Date(album_info.releaseTime).getFullYear(),
      totalDuration: roundedMinutes,
      trackCount: count,
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
