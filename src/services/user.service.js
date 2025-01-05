import { responseFromUser } from "../dtos/user.dto.js";;
import {
    addUser,
    getUser
} from "../repositories/user.repository.js";
import { DuplicateUserEmailError } from "../errors.js";

export const userSignUp = async (data) => {
    const UserId = await addUser({
        name: data.name,
        email: data.email,
    });

    if (UserId === null) {
        throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
    }

    const user = await getUser(UserId);
    return responseFromUser(
        {
            user
        });
};