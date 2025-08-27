import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface StanceAttributes {
  id: string;
  name: string;
  description: string;
  effect: string;
}

interface StanceCreationAttributes extends Optional<StanceAttributes, 'id'> {}

export class Stance extends Model<StanceAttributes, StanceCreationAttributes>
  implements StanceAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public effect!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initStance = (sequelize: Sequelize) => {
  Stance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      effect: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'Stances',
      sequelize,
    }
  );

  return Stance;
};
