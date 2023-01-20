import express from "express";
import createHttpError from "http-errors";
import UserModel from "./model.js";
import CartModel from "./cartModel.js";
import ProductModel from "../products/model.js";

const userRouter = express.Router();

userRouter.post("/", async (req, res, next) => {
  try {
    const newUser = await UserModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

userRouter.post("/:userId/cart", async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }

    const purchasedProduct = await ProductModel.findById(productId);
    if (!purchasedProduct) {
      return next(
        createHttpError(404, `Product with id ${productId} not found!`)
      );
    }

    const isProductThere = await CartModel.findOne({
      owner: req.params.userId,
      status: "Active",
      "products.productsId": productId,
    });

    if (isProductThere) {
      const updatedCart = await CartModel.findOneAndUpdate(
        {
          owner: req.params.userId,
          status: "Active",
          "products.productId": bookId,
        },
        { $inc: { "products.$.quantity": quantity } },
        { new: true, runValidators: true }
      );
      res.send(updatedCart);
    } else {
      const modifiedCart = await CartModel.findOneAndUpdate(
        { owner: req.params.userId, status: "Active" },
        { $push: { products: { productId: productId, quantity } } },
        { new: true, runValidators: true, upsert: true }
      );
      res.send(modifiedCart);
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
