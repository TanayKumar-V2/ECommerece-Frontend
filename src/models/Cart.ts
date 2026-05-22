import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  email: string;
  items: ICartItem[];
  totalAmount: number;
  recovered: boolean;
  recoveryEmailSentAt?: Date;
}

const CartItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const CartSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    items: { type: [CartItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    recovered: { type: Boolean, default: false },
    recoveryEmailSentAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Cart ||
  mongoose.model<ICart>('Cart', CartSchema);
