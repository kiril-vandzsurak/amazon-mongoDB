import express from "express";
import createHttpError from "http-errors";
import ProductModel from "./model.js";
import ReviewModel from "../reviews/model.js";

const productRouter = express.Router();

productRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const writtenReviews = await ReviewModel.findById(req.body.reviewId, {
      _id: 0,
    });
  } catch (error) {
    next(error);
  }
});

export default productRouter;
