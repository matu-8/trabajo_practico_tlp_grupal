import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/connectionDb.js";

export type BookStatus = "DISPONIBLE" | "PRESTADO" | "EN_REPARACION";

export class Book extends Model {
  declare id: number;
  declare title: string;
  declare author: string;
  declare description: string;
  declare status: BookStatus;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Book.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("DISPONIBLE", "PRESTADO", "EN_REPARACION"),
      allowNull: false,
      defaultValue: "DISPONIBLE",
    },
  },
  { sequelize, tableName: "books" },
);
