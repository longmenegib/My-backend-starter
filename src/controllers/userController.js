import dbConnect from '../lib/mongodb.js';
import generateJWT from '../middleware/generatetoken.js';
import User from '../models/user.js'
import bcrypt from 'bcrypt';
import authenticate from '../middleware/authenticate.js';

// Get all users
async function getUsers(req, res) {
    res.setHeader('Content-Type', 'application/json');
    if (authenticate(req, res)) {
        await dbConnect();
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }else{
        res.status(401).json({ success: false, message: "Unuthorized access" });
    }
}

// Create a new user
async function createUser(req, res) {
    const { email, password, name } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }

        // Generate salt for hashing
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            name,
        });
        await newUser.save();

        //login the user
        const user = await User.findOne({ email });
        // Create and send token
        let token_id = generateJWT({ email: user.email, id: user._id });
        res.status(201).json({ user: user, token: token_id, message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
}

// Get a user by ID
async function getUserById(req, res) {
    try {
        const { id } = req.params;

        await dbConnect();
        const user = await User.findOne({ _id: id });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(user);
        }
    } catch (error) {
        console.error('Error fetching user', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update a user
async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        await dbConnect();
        const result = await User.updateOne({ _id: id }, { $set: { name, email } });

        if (result.modifiedCount === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User updated successfully' });
        }
    } catch (error) {
        console.error('Error updating user', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete a user
async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        await dbConnect();
        const result = await User.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting user', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
};

