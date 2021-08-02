import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequlze';

export interface CategorysAttributes {
  id?: number;
  name: string;
  color: string;
}

export class Category extends Model<CategorysAttributes> {}

export const CategorySchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
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
