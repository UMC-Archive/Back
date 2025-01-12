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

// finding user by email
export const findEmail = async (req) => {
    const email = await prisma.user.findFirst({
        select: {email : true},
        where: {email: req}
    });
    if (email === null) {
        console.log("email null");
        return null;
    } else {
        console.log(email[0][0].email);
        return email;
    }
};
// 유저 정보 불러오는 기능
export const userInfoRep = async (userId) => {
    const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
    return user;
};

//유저의 프로필 이미지 변경
export const changeImageRep = async (data) => {
    console.log("bodyRep:", data)
    try {
        // 1. name과 email로 회원 존재 여부 확인
        const existingUser = await prisma.user.findFirst({
            where: {
                name: data.name,
                email: data.email,
            },
        });
    
        if (!existingUser) {
            throw new Error("해당 이름과 이메일로 등록된 사용자가 없습니다.");
        }
    
        // 2. 프로필 정보 업데이트
        const updatedUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                profileImage : data.profileImage,
                updatedAt: new Date(), // Prisma가 자동으로 처리 가능
            },
        });
    
        // 3. 업데이트된 회원 정보 반환
        return updatedUser;
        } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};