import { Association, DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequlze';
import Category from './category.model';
import PaymentType from './paymentType.model';
import User from './user.model';

export interface LedgersAttributes {
  id?: number;
  userId: number;
  categoryId: number;
  paymentTypeId?: number;
  date: Date;
  content: string;
  amount: number;
}

export default class Ledger extends Model<LedgersAttributes> implements LedgersAttributes {
  id?: number;
  userId!: number;
  categoryId!: number;
  paymentTypeId!: number;
  date!: Date;
  content!: string;
  amount!: number;

  user?: User;
  category?: Category;
  paymentType?: PaymentType;
  public static associations: {
    category: Association<Ledger, Category>,
    user: Association<Ledger, User>
  }
}

export const LedgerSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  paymentTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

