import User, { UserSchema, UserSchemaSettings } from './user.model';
import Ledger, { LedgerSchema, LedgerSchemaSetting } from './ledger.model';
import Category, { CategorySchema, CategorySchemaSettings } from './category.model';

export default () => {
  User.init(UserSchema, UserSchemaSettings);
  Ledger.init(LedgerSchema, LedgerSchemaSetting);
  Category.init(CategorySchema, CategorySchemaSettings);

  InitReleations();
};

const InitReleations = () => {
  User.hasMany(Ledger, { foreignKey: 'userId', onUpdate: 'cascade', onDelete: 'cascade' });
  Ledger.belongsTo(User, { foreignKey: 'userId', onUpdate: 'cascade', onDelete: 'cascade' });

  Category.hasMany(Ledger, { foreignKey: 'categoryId', onUpdate: 'cascade', onDelete: 'cascade' });
  Ledger.belongsTo(Category, { foreignKey: 'categoryId', onUpdate: 'cascade', onDelete: 'cascade' });
};
