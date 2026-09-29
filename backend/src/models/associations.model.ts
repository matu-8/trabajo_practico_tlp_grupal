// models/associations.ts
import { User } from './user.model.js';
import { Role } from './Role.model.js';
import { Permission } from './permission.model.js';
import { Subscription } from './Suscription.model.js';
import { Book } from './Book.model.js';
import { NotificationModel } from './notification.model.js';



export function setupAssociations(): void {

  Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
  User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

  Role.belongsToMany(Permission, {
    through: 'role_permissions',
    foreignKey: 'roleId',
    otherKey: 'permissionId',
    as: 'permissions',
    timestamps: false,
  });
  Permission.belongsToMany(Role, {
    through: 'role_permissions',
    foreignKey: 'permissionId',
    otherKey: 'roleId',
    as: 'roles',
    timestamps: false,
  });

  
  User.hasMany(Subscription, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Book.hasMany(Subscription, { foreignKey: 'bookId', onDelete: 'CASCADE' });
  Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Subscription.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

  
  User.hasMany(NotificationModel, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Book.hasMany(NotificationModel, { foreignKey: 'bookId', onDelete: 'CASCADE' });
  NotificationModel.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  NotificationModel.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });
}