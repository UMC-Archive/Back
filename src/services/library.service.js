import { status } from "../../config/response.status.js";
import { getLibraryMusics } from "../repositories/library.repository.js";
import { responseFromAllMusics } from "../dtos/library.dto.js";
import { response } from "../../config/response.js";

export const listLibraryMusics = async (userId) => {
  try {
    if (!userId) {
      return response(status.LOGIN_ID_NOT_EXIST, null);
    }
    const musics = await getLibraryMusics(userId);

    return response(status.SUCCESS, responseFromAllMusics(musics));
  } catch (err) {
    return response(status.INTERNAL_SERVER_ERROR, null);
  }
};
