import mongoose from 'mongoose';
import path from 'path';
import { pauseUploadsClear, resumeUploadsClear } from '../utils/clearUpload';
import * as fs from 'node:fs/promises';

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
    pauseUploadsClear();
    const fileName = payload.image.fileName;
    const filePathOld = path.join(
      __dirname,
      '../public/uploads/',
      path.basename(fileName)
    );
    const filePathNew = path.join(
      __dirname,
      '../public/images/',
      path.basename(fileName)
    );
    let item;
    try {
      await fs.rename(filePathOld, filePathNew);
      item = await this.create(payload);
      return item;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      resumeUploadsClear();
    }
  }
);

productSchema.static(
  'updateProduct',
  async function updateProduct(
    id: mongoose.ObjectId,
    payload: Partial<IProduct>
  ) {
    console.log('===============payload: ',payload);
    console.log('===============id: ',id);
    let item;
    let fileName;
    if (payload.image) {
      fileName = payload.image.fileName;
    }
    console.log('fileName:',fileName);
    try {
      if (fileName) {
        pauseUploadsClear();
        const filePathOld = path.join(
          __dirname,
          '../public/uploads/',
          path.basename(fileName)
        );
        const filePathNew = path.join(
          __dirname,
          '../public/images/',
          path.basename(fileName)
        );
        console.log('filePathOld, filePathNew:',filePathOld, filePathNew);
        await fs.rename(filePathOld, filePathNew);
      }
      item = await this.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
      });
      console.log('item:',item);
      return item;
    } catch (error) {
      console.log('error:',error);
      return Promise.reject(error);
    } finally {
      if (fileName) {
        resumeUploadsClear();
      }
    }
  }
);

export default mongoose.model<IProduct, ProductModel>('product', productSchema);
