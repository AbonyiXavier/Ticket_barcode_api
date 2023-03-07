import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import shortid from 'shortid';

import { STATUS_ERROR, STATUS_SUCCESS } from "../common/constant";
import { initializePayment, verifyPayment } from "../paystack/paystack.provider";
import { createTransaction } from "../services/transaction/transaction.service";
import { createTransactionConfig } from "../services/transaction/types";
import logger from "../config/logger";
import { createBarcode, generateQRInBase64 } from "../services/barcode/barcode.service";


export const initializeTransactionHandler = async (req: Request, res: Response) => {
    try {
      const { amount, email, ticket } = req.body;
  
      const payload = {
        amount: parseFloat(amount) * 100,
        email,
        ticket
      };
  
      const response: any = await initializePayment(payload);

      // await createTransaction( {
      //   amount: payload?.amount,
      //   email: payload?.email,
      //   ticket: payload?.ticket,
      //   reference: response?.data,
      //   status: 'pending',
      // });

      if (response) {
          return res.status(StatusCodes.CREATED).send({
            status: STATUS_SUCCESS,
            message: response?.message,
            data: response?.data,
          });
      }
    } catch (error: unknown) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: STATUS_ERROR,
            message: "Error initializing payment",
            data: null,
        });
    }
  };
  
export const VerifyTransactionHandler = async (req: Request, res: Response) => {
    try {
      const { trxref } = req.query;
        
      if (!trxref) {
        logger.info('No transaction reference found');
      }
  
      const paymentStatus: any = await verifyPayment(trxref as string);
      
      const { status, reference, amount, customer, paid_at } = paymentStatus.data.data;
      const { email } = customer;
      
      const payload : createTransactionConfig = {
          amount,
          email,
          status,
          reference,
          // ticket_name: "seven days ticket",
      };
     
      if (paymentStatus.status === 200) {
        // update transaction
        //

         await createTransaction( {
            amount: payload?.amount,
            email: payload?.email,
            reference: payload?.reference,
            status: payload?.status,
            // ticket_name: "seven days ticket",
          });

          // find a way to get ticket
          // create a barcode
          const unique_qr_code = shortid.generate();
          const config = {
            unique_qr_code,
            ticket_time: paid_at,
            ticket_name: "seven days ticket",
          }
          const barcode = await createBarcode(config);
          
          const barcodeImage = await generateQRInBase64(barcode.unique_qr_code);
          console.log("barcodeImage...",  barcodeImage);
          // update barcode_image to barcode db
          return res.status(StatusCodes.CREATED).send({
              status: STATUS_SUCCESS,
              message: 'Payment was made successfully',
              data: { 
                // payload,
                barcode,
                barcodeImage 
              }
          });
      }
      // save a copy of failed transaction
      // await createTransaction( {
      //   amount: payload?.amount,
      //   email: payload?.email,
      //   reference: payload?.reference,
      //   status: payload?.status,
      // });

    } catch (error: unknown) {  
      logger.error("Error verifying payment", error)    
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: STATUS_ERROR,
            message: "Error verifying payment",
            data: null,
        });
    }
 };