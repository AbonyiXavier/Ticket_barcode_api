import { createCategoryHandler } from '../controllers/category.controller';
import validate from '../middlewares/validate';

const router = require('express').Router();

router.post('/category', createCategoryHandler);


export default router;