import jwt from "jsonwebtoken";

const authenticate = (req, res) => {
  
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    if (Math.floor(Date.now() / 1000) > decodedToken?.exp) {
      // res.status(401).json({ success: false, message: "Unuthorized access" });
      return false
    } else {
      return true
    }
  } catch {
    // res.status(401).json({ success: false, message: "Unuthorized access" });
    return false
  }
};
export default authenticate;
