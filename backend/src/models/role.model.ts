import { Model, DataTypes } from 'sequelize';
import { Permission } from './permission.model.js'
import {sequelize} from "../config/database.js"

export class Role extends Model {
  declare id: number;
  declare name: string; 

  declare permissions?: Permission[];
}

Role.init(
  {
    id:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { sequelize, tableName: 'roles', timestamps: false }
);