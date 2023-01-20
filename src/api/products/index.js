import express from "express";
import createHttpError from "http-errors";
import ProductModel from "./model.js";
import ReviewModel from "../reviews/model.js";

const productRouter = express.Router();

productRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = await ProductModel(req.body);
    const { _id } = await newProduct.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductModel.find();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const writtenReview = await ReviewModel.findById(req.body.reviewId, {
      _id: 0,
    });
    if (writtenReview) {
      const reviewToLeave = {
        ...writtenReview.toObject(),
        reviewDate: new Date(),
      };

      const updateProduct = await ProductModel.findByIdAndUpdate(
        req.params.productId,
        { $push: { reviews: reviewToLeave } },
        { new: true, runValidators: true }
      );
      if (updateProduct) {
        res.send(updateProduct);
      } else {
        next(
          createHttpError(
            404,
            `Product with ID ${req.params.productId} is not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productRouter;
