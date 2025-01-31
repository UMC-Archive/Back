import { prisma } from "../db.config.js";

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
    console.log("library : " + JSON.stringify(library, null, 2));
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
            name: true,
            image: true,
          },
        },
      },
    });

    console.log("artists : " + JSON.stringify(artists, null, 2));
    if (!artists) {
      return null;
    }

    return artists;
  } catch (err) {
    console.log(err);
    next(err);
  }
};
