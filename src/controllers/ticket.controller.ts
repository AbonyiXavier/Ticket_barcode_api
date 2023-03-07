import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { statusError, statusSuccess } from "../common/constant";
import { createTicket, getTicket } from "../services/ticket/ticket.service";
import { createTicketConfig } from "../services/ticket/types";


export const createTicketHandler = async (req: Request, res: Response) => {
  const { ticket_name, ticket_description, ticket_amount, category } = req.body;

  const payload : createTicketConfig = { ticket_name, ticket_description, ticket_amount, category };

  try {

    const ticket = await createTicket(payload);

    return res.status(StatusCodes.CREATED).send({
      status: statusSuccess,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error: any) {

    if (
      error.name === "MongoServerError" &&
      error.code === 11000
    ) {
      return res.status(StatusCodes.CONFLICT).send({
        status: statusError,
        message: "Ticket name already exist",
        data: null,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: statusError,
      message: "Error creating user",
      data: null,
    });
  }
};

export const fetchTicketHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await getTicket(id);
  
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).send({
          status: statusError,
          message: "No ticket found",
          data: null,
        });
      }
  
      return res.status(StatusCodes.OK).send({
        status: statusSuccess,
        message: "Ticket fetched successfully",
        data: user,
      });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: statusError,
        message: "Error fetching ticket",
        data: null,
      });
    }
  };