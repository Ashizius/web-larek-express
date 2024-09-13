import { createProduct, getProduct } from '../controllers/products';
import { Router } from 'express';

import { validateProducts } from '../middlewares/products';
import { checkId } from '../middlewares/checkId';
import { fileMiddleware } from '../middlewares/upload';
import { uploadFile } from '../controllers/upload';
const router = Router();

router.post('/', fileMiddleware, uploadFile); 



export default router;


//Файл сначала должен загружаться во временную директорию, которая будет периодически очищаться от старых файлов с помощью утилиты cron

/*
Маршрут должен возвращать ответ:

{
    "fileName": "/images/686ade58.png",
    "originalName": "5_Dots.png"
} 
*/