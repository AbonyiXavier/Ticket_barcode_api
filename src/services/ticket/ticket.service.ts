import logger from "../../config/logger";
import ticketModel from "../../models/ticket.model";
import { createTicketConfig } from "./types";
import { addMinutes, addDays, addHours } from 'date-fns'

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

    // switch (ticket_name) {
    //   case ticketList.single_ticket:
    //     ticket.ticket_time = addMinutes(ticket.ticket_time, TICKET_VALID_TIME.SINGLE_TICKET);
    //     // ticket_description = ticketDescription(ticket.ticket_time, "minutes");
    //     break;

    //   case ticketList.twenty_four_hours_ticket:
    //     ticket.ticket_time = addHours(ticket.ticket_time, TICKET_VALID_TIME.TWENTY_FOUR_HOURS_TICKET);
    //     break;

    //   case ticketList.seven_days_ticket:
    //     ticket.ticket_time = addDays(ticket.ticket_time, TICKET_VALID_TIME.SEVEN_DAYS_TICKET);
    //     break;
    
    //   default:
    //     logger.error("Invalid ticket name....")
    //     break;
    // }

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