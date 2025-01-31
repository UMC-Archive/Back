export const responseFromAllMusics = (musics) => {
  return musics.map((data) => ({
    title: data.music.title,
    releaseTime: new Date(data.music.releaseTime).getFullYear(),
    image: data.music.image,
    artist: data.music.MusicArtists[0].artist.name,
  }));
};

export const responseFromAllArtists = (artists) => {
  return artists.map((data) => ({
    name: data.artist.name,
    image: data.artist.image,
  }));
};
