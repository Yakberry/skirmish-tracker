import { sequelize } from './models';
import { Condition } from './models/Condition';
import { Stance } from './models/Stance';

export const initializeDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Connection to SQLite database has been established successfully.');

    // Синхронизируем модели с базой данных
    await sequelize.sync({ force: false }); // Используйте { force: true } только в разработке для пересоздания таблиц

    // Заполняем базу начальными данными (если нужно)
    await seedDatabase();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

const seedDatabase = async (): Promise<void> => {
  // Проверяем, есть ли уже данные в таблицах
  const conditionCount = await Condition.count();
  const stanceCount = await Stance.count();

  if (conditionCount === 0) {
    // Добавляем базовые состояния
    await Condition.bulkCreate([
      {
        name: 'Ослеплён',
        description: 'Персонаж не может совершать атаки дальнего боя',
        effect: 'cannotRangedAttack'
      },
      {
        name: 'Оглушён',
        description: 'Персонаж теряет действие в раунде',
        effect: 'loseAction'
      },
      // Другие состояния...
    ]);
  }

  if (stanceCount === 0) {
    // Добавляем базовые стойки
    await Stance.bulkCreate([
      {
        name: 'Стойка Земли',
        description: 'Могучая и непоколебимая',
        effect: 'earthStance'
      },
      {
        name: 'Стойка Воды',
        description: 'Гибкая и методичная',
        effect: 'waterStance'
      },
      {
        name: 'Стойка Огня',
        description: 'Яростная и напористая',
        effect: 'fireStance'
      },
      {
        name: 'Стойка Воздуха',
        description: 'Быстрая и коварная',
        effect: 'airStance'
      },
      {
        name: 'Стойка Пустоты',
        description: 'Отрешённая и сосредоточенная',
        effect: 'voidStance'
      }
    ]);
  }
};
