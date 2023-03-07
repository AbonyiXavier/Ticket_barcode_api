import QRCode from 'qrcode';
import logger from '../../config/logger';
import barcodeModel from '../../models/barcode.model';
import { createBarcodeConfig, GetTodaysDate } from './types';
import { addMinutes, addDays } from 'date-fns';
import { TICKET_VALID_TIME } from '../../common/constant';

const ticketList: Record<string, string> = {
  single_ticket: 'single ticket',
  twenty_four_hours_ticket: 'twenty four hours ticket',
  seven_days_ticket: 'seven days ticket',
};

export const createBarcode = async (prop: createBarcodeConfig) => {
  const { unique_qr_code, ticket_time, ticket_name } = prop;
  try {
    const barcode = new barcodeModel({
      unique_qr_code,
      ticket_time,
      ticket_name,
    });

    //@TODO: refactor me
    // ticket_time is the paid_at date and time gotten from paystack and add each mins or hours or days based on the ticket name been purchased to get the expired date on countdown
    switch (barcode.ticket_name) {
      case ticketList.single_ticket:
        barcode.ticket_time = addMinutes(ticket_time, TICKET_VALID_TIME.SINGLE_TICKET);
        break;

      case ticketList.twenty_four_hours_ticket:
        barcode.ticket_time = addDays(barcode.ticket_time, TICKET_VALID_TIME.TWENTY_FOUR_HOURS_TICKET);
        break;

      case ticketList.seven_days_ticket:
        barcode.ticket_time = addDays(barcode.ticket_time, TICKET_VALID_TIME.SEVEN_DAYS_TICKET);
        break;

      default:
        logger.error('Invalid ticket name....');
        break;
    }

    const result = await barcode.save();
    return result;
  } catch (error: any) {
    logger.error('create barcode failed', error);
    throw error;
  }
};

export const activateQRCode = async (unique_qr_code: string) => {
  try {
    const result = await barcodeModel.findOneAndUpdate(
      {
        unique_qr_code,
        is_activated: false,
      },
      {
        $set: {
          is_activated: true,
        },
      },
      {
        new: true,
      },
    );

    return result;

    //@TODO: implement the time count down to frontend when isActivated is updated via api call
    // const countdownTimer = setInterval(() => {
    //   const ticketTime = result.ticket_time;
    //   console.log("ticketTime", ticketTime);
    //   const countDownDate = new Date(ticketTime).getTime();
    //   const now = new Date().getTime();

    //   const timeLeft = countDownDate - now;

    //   // Calculating the days, hours, minutes and seconds left
    //   const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    //   const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //   const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    //   const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    //   if (timeLeft > 0) {
    //     console.log(`${hours}h:${minutes}m:${seconds}s`);
    //     // return {
    //       message =`${days}:${hours}h:${minutes}m:${seconds}s`
    //     // }
    //   }
    //   // Display the message when countdown is over
    //     clearInterval(countdownTimer);
    //     message = "Ticket has expired for QR code."

    //   }, 1000);
  } catch (error) {
    logger.error('activate barcode failed', error);
    throw error;
  }
};

export const generateQRToFile = async (payload: string) => {
  try {
    await QRCode.toFile('src/temp/image.jpg', payload, {
      errorCorrectionLevel: 'H',
    });
  } catch (error: any) {
    logger.error('generateQRToFile', error);
  }
};

export const generateQRInBase64 = async (payload: string) => {
  try {
    const data = await QRCode.toDataURL(payload);
    return data;
  } catch (error: any) {
    logger.error('generateQRInBase64', error);
  }
};

export const getTodaysDate: GetTodaysDate = (date) => {
  const newDate = new Date(date.setHours(12)); //set time to 12pm to prevent UTC from changing the date.
  return newDate.toISOString().split('T')[0]; // 2022-01-31
};
