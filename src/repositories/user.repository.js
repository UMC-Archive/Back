import { prisma } from "../db.config.js";
export const addUser = async (data) => {
    const user = await prisma.user.findFirst({ where: { email: data.email } });
    if (user) {
        return null;
    }
    const created = await prisma.user.create({ data: data });
    return created.id;
};

export const getUser = async (userId) => {
    const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
    return user;
};

export const setUserArtist = async (userId, artistId) => {
    const artist = await prisma.artist.findFirst({ where: { id: artistId } });
    if (!artist) {
        return null;
    }
    await prisma.userArtist.create({
        data: {
            userId: userId,
            artistId: artistId
        }
    })
}

export const getUserArtistId = async (userId) => {
    const preferences = await prisma.userArtist.findMany({
        select: {
            id: true,
            userId: true,
            user: true,
            artistId: true,
            artist: true,
        },
        where: { userId: userId },
        orderBy: { artistId: "asc" }
    });
    return preferences;
};

export const setUserGenre = async (userId, genreId) => {
    const genre = await prisma.genre.findFirst({ where: { id: genreId } });
    if (!genre) {
        return null;
    }
    await prisma.userGenre.create({
        data: {
            userId: userId,
            genreId: genreId
        }
    })
}

export const getUserGenreId = async (userId) => {
    const preferences = await prisma.userGenre.findMany({
        select: {
            id: true,
            userId: true,
            user: true,
            genreId: true,
            genre: true,
        },
        where: { userId: userId },
        orderBy: { genreId: "asc" }
    });
    return preferences;
};

export const userInfoRep = async (userId) => {
    const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
    return user;
};