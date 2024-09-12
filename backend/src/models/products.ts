import { Schema, model } from 'mongoose';

interface IImage {
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

const imageSchema = new Schema<IImage>({
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
});

const productSchema = new Schema<IProduct>({
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

export default model<IProduct>('product', productSchema);
