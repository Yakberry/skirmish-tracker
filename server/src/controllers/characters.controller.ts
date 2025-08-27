import { Request, Response } from 'express';
import { Character } from '../models/Character';
import { CreateCharacterRequest } from '../types';

export const createCharacter = async (
  req: Request<{}, {}, CreateCharacterRequest>,
  res: Response
): Promise<void> => {
  try {
    const character = await Character.create(req.body);
    res.status(201).json(character);
  } catch (error) {
    console.error('Error creating character:', error);
    res.status(500).json({ error: 'Failed to create character' });
  }
};

export const getCharacters = async (req: Request, res: Response): Promise<void> => {
  try {
    const characters = await Character.findAll();
    res.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
};

export const getCharacter = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const character = await Character.findByPk(req.params.id);
    if (character) {
      res.json(character);
    } else {
      res.status(404).json({ error: 'Character not found' });
    }
  } catch (error) {
    console.error('Error fetching character:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
};

export const updateCharacter = async (
  req: Request<{ id: string }, {}, Partial<CreateCharacterRequest>>,
  res: Response
): Promise<void> => {
  try {
    const character = await Character.findByPk(req.params.id);
    if (character) {
      await character.update(req.body);
      res.json(character);
    } else {
      res.status(404).json({ error: 'Character not found' });
    }
  } catch (error) {
    console.error('Error updating character:', error);
    res.status(500).json({ error: 'Failed to update character' });
  }
};

export const deleteCharacter = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const character = await Character.findByPk(req.params.id);
    if (character) {
      await character.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Character not found' });
    }
  } catch (error) {
    console.error('Error deleting character:', error);
    res.status(500).json({ error: 'Failed to delete character' });
  }
};
