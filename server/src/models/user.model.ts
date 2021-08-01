import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db/sequlze';

export interface UsersAttributes {
  id?: number;
  name: string;
  avatarURL: string;
  accessToken: string;
}

export class User extends Model<UsersAttributes> {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    accessToken: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(50),
      defaultValue: '',
    },
    avatarURL: {
      type: DataTypes.STRING(255),
      defaultValue: '',
    },
  },
  {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    freezeTableName: true,
    timestamps: true,
  }
);
