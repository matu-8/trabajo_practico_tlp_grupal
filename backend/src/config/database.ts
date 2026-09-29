import { Sequelize } from "sequelize";

interface IConnectDb {}

class ConnectionDb {}

//falta validar que las variables de entorno no lleguen vacias, bajo la premicia de ! pueden venir como undefined
export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: "localhost",
    dialect: process.env.DB_DIALECT as any,
  },
);
