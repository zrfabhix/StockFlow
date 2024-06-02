import { Router } from "express";
import ApiResponse from "../../utility/Api/ApiResponse.js";
import { Collection, Stock } from "../../modal/stock/stock.model.js";
import authenticate from "../../middlewares/authenticate.js";
import mongoose from "mongoose";
import { User } from "../../modal/auth/user.model.js";
import { upload } from "../../middlewares/multer.js";
import fs from "fs";
import cloudinary from "../../utility/cloudinary.js";
const router = Router();

// Fetch Collection By id
router.get("/", authenticate, async (req, res) => {
  try {
    const { id } = req.query;
    const collection = await Collection.findById(id);
    return res.status(200).json(new ApiResponse(200, collection));
  } catch (e) {
    return res
      .status(500)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

// Fetch all collections
router.get("/all", authenticate, async (req, res) => {
  try {
    const collection = await Collection.find({ user: req.user?._id });
    return res.status(200).json(new ApiResponse(200, collection));
  } catch (e) {
    return res
      .status(500)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

//  Create Collection
router.post("/create", authenticate, async (req, res) => {
  try {
    const { name, desc } = req.body;
    console.log(name, desc);
    const collection = new Collection({ name, desc, user: req.user._id });
    await collection.save();
    res.status(200).json(new ApiResponse(200, collection));
  } catch (e) {
    res.status(500).json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

// Update Collection
router.put("/", authenticate, async (req, res) => {
  try {
    const { name, desc, id } = req.query;
    const collection = await Collection.findById(id);
    collection.name = name;
    collection.desc = desc;
    await collection.save();
    return res.status(200).json(new ApiResponse(200, collection));
  } catch (e) {
    return res
      .status(500)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

// Delete Collection
router.delete("/", authenticate, async (req, res) => {
  try {
    const { id } = req.query;
    await Collection.findByIdAndDelete(id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Collection Deleted Successfully"));
  } catch (e) {
    return res
      .status(500)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

// Get Stock
router.get("/stock", authenticate, async (req, res) => {
  try {
    const { id } = req.query;
    const stock = await Stock.findById(id);
    console.log(stock);
    if (stock) res.status(200).json(new ApiResponse(200, stock));
    else {
      return res
        .status(500)
        .json(new ApiResponse(500, { message: e.message }, "error"));
    }
  } catch (e) {
    return res
      .status(500)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

// Fetch all stocks
router.get("/stock/all", authenticate, async (req, res) => {
  try {
    const { collection } = req.query;
    const response = await Stock.find({ collection: collection });
    console.log(response);
    return res.status(200).json(new ApiResponse(200, response));
  } catch (e) {
    return res.status(500).json(new ApiResponse(400, e, "Error"));
  }
});

// Create Stock
router.post("/stock", authenticate, upload.single("file"), async (req, res) => {
  try {
    const { name, desc, quantity, price, category, collection } = req.body;
    let result = null;
    if (req.file) {
      await cloudinary.uploader.upload(req.file?.path, function (data, error) {
        if (data) result = data;
      });
    }

    const stock = new Stock({
      name,
      desc,
      quantity,
      price,
      category,
      collection,
      imageUrl: result?.url,
      imagePublicId: result?.public_id,
    });

    await stock.save();
    if (req.file) fs.unlinkSync(req.file?.path);
    return res.status(200).json(new ApiResponse(200, stock));
  } catch (e) {
    return res
      .status(500)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

// Update Stock
router.put("/stock", authenticate, async (req, res) => {
  try {
    const { name, desc, quantity, price, category, id } = req.query;
    const stock = await Stock.findById(id);

    stock.name = name;
    stock.desc = desc;
    stock.quantity = quantity;
    stock.price = price;
    stock.category = category;
    await stock.save();
    return res.status(200).json(new ApiResponse(200, stock));
  } catch (e) {
    return res
      .status(500)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

// Delete stock
router.delete("/stock", authenticate, async (req, res) => {
  try {
    const { id } = req.query;
    await Stock.findByIdAndDelete(id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Stock deleted successfully"));
  } catch (e) {
    return res
      .status(500)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

// Collection Search
router.get("/collection/search", authenticate, async (req, res) => {
  try {
    const { query } = req.query;
    const id = req.query?.id
      ? new mongoose.Types.ObjectId(req.query.id)
      : req.user._id;

    const collections = await Collection.aggregate([
      {
        $match: { user: id },
      },
      {
        $match: { name: { $regex: query, $options: "i" } },
      },
    ]);
    if (collections) {
      return res.status(200).json(new ApiResponse(200, collections));
    } else {
      return res
        .status(400)
        .json(new ApiResponse(400, { message: e.message }, "error"));
    }
  } catch (e) {
    return res
      .status(400)
      .json(new ApiResponse(400, { message: e.message }, "error"));
  }
});

// Stocks Search
router.get("/stock/search", authenticate, async (req, res) => {
  try {
    const { query, id } = req.query;

    const stocks = await Stock.aggregate([
      {
        $match: { collection: new mongoose.Types.ObjectId(id) },
      },
      {
        $match: { name: { $regex: query, $options: "i" } },
      },
    ]);
    if (stocks) {
      return res.status(200).json(new ApiResponse(200, stocks));
    } else {
      return res
        .status(400)
        .json(new ApiResponse(400, { message: e.message }, "error"));
    }
  } catch (e) {
    return res
      .status(400)
      .json(new ApiResponse(400, { message: e.message }, "error"));
  }
});

router.post("/share", authenticate, async (req, res) => {
  try {
    const { collectionId, email } = req.body;
    if (!collectionId || !email) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, { message: "Required all fields" }, "error")
        );
    }

    const findOtherUser = await User.findOne({ email: email });
    if (findOtherUser) {
      const data = findOtherUser.shared;
      if (!data.includes(collectionId)) {
        findOtherUser.shared = data;
        data.push(collectionId);
        await findOtherUser.save();
      }
      return res
        .status(200)
        .json(
          new ApiResponse(200, findOtherUser, "Collection Shared Succesfullly")
        );
    }
    return res
      .status(500)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  } catch (e) {
    return res
      .status(500)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

router.post("/fetchAllCollections", authenticate, async (req, res) => {
  const { collectionsId } = req.body;
  console.log(collectionsId)
  try {
    const collections = await Collection.find({ _id: { $in: collectionsId } });
    if (collections) {
      return res.status(200).json(new ApiResponse(200, collections));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, { message: e.message }, "error"));
    }
  } catch (e) {
    return res
      .status(500)
      .json(new ApiResponse(500, { message: e.message }, "error"));
  }
});

export default router;
