import { Model, DataTypes } from "sequelize";
import { Permission } from "./permission.model.js";
import { sequelize } from "../config/connectionDb.js";

export class Role extends Model {
  declare id: number;
  declare name: string;

  declare permissions?: Permission[];

  // Sequelize genera este método en runtime por el belongsToMany
  // de associations.model.ts, pero no lo declara en los tipos
  declare setPermissions: (permissions: Permission[]) => Promise<void>;
}

Role.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { sequelize, tableName: "roles", timestamps: false },
);
