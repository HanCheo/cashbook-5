import Ledger from './ledger.model';
import { Association, DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequlze';
import PaymentType from './paymentType.model';

export interface UsersAttributes {
  id?: number;
  gitUsername: string;
  avatarURL: string;
  refreshToken?: string;
}

export default class User extends Model<UsersAttributes> implements UsersAttributes {
  public id?: number | undefined;
  public gitUsername!: string;
  public avatarURL!: string;

  public ledgers?: Ledger[];
  public paymentTypes?: PaymentType[];

  public static associations: {
    ledgers: Association<User, Ledger>,
    paymentTypes: Association<User, PaymentType>
  }
}

export const UserSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  gitUsername: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  avatarURL: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  refreshToken: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
};

export const UserSchemaSettings = {
  sequelize,
  modelName: 'user',
  tableName: 'users',
  freezeTableName: true,
  timestamps: true,
};

