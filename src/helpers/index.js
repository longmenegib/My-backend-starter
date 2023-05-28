export const authorization = () => {
    return "Bearer " + process.env.JWT_TOKEN;
};