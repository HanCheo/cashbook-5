import User, { UserSchema, UserSchemaSettings } from './user.model';
import Ledger, { LedgerSchema, LedgerSchemaSetting } from './ledger.model';
import Category, { CategorySchema, CategorySchemaSettings } from './category.model';
import PaymentType, { PaymentTypeSchema, PaymentTypeSchemaSetting } from './paymenttype.model';

export default () => {
  User.init(UserSchema, UserSchemaSettings);
  Ledger.init(LedgerSchema, LedgerSchemaSetting);
  Category.init(CategorySchema, CategorySchemaSettings);
  PaymentType.init(PaymentTypeSchema, PaymentTypeSchemaSetting);
  InitReleations();
};

const InitReleations = () => {
  User.hasMany(Ledger, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'ledgers',
  });

  Ledger.belongsTo(User, {
    targetKey: 'id',
    as: 'user',
  });

  Category.hasMany(Ledger, {
    sourceKey: 'id',
    foreignKey: 'categoryId',
    as: 'ledgers',
  });

  Ledger.belongsTo(Category, {
    targetKey: 'id',
    as: 'category',
  });

  PaymentType.hasMany(Ledger, {
    sourceKey: 'id',
    foreignKey: 'paymentTypeId',
  });

  Ledger.belongsTo(PaymentType, {
    targetKey: 'id',
    as: 'paymentType',
  });

  User.hasMany(PaymentType, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'paymentTypes',
  });
};
