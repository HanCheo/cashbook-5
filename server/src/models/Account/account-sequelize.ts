import { connectDB as connectSequlz, close as closeSequlz } from '../sequlze';
import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import DBG from 'debug';
import AbstractAccountsStore from './AbstractAccountsStore';
import Account from './Account';
const debug = DBG('notes:notes-sequelize');
const error = DBG('notes:error-sequelize');

let sequelize: Sequelize | undefined;

interface AccountAttributes {
  id: string;
  name: string;
}

interface AccountCreationAttributes extends Optional<AccountAttributes, 'id'> {}

export class SQAccount extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
  public id!: string;
  public name!: string;
}

async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSequlz();
  SQAccount.init(
    // Schema
    {
      id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        unique: true,
      },
      name: { type: DataTypes.STRING(255), allowNull: false },
    },
    // Schema
    {
      sequelize,
      modelName: 'SQAccount',
      tableName: 'SQAccount',
    }
  );
  await SQAccount.sync();
  // TODO: When Deploy, change it
  // await sequelize.sync({ alter: true });
}

export default class SequelizeAccountsStore extends AbstractAccountsStore {
  async close() {
    closeSequlz();
    sequelize = undefined;
  }

  async create(id: string, name: string) {
    await connectDB();
    const account = await SQAccount.create({
      id,
      name,
    });
    const _id = account.getDataValue('id');
    const _name = account.getDataValue('name');
    return new Account(_id, _name);
  }

  async get(id: string) {
    await connectDB();
    const account = await SQAccount.findOne<SQAccount>({ where: { id } });
    if (!account) {
      throw new Error(`No note found for ${id}`);
    } else {
      const _id = account.getDataValue('id');
      const _name = account.getDataValue('name');
      return new Account(_id, _name);
    }
  }

  async delete(id: string) {
    await connectDB();
    await SQAccount.destroy({ where: { id } });
  }
}
