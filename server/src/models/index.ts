import { Sequelize } from 'sequelize';
import { initCharacter } from './Character';
import { initCondition } from './Condition';
import { initStance } from './Stance';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log, // Можно заменить на false в продакшене
});

// Инициализация моделей
const Character = initCharacter(sequelize);
const Condition = initCondition(sequelize);
const Stance = initStance(sequelize);

// Определение связей между моделями (при необходимости)
// Character.hasMany(Condition);
// Condition.belongsTo(Character);

export { sequelize, Character, Condition, Stance };
