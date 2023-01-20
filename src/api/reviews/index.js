import express from "express";
import createHttpError from "http-errors";
import ReviewModel from "../reviews/model.js";

const reviewRouter = express.Router();

reviewRouter.post("/", async (req, res, next) => {
  try {
    const newReview = await ReviewModel(req.body);
    const { _id } = await newReview.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
