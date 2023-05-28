import jwt from "jsonwebtoken";

function generateJWT(payload) {
    return jwt.sign(payload, process.env.JWT_KEY, {
    });
}

export default generateJWT;