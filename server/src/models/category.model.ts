import { Association, DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequlze';
import Ledger from './ledger.model';

export interface CategorysAttributes {
  id?: number;
  name: string;
  color: string;
}

export class Category extends Model<CategorysAttributes> implements CategorysAttributes {
  public id?: number | undefined;
  public name!: string;
  public color!: string;

  public ledgers?: Ledger[];
  public static associations: {
    ledgers: Association<Category, Ledger>
  }
}

export const CategorySchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  color: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
};

export const CategorySchemaSettings = {
  sequelize,
  modelName: 'category',
  tableName: 'categories',
  freezeTableName: true,
  timestamps: true,
};

export default Category;


