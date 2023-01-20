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

productRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.delete("/:productId", async (req, res, next) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(
      req.params.productId
    );
    if (deletedProduct) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
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

productRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    if (product) {
      res.send(product.reviews);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);

    if (product) {
      const writtenReview = product.reviews.find(
        (comment) => comment._id.toString() === req.params.reviewId
      );
      if (writtenReview) {
        res.send(writtenReview);
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    if (product) {
      const index = product.reviews.findIndex(
        (comment) => comment._id.toString() === req.params.reviewId
      );
      if (index !== -1) {
        product.reviews[index] = {
          ...product.reviews[index].toObject(),
          ...req.body,
        };
        await product.save();
        res.send(product);
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      { $pull: { reviews: { _id: req.params.reviewId } } },
      { new: true }
    );
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  }
);

export default productRouter;
