import { createTicketHandler, fetchTicketHandler } from '../controllers/ticket.controller';
import validate from '../middlewares/validate';

const router = require('express').Router();

router.post('/ticket', createTicketHandler);
router.get('/ticket/:id', fetchTicketHandler);


export default router;