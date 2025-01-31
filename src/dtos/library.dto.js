export const responseFromAllMusics = (musics) => {
  return musics.map((data) => ({
    title: data.music.title,
    releaseTime: new Date(data.music.releaseTime).getFullYear(),
    image: data.music.image,
    artist: data.music.MusicArtists[0].artist.name,
  }));
};
