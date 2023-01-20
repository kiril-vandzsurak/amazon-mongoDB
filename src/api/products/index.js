import express from "express";
import createHttpError from "http-errors";
import ProductModel from "./model.js";
import ReviewModel from "../reviews/model.js";

const productRouter = express.Router();
export default productRouter;
