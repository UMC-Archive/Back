import { responseFromUser } from "../dtos/user.dto.js";;
import {
    addUser,
    getUser,
    getUserArtistId,
    setUserArtist,
    getUserGenreId,
    setUserGenre,
    findEmail,
    findUser,
} from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import { DuplicateUserEmailError } from "../errors.js";

export const userSignUp = async (data) => {
    const userId = await addUser({
        name: data.name,
        nickname: data.nickname,
        email: data.email,
        password: data.password,
        profileImage: data.profileImage,
        status: data.status,
        socialType: data.socialType,
        inactiveDate: data.inactiveDate,
    });
    if (userId === null) {
        throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
    }
    for (const artistId of data.artists) {
        const artist = await setUserArtist(userId, artistId);
    }
    for (const genreId of data.genres) {
        const genre = await setUserGenre(userId, genreId);
    }


    const user = await getUser(userId);
    const artists = await getUserArtistId(userId);
    const genres = await getUserGenreId(userId);

    return responseFromUser(
        {
            user,
            artists,
            genres
        });
};

//이메일이 이미 존재하는지 확인하는 메소드
const findEmailAlreadyExists = async (email) => {
	const user = await findEmail(email);
	return user;
};

export const userLogin = async (req) => {
	if (await findEmailAlreadyExists(req.email)) {
		const user = await findUser(req.email);

		if (bcrypt.compareSync(req.password, user.password)) {
			// if password correct - success
			user.password = "hidden";
			return createJwt(user);
		} else {
			// if password doesn't correct - fail
			console.log("password incorrect");
			return 2;
		}
	} else {
		// if email doesn't exists - fail
		console.log("email doesn't exists");
		return 1;
	}
};