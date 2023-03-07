export type createBarcodeConfig = {
  unique_qr_code: string;
  ticket_time: Date;
  ticket_name: string;
};

export type GetTodaysDate = (date: Date) => string;
