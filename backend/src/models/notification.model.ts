import { Model, DataTypes } from 'sequelize';
import {sequelize} from "../config/database.js"
import type { BookStatus } from './Book.model.js'

// 1) LA CLASE: un aviso para un usuario cuando un libro cambia de estado
export class NotificationModel extends Model {
  declare id: number;
  declare userId: number;          // a quién va dirigida
  declare bookId: number;          // de qué libro habla
  declare message: string;
  declare previousStatus: BookStatus;
  declare newStatus: BookStatus;
  declare read: boolean;           // leída o no leída
  declare createdAt: Date;
}

// 2) LA TABLA
NotificationModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    bookId: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    previousStatus: { type: DataTypes.STRING, allowNull: false },
    newStatus: { type: DataTypes.STRING, allowNull: false },
    read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, tableName: 'notifications', updatedAt: false }
);