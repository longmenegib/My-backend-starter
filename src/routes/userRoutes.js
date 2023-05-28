
import { getUsers, createUser, getUserById, updateUser, deleteUser }  from '../controllers/userController.js';

import express from "express";


const router = express.Router();

// Define your routes
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
