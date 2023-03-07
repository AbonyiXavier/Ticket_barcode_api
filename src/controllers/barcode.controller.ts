import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Jimp from "jimp";
import fs from 'fs';

import { STATUS_ERROR, STATUS_SUCCESS } from "../common/constant";
import logger from "../config/logger";
import barcodeModel from "../models/barcode.model";
import path from "path";
import { activateQRCode } from "../services/barcode/barcode.service";

const QrCode = require('qrcode-reader');

  /**
   * Validate a QR code with unique_qr_code saved to QR code
   * @param req 
   * @param res 
   * @returns 
   */
  export const validateQRWithUniqueQRCodeHandler = async (req: Request, res: Response) => {
    const { unique_qr_code } = req.query;
   try {
    // Check if the QR code is valid and matches a generated QR code in the database
    const item = await barcodeModel.findOne({ unique_qr_code });
     
   if (item?.is_activated === true) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      status: STATUS_ERROR,
      message: "Expired QR code",
      data: null,
    })
   } 
    if (item) {
      return res.status(StatusCodes.CREATED).send({
        status: STATUS_SUCCESS,
        message: "QR code is valid",
        data: item,
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        status: STATUS_ERROR,
        message: "Invalid QR code",
        data: null,
      })
    }
     } catch (error: unknown) {
       logger.error("readQRHandler failed ", error);
       
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
         status: STATUS_ERROR,
         message: "Error fetching ticket",
         data: null,
       });
     }
 };

 export const activateQRCodeCodeHandler = async (req: Request, res: Response) => {
  const { unique_qr_code } = req.params;
  try {
    const result = await activateQRCode(unique_qr_code);
    
    return res.status(StatusCodes.CREATED).send({
      status: STATUS_SUCCESS,
      message: "Ticket activated",
      data: result,
    });
  } catch (error) {
    console.log("controller error");
  }
 }

/**
 * Read QR code saved to file
 * @param req 
 * @param res 
 * @returns 
 */
export const readQRHandler = async (req: Request, res: Response) => {

    const { barcodeImage } = req.body;
    const matches = barcodeImage.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  
    try {
  
      if (matches) {
      const buffer = fs.readFileSync(path.join(__dirname, '../', '/temp/image.jpg'));
  
      Jimp.read(buffer, (error: unknown, image: Record<string, any>) => {
  
        if(error) {
          logger.error(error);
        } 
  
        const qr = new QrCode();
        qr.callback = async (error: unknown, value: Record<string, any>) => {
          if (error) {
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
              status: STATUS_ERROR,
              message: "Error scanning QR code",
              data: null,
            })
          } else {  
            // Check if the QR code is valid and matches a generated QR code in the database
            const item = await barcodeModel.findOne({ unique_qr_code: value.result });
            
            if (item) {
              return res.status(StatusCodes.CREATED).send({
                status: STATUS_SUCCESS,
                message: "QR code is valid",
                data: item,
              });
            } else {
              return res.status(StatusCodes.UNAUTHORIZED).send({
                status: STATUS_ERROR,
                message: "Invalid QR code",
                data: null,
              })
            }
          }
          };    
  
          qr.decode(image.bitmap);
        })
    }
      } catch (error: unknown) {
        logger.error("readQRHandler failed ", error);
        
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          status: STATUS_ERROR,
          message: "Error fetching ticket",
          data: null,
        });
      }
  };
  
  // Link to visit
  // qr_scanner : https://openjavascript.info/code-lives/index.html 
  // youtube link of qr_scanner: https://www.youtube.com/watch?v=19eo39lqpLM