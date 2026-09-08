import { Router } from 'express';
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  listProductsHandler,
  updateProductHandler,
} from '../controllers/productController.js';

export const productRoutes = Router();

productRoutes.post('/', createProductHandler);
productRoutes.get('/', listProductsHandler);
productRoutes.get('/:id', getProductHandler);
productRoutes.put('/:id', updateProductHandler);
productRoutes.delete('/:id', deleteProductHandler);
