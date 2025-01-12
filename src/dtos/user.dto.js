export const bodyToUser = (body) => {
    const inactiveDate = new Date(body.inactiveDate);
    return {
        name: body.name,
        nickname: body.nickname,
        email: body.email,
        password: body.password,
        profileImage: body.profileImage,
        status: body.status,
        socialType: body.socialType,
        inactiveDate: inactiveDate,
        artists: body.artists,
        genres: body.genres,
    }
};
export const responseFromUser = ({ user, artists, genres }) => {
    const artistPreferences = artists.map(
        (performance) => performance.artist.name
    );
    const genrePreferences = genres.map(
        (performance) => performance.genre.name
    );
    return {
        user: user,
        artist: artistPreferences,
        genre: genrePreferences
    }
};

export const bodyToUserLogin = (body) => {
    return {
		email: body.email,
		password: body.password,
    }
};