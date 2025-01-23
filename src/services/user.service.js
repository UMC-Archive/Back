import { responseFromUser } from "../dtos/user.dto.js";;
import {
    addUser,
    getUser,
    findUser,
    getUserArtistId,
    setUserArtist,
    getUserGenreId,
    setUserGenre,
    findEmail,
    userInfoRep,
    changeImageRep,
    changeGenreRep,
    changeArtistRep,
    setLibrary,
    setUserMusic,
    getUserMusic,
} from "../repositories/user.repository.js";
import { profileUploader } from "../repositories/s3.repository.js"

import { DuplicateUserEmailError, DuplicateUpdateError } from "../errors.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

import mailSender from "../middleware/email.js";
import { encrypt } from "../middleware/encrypt.js";

export const userSignUp = async (data) => {
    data.password = encrypt(data.password);
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
    // 라이브러리 추가
    const library = await setLibrary({ userId });
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
            genres,
            library
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
// 유저 정보 불러오는 service
export const userInfoService = async (userId) => {
    try {
        const userInfo = await userInfoRep(userId);
        return userInfo;
    } catch (err) {
        return next(err);
    }
};

// 로그인 전송 service
export const loginService = async (req) => {
    console.log("loginService 요청 데이터:", req);
    if (await findEmailAlreadyExists(req.email)) {
        // 이메일이 존재하면
        const user = await findUser(req.email);

        if (bcrypt.compareSync(req.password, user.password)) {
            // 성공
            user.password = "hidden";
            //return createJwt(user);
            console.log("로그인 성공");
            return user;
        } else {
            // 실패
            console.log("password incorrect");
            return 2;
        }
    } else {
        // 이메일 x
        console.log("email doesn't exists");
        return 1;
    }
};

// 유저 프로필 이미지 변경 service
export const userChangeImageService = async (req, res, data) => {
    const url = await profileUploader(req, res);
    console.log("bodyService:", data)
    const ChangeImage = await changeImageRep({
        name: data.name,
        email: data.email,
        profileImage: url,
    })
    if (ChangeImage == null) {
        throw new DuplicateUpdateError("입력 된적이 없는 데이터 입니다.", data);
    }
    return ChangeImage;
};

// 유저 장르 변경 service
export const userChangeGenreService = async (data) => {
    console.log("bodyService:", data)
    const ChangeGenre = await changeGenreRep({
        name: data.name,
        email: data.email,
        genreId: data.genreId,
    })
    if (ChangeGenre == null) {
        throw new DuplicateUpdateError("입력 된적이 없는 데이터 입니다.", data);
    }
    return ChangeGenre;
};

// 유저 아티스트 변경 service
export const userChangeArtistService = async (data) => {
    console.log("bodyService:", data)
    const ChangeArtist = await changeArtistRep({
        name: data.name,
        email: data.email,
        artistId: data.artistId,
    })
    if (ChangeArtist == null) {
        throw new DuplicateUpdateError("입력 된적이 없는 데이터 입니다.", data);
    }
    return ChangeArtist;
};

// 유저의 사진을 업로드 하는 api
export const userProfile = async (req, res) => {
    const url = await profileUploader(req, res);
    return url;
}

// 유저의 음악 재생 시 기록하기
export const userPlay = async (data) => {
    const userMusicId = await setUserMusic({
        userId: data.userId,
        musicId: data.musicId,
    });
    const userMusic = await getUserMusic(userMusicId);
    return userMusic;
};