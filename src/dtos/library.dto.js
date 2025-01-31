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

export const responseFromAllAlbums = (albums) => {
  console.log("dto albums : " + JSON.stringify(albums, null, 2));
  return albums.map((data) => ({
    title: data.album.title,
    image: data.album.image,
    artist: data.album.Musics[0].MusicArtists[0].artist.name,
  }));
};
