import { Router } from 'express';
import {
  createCharacter,
  getCharacters,
  getCharacter,
  updateCharacter,
  deleteCharacter,
} from '../controllers/characters.controller';

const router = Router();

router.post('/', createCharacter);
router.get('/', getCharacters);
router.get('/:id', getCharacter);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

export default router;
