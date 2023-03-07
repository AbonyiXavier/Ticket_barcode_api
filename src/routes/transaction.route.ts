import { initializeTransactionHandler, VerifyTransactionHandler } from '../controllers/transaction.controller';

const router = require('express').Router();

router.post('/paystack/pay', initializeTransactionHandler);
router.get('/paystack/callback', VerifyTransactionHandler);

export default router;