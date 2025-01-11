import { responseFromUser } from "../dtos/user.dto.js";;
import {
    addUser,
    getUser,
    getUserArtistId,
    setUserArtist,
    getUserGenreId,
    setUserGenre,
    findEmail
} from "../repositories/user.repository.js";
import { DuplicateUserEmailError } from "../errors.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

import mailSender from "../middleware/email.js";
import {encrypt} from "../middleware/encrypt.js";

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

//인증번호 전송 service
export const sendVerificationCode = async (req) => {
	if (await findEmailAlreadyExists(req)) {
		// logic of already exists
		console.log("exists");
		return null;
	} else {
		// logic of doesn't exists
		console.log("doesn't exists");

		// 이메일 인증코드 난수 생성
		const randomNumber = Math.floor(Math.random() * 1000000);
		mailSender.sendGmail(req, randomNumber.toString().padStart(6, "0"));

		// 인증코드 암호화
		const hashedCode = encrypt(randomNumber.toString().padStart(6, "0"));

		return hashedCode;
	}
};

const findEmailAlreadyExists = async (email) => {
	const user = await findEmail(email);
	return user;
};

//인증번호 확인 service
export const checkVerificationCode = async (req) => {
	const code = req.code;

	return bcrypt.compareSync(code.toString(), req.cipherCode);
};
