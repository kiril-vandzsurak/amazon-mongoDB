import express from "express";
import ReviewModel from "../reviews/model.js";
import q2m from "query-to-mongo";

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

reviewRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await ReviewModel.countDocuments(mongoQuery.criteria);

    const reviews = await ReviewModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    )
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort);

    res.send({
      links: mongoQuery.links("http://localhost:3001/reviews", total),
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      reviews,
    });
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
