import dotenv from "dotenv";
import path from 'path';
import Joi from 'joi';

dotenv.config();

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'staging').required(),
    PORT: Joi.number().positive().required(),
    MONGODB_URI: Joi.string().required().description('Mongo DB url'),
    PAYSTACK_SECRET_KEY: Joi.string().required().description('PAYSTACK_SECRET_KEY'),
    PAYSTACK_INITIALIZE_PAYMENT_URL: Joi.string().required().description('PAYSTACK_INITIALIZE_PAYMENT_URL'),
    PAYSTACK_VERIFY_PAYMENT_URL: Joi.string().required().description('PAYSTACK_VERIFY_PAYMENT_URL'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  mongodb: envVars.MONGODB_URI,
  PAYSTACK_SECRET_KEY: envVars.PAYSTACK_SECRET_KEY,
  PAYSTACK_INITIALIZE_PAYMENT_URL: envVars.PAYSTACK_INITIALIZE_PAYMENT_URL,
  PAYSTACK_VERIFY_PAYMENT_URL: envVars.PAYSTACK_VERIFY_PAYMENT_URL
}