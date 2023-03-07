import logger from "../../config/logger";
import transactionModel from "../../models/transaction.model";
import { createTransactionConfig } from "./types";

export const createTransaction = async (prop: createTransactionConfig) => {
 const { amount, email, reference, status } = prop;
  try {

    const transaction = new transactionModel({
        amount,
        email,
        reference,
        status,
        // ticket
    });

    const result = await transaction.save();
    
    return result;
  } catch (error: any) {
    logger.error("create transaction failed", error);
    throw error;
  }
};