import { response } from "../../config/response.js";
import { prisma } from "../db.config.js";
import { status } from "../../config/response.status.js";

//보관함에서 음악 삭제
export const deleteMusicLibraryRepo = async (userId, musicId) => {
  try {
    let library = await prisma.library.findFirst({
      where: { userId: userId },
    });
    const existingMusic = await prisma.libraryMusic.findFirst({
      where: {
        libraryId: library.id,
        musicId: musicId,
      },
    });
    if (!existingMusic) {
      return response(status.MUSIC_NOT_LIBRARY, null);
    }
    await prisma.libraryMusic.delete({
      where: { id: existingMusic.id }
    })

    return response(status.SUCCESS, null);
  } catch (err) {
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함에서 앨범 삭제
export const deleteAlbumLibraryRepo = async (userId, albumId) => {
  try {
    let library = await prisma.library.findFirst({
      where: { userId: userId },
    });
    const existingAlbum = await prisma.libraryAlbum.findFirst({
      where: {
        libraryId: library.id,
        albumId: albumId,
      },
    });
    //console.log(existingAlbum);

    if (!existingAlbum) {
      return response(status.ALBUM_NOT_LIBRARY, null);
    }

    await prisma.libraryAlbum.delete({
      where: { id: existingAlbum.id },
    });
    return response(status.SUCCESS, null);
  } catch (err) {
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함에서 아티스트 삭제
export const deleteArtistLibraryRepo = async (userId, artistId) => {
  try {
    let library = await prisma.library.findFirst({
      where: { userId: userId },
    });
    const existingArtist = await prisma.libraryArtist.findFirst({
      where: {
        libraryId: library.id,
        artistId: artistId,
      },
    });
    //console.log(existingArtist);

    if (!existingArtist) {
      return response(status.ARTIST_NOT_LIBRARY, null);
    }

    await prisma.libraryArtist.delete({
      where: { id: existingArtist.id },
    });

    return response(status.SUCCESS, null);
  } catch (err) {
    return response(status.INTERNAL_SERVER_ERROR, null)
  }
}

//보관함에 음악 추가
export const addMusicLibraryRepo = async (userId, musicId) => {
  try {
    let library = await prisma.library.findFirst({
      where: { userId: userId },
    });
    const existingMusic = await prisma.libraryMusic.findFirst({
      where: {
        libraryId: library.id,
        musicId: musicId,
      },
    });
    if (existingMusic) {
      return response(status.MUSIC_IS_EXIST, null);
    }

    const newMusic = await prisma.libraryMusic.create({
      data: {
        libraryId: library.id,
        musicId: musicId,
      },
    });
    return response(status.SUCCESS, newMusic);
  } catch (err) {
    return response(status.MUSIC_IS_EXIST, null)
  }
}

//보관함에 앨범 추가
export const addAlbumLibraryRepo = async (userId, albumId) => {
  try {
    let library = await prisma.library.findFirst({
      where: { userId: userId },
    });
    //console.log(library);

    const existingAlbum = await prisma.libraryAlbum.findFirst({
      where: {
        libraryId: library.id,
        albumId: albumId,
      },
    });
    //console.log(existingAlbum);

    if (existingAlbum) {
      return response(status.ALBUM_IS_EXIST, null);
    }

    const newAlbum = await prisma.libraryAlbum.create({
      data: {
        libraryId: library.id,
        albumId: albumId,
      },
    });
    //console.log(newAlbum);
    return response(status.SUCCESS, newAlbum);
  } catch (err) {
    console.log(err);
    return response(status.ALBUM_IS_EXIST, null)
  }
}

//보관함에 아티스트 추가
export const addArtistLibraryRepo = async (userId, artistId) => {
  try {
    let library = await prisma.library.findFirst({
      where: { userId: userId },
    });
    //console.log(library);

    const existingArtist = await prisma.libraryArtist.findFirst({
      where: {
        libraryId: library.id,
        artistId: artistId,
      },
    });
    //console.log(existingArtist);

    if (existingArtist) {
      return response(status.ARTIST_IS_EXIST, null);
    }

    const newArtist = await prisma.libraryArtist.create({
      data: {
        libraryId: library.id,
        artistId: artistId,
      },
    });
    //console.log(newArtist);
    return response(status.SUCCESS, newArtist);
  } catch (err) {
    console.log(err);
    return response(status.ARTIST_IS_EXIST, null)
  }
}

export const getLibraryMusics = async (userId) => {
  try {
    const library = await prisma.library.findFirst({
      where: { userId: userId },
    });

    if (!library) {
      return null;
    }

    const musics = await prisma.libraryMusic.findMany({
      where: {
        libraryId: library.id,
      },
      select: {
        music: {
          select: {
            id: true,
            title: true,
            releaseTime: true,
            image: true,
            album: {
              select: {
                id: true,
                title: true,
                image: true,
                releaseTime: true,
              }
            },
            MusicArtists: {
              select: {
                artist: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!musics) {
      return null;
    }

    return musics;
  } catch (err) {
    next(err);
  }
};

export const getLibraryArtists = async (userId) => {
  try {
    const library = await prisma.library.findFirst({
      where: { userId: userId },
    });

    if (!library) {
      return null;
    }

    const artists = await prisma.libraryArtist.findMany({
      where: {
        libraryId: library.id,
      },
      select: {
        artist: {
          select: {
            id: true,
            name: true,
            image: true,
            MusicArtists: {
              select: {
                music: {
                  select: {
                    album: {
                      select: {
                        id: true,
                        title: true,
                        image: true,
                        releaseTime: true,
                      }
                    }
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!artists) {
      return null;
    }

    return artists;
  } catch (err) {
    next(err);
  }
};

export const getLibraryAlbums = async (userId) => {
  try {
    const library = await prisma.library.findFirst({
      where: { userId: userId },
    });
    //console.log("library : " + JSON.stringify(library, null, 2));

    if (!library) {
      return null;
    }

    const albums = await prisma.libraryAlbum.findMany({
      where: { libraryId: library.id },
      select: {
        album: {
          select: {
            id: true,
            title: true,
            image: true,
            Musics: {
              select: {
                MusicArtists: {
                  select: {
                    artist: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!albums) {
      return null;
    }

    return albums;
  } catch (err) {
    console.log(err);
    next(err);
  }
};
