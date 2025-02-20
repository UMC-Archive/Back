export const response = (data, result) => {
    return {
        isSuccess: data.isSuccess,
        code: data.code,
        message: data.message,
        result: result
    }
};
