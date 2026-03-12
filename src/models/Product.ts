import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  category: 'men' | 'women' | 'unisex';
  images: string[];
  sizes: string[];
  colors: string[];
  qikink_sku: string;
}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ['men', 'women', 'unisex'], required: true },
    images: { type: [String], required: true },
    sizes: { type: [String], required: true },
    colors: { type: [String], required: true },
    qikink_sku: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
