import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { STATUS_ERROR, STATUS_SUCCESS } from "../common/constant";
import { ticketResponse } from "../common/interface";
import { createCategory } from "../services/category/category.service";

export const createCategoryHandler = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {

    const category = await createCategory(name);

    return res.status(StatusCodes.CREATED).send({
      status: STATUS_SUCCESS,
      message: "Ticket category created successfully",
      data: category,
    });
  } catch (error: any) {

    if (
      error.name === "MongoServerError" &&
      error.code === 11000
    ) {
      return res.status(StatusCodes.CONFLICT).send({
        status: STATUS_ERROR,
        message: "Category name already exist",
        data: null,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: "Error creating category",
      data: null,
    });
  }
};
