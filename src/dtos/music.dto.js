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

export const responseFromHiddenMusics = (musics) => {
  return musics;
};

export const responseFromGenres = (genres) => {
  // 입력값을 항상 배열로 처리
  const genreArray = Array.isArray(genres) ? genres : [genres];

  return genreArray.map((genre) => ({
    id: genre.id,
    name: genre.name,
    image: genre.image,
  }));
};
