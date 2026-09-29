import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/connectionDb.js";

// 1) LA CLASE: "el usuario X sigue el libro Y"
export class Subscription extends Model {
  declare id: number;
  declare userId: number;
  declare bookId: number;
  declare createdAt: Date;
}

// 2) LA TABLA
Subscription.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    bookId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: "subscriptions",
    updatedAt: false, // una suscripción no se edita
    // no se puede repetir la misma combinación usuario + libro
    indexes: [{ unique: true, fields: ["userId", "bookId"] }],
  },
);
