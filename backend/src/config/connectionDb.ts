import { Sequelize } from "sequelize";

//PATRON SINGLETON
export class Database {
  public static instance: Database;
  private sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize(
      process.env.DB_NAME!,
      process.env.DB_USER!,
      process.env.DB_PASSWORD!,
      {
        host: "localhost",
        dialect: process.env.DB_DIALECT as any,
      },
    );
  }

  static getInstance(): Database {
    if (!this.instance) return (this.instance = new Database());
    return this.instance;
  }

  public getConnection(): Sequelize {
    return this.sequelize;
  }

  public async testConnection(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(
        "An unexpected error occurred while connecting to the database.",
      );
    }
  }
}
