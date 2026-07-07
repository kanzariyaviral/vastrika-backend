import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface OtpAttributes {
  id: string;
  email: string;
  otp: string;
  purpose: 'verification' | 'password_reset';
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OtpCreationAttributes = Optional<OtpAttributes, 'id' | 'purpose'>;

export class Otp extends Model<OtpAttributes, OtpCreationAttributes> implements OtpAttributes {
  public id!: string;
  public email!: string;
  public otp!: string;
  public purpose!: 'verification' | 'password_reset';
  public expiresAt!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Otp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        len: [6, 6],
      },
    },
    purpose: {
      type: DataTypes.ENUM('verification', 'password_reset'),
      defaultValue: 'verification',
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'otps',
    timestamps: true,
  },
);

export default Otp;
