import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface CharacterAttributes {
  id: string;
  name: string;
  strife: number;
  maxStrife: number;
  stance: string;
  water: number;
  earth: number;
  fire: number;
  air: number;
  void: number;
  initiative: number;
  defaultInitiative: number;
  conditions: string[];
  notes: string;
  created_at: Date;
  updated_at: Date;
}

interface CharacterCreationAttributes extends Optional<CharacterAttributes,
  'id' | 'name' | 'strife' | 'maxStrife' | 'stance' | 'conditions' | 'notes' |
  'created_at' | 'updated_at'> {}

export class Character extends Model<CharacterAttributes, CharacterCreationAttributes>
  implements CharacterAttributes {
  public id!: string;
  public name!: string;
  public strife!: number;
  public maxStrife!: number;
  public stance!: string;
  public water!: number;
  public earth!: number;
  public fire!: number;
  public air!: number;
  public void!: number;
  public initiative!: number;
  public defaultInitiative!: number;
  public conditions!: string[];
  public notes!: string;
  public created_at!: Date;
  public updated_at!: Date;
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
      strife: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      maxStrife: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        allowNull: false,
      },
      stance: {
        type: DataTypes.STRING,
        defaultValue: 'water',
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
      initiative: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      defaultInitiative: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      conditions: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        defaultValue: '',
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      tableName: 'characters',
      sequelize,
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Character;
};
