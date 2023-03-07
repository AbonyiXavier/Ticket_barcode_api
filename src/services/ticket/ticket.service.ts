import logger from "../../config/logger";
import ticketModel from "../../models/ticket.model";
import { createTicketConfig } from "./types";

const ticketDescription = (ticket_time: Date, duration: string) => {
  return `This app ticket is valid for travel for ${ticket_time} ${duration} after activation.`
}

export const createTicket = async (prop: createTicketConfig) => {
 const { ticket_name, ticket_description, ticket_amount, category } = prop;
  try {
    const ticket = new ticketModel({
     ticket_name,
     ticket_description,
     ticket_amount,
     category   
    });

    const result = await ticket.save();
    
    return result;
  } catch (error: any) {
    logger.error("create ticket failed", error);
    throw error;
  }
};

export const getTicket = async (id: string) => {
    try {
      const ticket = await ticketModel.findOne({ _id: id }).populate("category");
  
      return ticket;
  
    } catch (error) {
      logger.error("get ticket failed", error);
      throw error;
    }
};