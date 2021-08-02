import Ledger from './ledger.model';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequlze';

export interface UsersAttributes {
  id?: number;
  gitUsername: string;
  avatarURL: string;
  refreshToken?: string;
}

export class User extends Model<UsersAttributes> {}

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

export default User;
