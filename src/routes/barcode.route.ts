import { activateQRCodeCodeHandler, readQRHandler, validateQRWithUniqueQRCodeHandler } from "../controllers/barcode.controller";

const router = require('express').Router();


router.get('/validate/qr', validateQRWithUniqueQRCodeHandler);
router.post('/read/qr', readQRHandler);
router.patch('/activate/qr/:unique_qr_code', activateQRCodeCodeHandler);

export default router;