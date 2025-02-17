export const responseFromAllMusics = (musics) => {
  return musics.map((data) => ({
    music: {
      id: data.music.id,
      title: data.music.title,
      releaseTime: new Date(data.music.releaseTime).getFullYear(),
      image: data.music.image,
    },
    album: {
      id: data.music.album.id,
      title: data.music.album.title,
      releaseTime: new Date(data.music.album.releaseTime).getFullYear(),
      image: data.music.album.image,
    },
    artist: data.music.MusicArtists[0].artist.name,
  }));
};

export const responseFromAllArtists = (artists) => {
  return artists.map((data) => {
    const uniqueAlbums = data.artist.MusicArtists.reduce((acc, albumData) => {
      const album = albumData.music.album;

      // album.id가 acc에 존재하지 않으면 추가하고, acc의 길이가 10 미만인 경우에만 추가
      if (!acc.some((item) => item.id === album.id) && acc.length < 10) {
        acc.push({
          id: album.id,
          title: album.title,
          image: album.image,
          releaseTime: new Date(album.releaseTime).getFullYear(),
        });
      }

      return acc;
    }, []); // 초기값은 빈 배열

    return {
      artist: {
        id: data.artist.id,
        name: data.artist.name,
        image: data.artist.image,
      },
      album: uniqueAlbums,
    };
  });
};


export const responseFromAllAlbums = (albums) => {
  console.log("dto albums : " + JSON.stringify(albums, null, 2));
  return albums.map((data) => ({
    id: data.album.id,
    title: data.album.title,
    image: data.album.image,
    artist: data.album.Musics[0].MusicArtists[0].artist.name,
  }));
};
