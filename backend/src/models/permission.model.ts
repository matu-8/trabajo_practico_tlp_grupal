import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/connectionDb.js";

// 1) LA CLASE: qué datos tiene un permiso
export class Permission extends Model {
  declare id: number;
  declare name: string;
}

// 2) LA TABLA: cómo se guardan esos datos en PostgreSQL
Permission.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { sequelize, tableName: "permissions", timestamps: false },
);
