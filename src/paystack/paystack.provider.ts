   
import axios from "axios";

export const initializePayment = async (form: Record<string, any>) => {
  const options = {
    url: process.env.PAYSTACK_INITIALIZE_PAYMENT_URL,
    headers: {
      authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    },
    method: 'POST',
    data: form,
  };
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.request(options);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Verify all transactions before updating their status in the DB
 * @param {String} trxref The reference String to verify the transaction. It will be gotten after successfully
 * initializing a transaction.
 */

export const verifyPayment = async (ref: string | number | boolean) => {
  const options = {
    url: process.env.PAYSTACK_VERIFY_PAYMENT_URL + encodeURIComponent(ref),
    headers: {
      authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    },
    method: 'GET',
  };
  return new Promise(async (resolve, reject) => {
    try {
      const data = await axios.request(options);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};