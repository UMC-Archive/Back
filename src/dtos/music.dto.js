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
