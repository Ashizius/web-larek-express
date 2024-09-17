import mongoose from 'mongoose';
import { pauseUploadsClear, resumeUploadsClear } from '../utils/schedules';
import { moveToImages } from '../utils/uploadsHandlers';
import { logger } from '../middlewares/logger';

export interface IImage {
  fileName: string;
  originalName: string;
}

export interface IProduct {
  title: string;
  image: IImage;
  category: string;
  description?: string;
  price?: Number | null;
}

export type productDocument = mongoose.Document<unknown, {}, IProduct> &
  IProduct &
  Required<{
    _id: mongoose.Schema.Types.ObjectId;
  }>;

export interface ProductModel extends mongoose.Model<IProduct> {
  createProduct: (payload: IProduct) => Promise<productDocument>;
  updateProduct: (
    id: mongoose.ObjectId,
    payload: Partial<IProduct>
  ) => Promise<productDocument>;
}

const imageSchema = new mongoose.Schema<IImage>({
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
});

const productSchema = new mongoose.Schema<IProduct, ProductModel>({
  title: {
    type: String,
    unique: true,
    required: [true, 'Поле "title" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
  },
  image: imageSchema,
  category: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: false, default: null },
});

productSchema.static(
  'createProduct',
  async function createProduct(payload: IProduct) {
    logger.debug('createProduct');
    pauseUploadsClear();
    const { fileName } = payload.image;
    let item;
    try {
      item = await this.create(payload);
      moveToImages(fileName);
      return item;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      resumeUploadsClear();
    }
  },
);

productSchema.static(
  'updateProduct',
  async function updateProduct(
    id: mongoose.ObjectId,
    payload: Partial<IProduct>,
  ) {
    let item;
    let fileName;
    if (payload.image) {
      fileName = payload.image.fileName;
    }
    logger.debug('updateProduct');
    try {
      item = await this.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      if (fileName) {
        pauseUploadsClear();
        await moveToImages(fileName);
      }
      return item;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      if (fileName) {
        resumeUploadsClear();
      }
    }
  },
);

export default mongoose.model<IProduct, ProductModel>('product', productSchema);
