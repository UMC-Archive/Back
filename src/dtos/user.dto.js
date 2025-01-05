export const bodyToUser = (body) => {
    return {
        name: body.name,
        email: body.email
    }
};
export const responseFromUser = ({ user }) => {
    return {
        email: user.email,
        name: user.name
    }
};