import { User } from './user.model';
import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db/sequlze';

export interface LedgersAttributes {
  id?: number;
  userId?: number;
  categoryId?: number;
  date: Date;
  content: string;
  amount: number;
}

class Ledger extends Model<LedgersAttributes> {}

export const LedgerSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING(255),
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
};

export const LedgerSchemaSetting = {
  sequelize,
  modelName: 'ledger',
  tableName: 'ledgers',
  freezeTableName: true,
  timestamps: true,
};

export default Ledger;
