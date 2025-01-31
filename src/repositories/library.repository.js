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
