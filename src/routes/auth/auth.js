import { Router } from "express";
import ApiResponse from "../../utility/Api/ApiResponse.js";
import { User } from "../../modal/auth/user.model.js";
import authenticate from "../../middlewares/authenticate.js";
const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password)
      return res
        .status(500)
        .json(
          new ApiResponse(400, { message: "All fields are required" }, "error")
        );
    const user = await User.findOne({ email: email });
    if (user?.password == password) {
      const token = user.getToken();
      console.log(token);
      res.cookie("token", token, { maxAge: 864000000, httpOnly: true});
      res.status(200).json(new ApiResponse(200, user));
    } else {
      return res
        .status(400)
        .json(new ApiResponse(400, "Login failed", "error"));
    }
  } catch (e) {
    res.status(500).json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(200).json(new ApiResponse(200, user));
  } catch (e) {
    res.status(500).json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    if (req.user?._id) {
      return res.status(200).json(new ApiResponse(200, req.user));
    } else {
      return res
        .status(400)
        .json(new ApiResponse(500, { message: e.message }, "error"));
    }
  } catch (e) {
    return res
      .status(500)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json(new ApiResponse(200, "Logged out successfully"));
  } catch (e) {
    res.status(500).json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

router.get("/getUser", authenticate, async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json(new ApiResponse(200, user));
    } else {
      return res
        .status(400)
        .json(new ApiResponse(500, { message: e.message }, "error"));
    }
  } catch (e) {
    return res
      .status(400)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  }
});
export default router;
