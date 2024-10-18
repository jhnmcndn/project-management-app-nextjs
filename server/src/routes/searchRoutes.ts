import { Router } from 'express';
import { search } from '../controllers/serchController';

const router = Router();

router.get('/', search);

export default router;
