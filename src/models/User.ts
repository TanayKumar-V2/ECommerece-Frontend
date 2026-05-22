import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
