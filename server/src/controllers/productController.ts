import type { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../middleware/errorHandler.js';
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from '../services/productService.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';

const validateId = (id: string): void => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid product id.');
  }
};

const getProductId = (request: Parameters<RequestHandler>[0]): string => {
  const id = request.params.id;
  if (typeof id !== 'string') {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid product id.');
  }
  return id;
};

export const createProductHandler: RequestHandler = async (request, response, next) => {
  try {
    const data = { ...request.body };
    if (!data.pricingExplanation && Array.isArray(data.explanation)) {
      data.pricingExplanation = data.explanation;
    }
    const parsed = createProductSchema.safeParse(data);
    if (!parsed.success) {
      next(new AppError(400, 'VALIDATION_ERROR', 'Invalid product information.', parsed.error.issues));
      return;
    }
    response.status(201).json({ success: true, data: await createProduct(parsed.data) });
  } catch (error) {
    next(error);
  }
};

export const listProductsHandler: RequestHandler = async (_request, response, next) => {
  try {
    response.json({ success: true, data: await listProducts() });
  } catch (error) {
    next(error);
  }
};

export const getProductHandler: RequestHandler = async (request, response, next) => {
  try {
    const id = getProductId(request);
    validateId(id);
    const product = await getProduct(id);
    if (!product) {
      next(new AppError(404, 'PRODUCT_NOT_FOUND', 'Product was not found.'));
      return;
    }
    response.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProductHandler: RequestHandler = async (request, response, next) => {
  try {
    const id = getProductId(request);
    validateId(id);
    const parsed = updateProductSchema.safeParse(request.body);
    if (!parsed.success) {
      next(new AppError(400, 'VALIDATION_ERROR', 'Invalid product information.', parsed.error.issues));
      return;
    }
    const product = await updateProduct(id, parsed.data);
    if (!product) {
      next(new AppError(404, 'PRODUCT_NOT_FOUND', 'Product was not found.'));
      return;
    }
    response.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProductHandler: RequestHandler = async (request, response, next) => {
  try {
    const id = getProductId(request);
    validateId(id);
    const deleted = await deleteProduct(id);
    if (!deleted) {
      next(new AppError(404, 'PRODUCT_NOT_FOUND', 'Product was not found.'));
      return;
    }
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};
