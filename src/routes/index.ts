const router = require('express').Router();

import categoryRoute from './category.route';
import ticketRoute from './ticket.route';
import transactionRoute from './transaction.route';
import barcodeRoute from './barcode.route';

router.use('/v1', categoryRoute);
router.use('/v1', ticketRoute);
router.use('/v1', transactionRoute);
router.use('/v1', barcodeRoute);


export default router;