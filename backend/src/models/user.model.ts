export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare roleId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare role?: Role;
}

User.init(
  {
    id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:     { type: DataTypes.STRING, allowNull: false },
    email:    { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    roleId:   { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: 'users' }
);