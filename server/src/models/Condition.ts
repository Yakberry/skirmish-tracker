import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface ConditionAttributes {
  id: string;
  name: string;
  description: string;
  effect: string;
}

interface ConditionCreationAttributes extends Optional<ConditionAttributes, 'id'> {}

export class Condition extends Model<ConditionAttributes, ConditionCreationAttributes>
  implements ConditionAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public effect!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initCondition = (sequelize: Sequelize) => {
  Condition.init(
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
      tableName: 'conditions',
      sequelize,
    }
  );

  return Condition;
};
