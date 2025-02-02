export const bodyToUser = (body) => {
    const inactiveDate = new Date(body.inactiveDate);
    return {
        name: body.name,
        nickname: body.nickname,
        email: body.email,
        password: body.password,
        status: body.status,
        socialType: body.socialType,
        inactiveDate: inactiveDate,
        artists: body.artists,
        genres: body.genres,
    }
};
export const responseFromUser = ({ user, artists, genres, library }) => {
    const artistPreferences = artists.map(
        (performance) => performance.artist.name
    );
    const genrePreferences = genres.map(
        (performance) => performance.genre.name
    );
    return {
        user: user,
        artists: artistPreferences,
        genres: genrePreferences,
        library, library
    }
};

//인증번호 확인 DTO
export const checkVerificationRequestDTO = (req) => {
    return {
        cipherCode: req.cipherCode,
        code: req.code,
    };
};

// 로그인 DTO
export const loginRequestDTO = (req) => {
    return {
        email: req.email,
        password: req.password,
    };
};

// 유저 프로필 파일 변경 DTO
export const bodyToImageDTO = (req) => {
    return {
        name: req.name,
        email: req.email,
        profileImage: req.profileImage,
    };
};

// 유저 장르 변경 DTO
export const bodyToGenreDTO = (uid, req) => {
    return {
        userId: uid.userId,
        genreId: BigInt(req.genreId),
    };
};

// 유저 아티스트 변경 DTO
export const bodyToArtistDTO = (req) => {
    return {
        name: req.name,
        email: req.email,
        artistId: BigInt(req.artistId),
    };
};

// 유저의 음악 재생 시 기록하기
export const bodyToUserMusic = (userId, body) => {
    return {
        userId: userId,
        musicId: body.musicId,
    }
}