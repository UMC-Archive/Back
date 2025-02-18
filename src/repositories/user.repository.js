import { prisma } from "../db.config.js";
import { getHistoryImage } from "./s3.repository.js";
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

export const setLibrary = async (userId) => {
  const library = await prisma.library.create({ data: userId });
  return library;
};

export const setUserArtist = async (userId, artistId) => {
  const artist = await prisma.artist.findFirst({ where: { id: artistId } });
  if (!artist) {
    return null;
  }
  await prisma.userArtist.create({
    data: {
      userId: userId,
      artistId: artistId,
    },
  });
};

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
    orderBy: { artistId: "asc" },
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
      genreId: genreId,
    },
  });
};

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
    orderBy: { genreId: "asc" },
  });
  return preferences;
};

// finding user by email
export const findEmail = async (req) => {
  const email = await prisma.user.findFirst({
    select: { email: true },
    where: { email: req },
  });
  if (email === null) {
    return null;
  } else {
    return email;
  }
};
// 유저 정보 불러오는 기능
export const userInfoRep = async (userId) => {
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
  return user;
};

// 유저 찾기
export const findUser = async (email) => {
  // Prisma로 유저 정보 조회
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      email: true, // email만 선택
      password: true, // password도 가져오기
    },
    where: { email },
  });

  if (!user) {
    // 유저가 없을 경우 예외 처리
    console.log("findUser: 유저를 찾을 수 없습니다.");
    throw new Error(`User with email ${email} not found`);
  }

  //console.log("findUser: 조회된 유저 정보:", user);
  return user; // 유저 객체 반환
};

//유저의 프로필 이미지 변경
export const changeImageRep = async (data) => {
  //console.log("bodyRep:", data);
  try {
    // 1. id로 회원 존재 여부 확인
    const existingUser = await prisma.user.findFirst({
      where: {
        id: data.id,
      },
    });

    if (!existingUser) {
      throw new Error("등록된 사용자가 없습니다.");
    }

    // 2. 프로필 정보 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        nickname: data.nickname,
        profileImage: data.profileImage,
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
// 유저의 장르 변경
export const changeGenreRep = async (data) => {
  //console.log("bodyRep:", data);
  try {
    // 1. userId로 회원 존재 여부 확인
    const existingUser = await prisma.user.findFirst({
      where: {
        id: data.userId,
      },
    });

    if (!existingUser) {
      throw new Error("해당 이름과 이메일로 등록된 사용자가 없습니다.");
    }
    //console.log(existingUser);

    //const userId = Number(existingUser.id);

    // 2. userId로 UserGenre의 고유 id 조회
    const existingUserGenre = await prisma.userGenre.findFirst({
      where: { userId: data.userId },
    });

    if (!existingUserGenre) {
      throw new Error("해당 userId로 등록된 UserGenre를 찾을 수 없습니다.");
    }
    //console.log("existingUserGenre:", existingUserGenre);

    // 3. 장르 정보 업데이트
    const updatedUserGenre = await prisma.userGenre.update({
      where: { id: existingUserGenre.id }, // 고유 id를 사용
      data: {
        genreId: BigInt(data.genreId), // BigInt 변환
        updatedAt: new Date(),
      },
    });

    // 4. 업데이트된 회원 정보 반환
    return updatedUserGenre;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

//유저의 아티스트 변경
export const changeArtistRep = async (data) => {
  //console.log("bodyRep:", data);
  try {
    // 1. userId로 회원 존재 여부 확인
    const existingUser = await prisma.user.findFirst({
      where: {
        id: data.userId,
      },
    });

    if (!existingUser) {
      throw new Error("해당 이름과 이메일로 등록된 사용자가 없습니다.");
    }
    //console.log(existingUser);

    //const userId = Number(existingUser.id);

    // 2. userId로 UserArtist의 고유 id 조회
    const existingUserArtist = await prisma.userArtist.findFirst({
      where: { userId: data.userId },
    });

    if (!existingUserArtist) {
      throw new Error("해당 userId로 등록된 UserArtist를 찾을 수 없습니다.");
    }
    //console.log("existingUserArtist:", existingUserArtist);

    // 3. 아티스트 정보 업데이트
    const updatedUserArtist = await prisma.userArtist.update({
      where: { id: existingUserArtist.id }, // 고유 id를 사용
      data: {
        artistId: BigInt(data.artistId), // BigInt 변환
        updatedAt: new Date(),
      },
    });

    // 4. 업데이트된 회원 정보 반환
    return updatedUserArtist;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

// 유저의 음악 재생 시 기록하기
export const setUserMusic = async (data) => {
  const created = await prisma.userMusic.create({ data: data });
  return created.id;
};

export const getUserMusic = async (userMusicId) => {
  const userMusic = await prisma.userMusic.findFirstOrThrow({
    where: { id: userMusicId },
  });
  return userMusic;
};

export const getMusicGenreByMusicId = async (musicId) => {
  const musicGenre = await prisma.musicGenre.findFirst({
    where: { musicId: musicId },
  });
  return musicGenre;
};

export const setMusicGenre = async (data) => {
  const created = await prisma.musicGenre.create({ data: data });
  return created;
};

// 유저의 청취기록 불러오기
export const userPlayInfoRep = async (data) => {
  try {
    // 1. userId로 회원 존재 여부 확인
    const existingUser = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!existingUser) {
      throw new Error("해당 이름으로 등록된 사용자가 없습니다.");
    }

    // 2. 최신 청취 기록만 가져오기 (각 musicId당 가장 최근 기록 1개)
    const userPlay = await prisma.userMusic.findMany({
      where: { userId: data.userId },
      orderBy: [{ musicId: "asc" }, { updatedAt: "desc" }], // musicId별 최신 updatedAt 정렬
      distinct: ["musicId"], // 각 musicId별 가장 최신 1개만 남김
      take: 10, // 최대 10개 제한
      include: {
        music: {
          select: {
            id: true,
            title: true,
            releaseTime: true,
            image: true,
            album: {
              select: {
                id: true,
                title: true,
                releaseTime: true,
                image: true,
              },
            },
            MusicArtists: {
              select: {
                artist: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // 3. 데이터 가공
    const formattedPlayHistory = userPlay.map((play) => ({
      userId: play.userId,
      play: {
        id: play.id,
        createdAt: play.createdAt,
        updatedAt: play.updatedAt,
      },
      music: {
        id: play.musicId,
        title: play.music.title,
        releaseTime: play.music.releaseTime,
        image: play.music.image,
      },
      album: {
        id: play.music.album.id,
        title: play.music.album.title,
        releaseTime: play.music.releaseTime,
        image: play.music.album.image,
      },
      artist: {
        id: play.music.MusicArtists[0]?.artist.id || null,
        name: play.music.MusicArtists[0]?.artist.name || "Unknown Artist",
        image: play.music.MusicArtists[0]?.artist.image || null,
      },
    }));

    return formattedPlayHistory;
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
  }
};
// 유저의 time 히스토리를 추가
export const addHistoryRep = async (data) => {
  //console.log("bodyRep:", data);
  try {
    // 1. userId로 회원 존재 여부 확인
    const existingUser = await prisma.user.findFirst({
      where: {
        id: data.userId,
      },
    });

    if (!existingUser) {
      throw new Error("해당 이름으로 등록된 사용자가 없습니다.");
    }

    // 2. 타임 히스토리 추가
    const addUserHistory = await prisma.timeHistory.create({ data: data });

    // 3. 업데이트된 회원 정보 반환
    return addUserHistory;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

//유저의 time 히스토리를 불러오기
export const userHistoryInfoRep = async (data) => {
  //console.log("bodyRep:", data);
  try {
    // 1. userId로 회원 존재 여부 확인
    const existingUser = await prisma.user.findFirst({
      where: {
        id: data.userId,
      },
    });

    if (!existingUser) {
      throw new Error("해당 이름으로 등록된 사용자가 없습니다.");
    }

    // 2. 타임 히스토리 불러오기
    const userHistories = await prisma.timeHistory.findMany({
      where: { userId: data.userId },
      orderBy: { updatedAt: "desc" }, // 추가된 정렬 옵션
      take: 10, // 최대 10개 제한
    });
    let historys = [];
    for (let userHistory of userHistories) {
      const date = userHistory.history.toISOString().split("T")[0];
      const historyImage = await getHistoryImage(date);
      const data = {
        userHistory,
        historyImage,
      };
      historys.push(data);
    }
    // 3. 업데이트된 회원 정보 반환
    return historys;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

// 유저가 최근에 추가한 노래 리스트
export const addRecentMusicRep = async (userId) => {
  try {
    // 1. userId로 회원 존재 여부 확인
    const library = await prisma.library.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!library) {
      throw new Error("해당 이름으로 등록된 사용자가 없습니다.");
    }

    // 2. 최근 추가한 노래 리스트 불러오기
    const musics = await prisma.libraryMusic.findMany({
      where: {
        libraryId: library.id,
      },
      orderBy: {
        music: { updatedAt: "desc" },
      },
      take: 10, // 최대 10개 제한
      select: {
        music: {
          select: {
            id: true,
            album: {
              select: {
                id: true,
                title: true,
                releaseTime: true,
                image: true,
              },
            },
            title: true,
            releaseTime: true,
            image: true,
            updatedAt: true,
            MusicArtists: {
              select: {
                artist: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!musics) {
      return null;
    }
    // 3. 데이터 형식 변환
    const formattedMusics = musics.map((item) => ({
      music: {
        id: item.music.id,
        title: item.music.title,
        releaseTime: item.music.releaseTime,
        image: item.music.image,
        updatedAt: item.music.updatedAt,
      },
      album: {
        id: item.music.album.id,
        title: item.music.album.title,
        releaseTime: item.music.releaseTime,
        image: item.music.album.image,
      },
      artist: {
        name:
          item.music.MusicArtists.length > 0
            ? item.music.MusicArtists[0].artist.name
            : null,
      },
    }));
    // 3. 정보 반환
    return formattedMusics;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};
export const getUserRecapMusic = async (userId) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const isPeriodFirst = currentMonth < 6;

  let startDate, endDate;

  if (isPeriodFirst) {
    // 상반기
    startDate = new Date(currentYear, 0, 1);
    endDate = new Date(currentYear, 5, 30, 23, 59, 59, 999);
  } else {
    // 하반기
    startDate = new Date(currentYear, 6, 1);
    endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999); // 날짜 정밀 측정
  }

  // 사용자가 가장 많이 들은 음악의 아이디 20개 조회
  const userRecapMusic = await prisma.userMusic.groupBy({
    by: ["musicId"],
    where: {
      userId: userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: {
      musicId: true,
    },
    orderBy: {
      _count: {
        musicId: "desc",
      },
    },
    take: 20,
  });

  const topMusicDetails = await prisma.music.findMany({
    where: {
      id: {
        in: userRecapMusic.map((item) => item.musicId),
      },
    },
    select: {
      id: true,
      title: true,
      image: true,
      releaseTime: true,
      album: {
        select: {
          title: true,
        },
      },
      MusicArtists: {
        select: {
          artist: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const result = topMusicDetails
    .map((music) => {
      const playCount =
        userRecapMusic.find((item) => item.musicId === music.id)?._count
          .musicId ?? 0;
      return {
        id: music.id,
        albumTitle: music.album.title,
        title: music.title,
        image: music.image,
        releaseYear: new Date(music.releaseTime).getFullYear(),
        artists: music.MusicArtists.map((ma) => ma.artist.name).join(", "),
        period: isPeriodFirst ? "first" : "second",
      };
    })
    .sort((a, b) => b.playCount - a.playCount);

  return result;
};

export const getUserPreferGenre = async (userId) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const isPeriodFirst = currentMonth < 6;

  let startDate, endDate;

  if (isPeriodFirst) {
    startDate = new Date(currentYear, 0, 1);
    endDate = new Date(currentYear, 5, 30, 23, 59, 59, 999);
  } else {
    startDate = new Date(currentYear, 6, 1);
    endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999);
  }

  const preferredGenres = await prisma.genre.findMany({
    select: {
      id: true,
      name: true,
      MusicGenres: {
        where: {
          music: {
            UserMusics: {
              some: {
                userId,
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
          },
        },
      },
    },
    where: {
      MusicGenres: {
        some: {
          music: {
            UserMusics: {
              some: {
                userId,
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      MusicGenres: {
        _count: "desc",
      },
    },
    take: 5,
  });

  const genres = preferredGenres.map((genre) => ({
    id: genre.id,
    name: genre.name,
  }));

  if (genres.length === 3) {
    return [
      ...genres,
      { id: "15", name: "Others" },
      { id: "15", name: "Others" },
    ];
  } else if (genres.length === 4) {
    return [...genres, { id: "15", name: "Others" }];
  }

  return genres;
};
