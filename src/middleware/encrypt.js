import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const encrypt = (req) => {
	const saltRound = process.env.USER_PASS_SALT;
	const salt = bcrypt.genSaltSync(Number(saltRound));

	const hashedCode = bcrypt.hashSync(req, salt);

	return hashedCode;
};