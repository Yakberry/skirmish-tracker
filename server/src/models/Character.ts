import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface CharacterAttributes {
  id: string;
  name: string;
  health: number;
  fatigue: number;
  water: number;
  earth: number;
  fire: number;
  air: number;
  void: number;
  skills: Record<string, number>;
}

interface CharacterCreationAttributes extends Optional<CharacterAttributes, 'id' | 'skills'> {}

export class Character extends Model<CharacterAttributes, CharacterCreationAttributes>
  implements CharacterAttributes {
  public id!: string;
  public name!: string;
  public health!: number;
  public fatigue!: number;
  public water!: number;
  public earth!: number;
  public fire!: number;
  public air!: number;
  public void!: number;
  public skills!: Record<string, number>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initCharacter = (sequelize: Sequelize) => {
  Character.init(
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
      health: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fatigue: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      water: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      earth: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fire: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      air: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      void: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      skills: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
    },
    {
      tableName: 'characters',
      sequelize,
    }
  );

  return Character;
};
