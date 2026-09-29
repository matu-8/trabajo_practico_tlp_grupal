import { Model, DataTypes } from 'sequelize';
import type { Permission } from './Permission.js';
import {sequelize} from "../config/database.js"

export class Role extends Model {
  declare id: number;
  declare name: string; // 'admin', 'operador' o 'usuario'

  declare permissions?: Permission[];
}

Role.init(
  {
    id:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { sequelize, tableName: 'roles', timestamps: false }
);