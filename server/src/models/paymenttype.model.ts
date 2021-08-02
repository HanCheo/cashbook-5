import { DataTypes, Model, Optional } from "sequelize";
import sequelize from '../db/sequlze';

export interface PaymentTypeAttributes {
    id?: number;
    userId: number;
    name: string;
    bgColor: string;
    fontColor: string;
    isDeleted?: boolean;
}

export interface PaymentTypeCreationAttributes extends Optional<PaymentTypeAttributes, "id"> { }

export default class PaymentType extends Model<PaymentTypeAttributes, PaymentTypeCreationAttributes> implements PaymentTypeAttributes {
    id?: number;
    userId!: number;
    name!: string;
    bgColor!: string;
    fontColor!: string;
    isDeleted!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


export const PaymentTypeSchema = {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bgColor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fontColor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
};

export const PaymentTypeSchemaSetting = {
    sequelize,
    modelName: 'paymentType',
    tableName: 'paymentTypes',
    freezeTableName: true,
    timestamps: true,
};