import { User } from "../modal/auth/user.model.js";
import ApiResponse from "../utility/Api/ApiResponse.js";
import jwt from "jsonwebtoken";

const authenticate = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (token) {
      const verify = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(verify?._id);
      if (user) req.user = user;
      else
        return res
          .status(400)
          .json(new ApiResponse(400, "Invalid token", "error"));
    } else
      return res
        .status(400)
        .json(new ApiResponse(400, "Invalid token", "error"));
  } catch (e) {
    return res.status(400).json(new ApiResponse(400, "Invalid token", "error"));
  }

  next();
};

export default authenticate;
