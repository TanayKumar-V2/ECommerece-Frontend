import mongoose, { Schema, Document } from 'mongoose';

export interface IShippingAddress {
  name: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  size: string;
  color: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  products: IOrderItem[];
  totalAmount: number;
  paymentId?: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped';
  shippingAddress: IShippingAddress;
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentId: { type: String },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped'],
      default: 'pending',
    },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
