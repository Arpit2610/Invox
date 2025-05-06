const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const crypto = require('crypto');


router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log('Received signup request:', { name, email, role }); 

        
        if (!name || !email || !password || !role) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

   
        user = new User({
            name,
            email,
            password,
            role: role.toLowerCase() 
        });

      
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        console.log('User saved successfully with role:', user.role); 

        res.status(201).json({
            msg: 'Registration successful',
            role: user.role
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ msg: 'Server error during registration' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        
        if (role && user.role !== role) {
            return res.status(403).json({ msg: `Invalid login. Please use ${role} login.` });
        }

       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email
            }
        };

       
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email with reset link
        // Note: You'll need to set up an email service (like nodemailer)
        // This is a placeholder for the email sending logic
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        
        // Send email logic here
        console.log('Reset URL:', resetUrl);

        res.json({ message: 'Password reset link sent to email' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Error in forgot password process' });
    }
});

module.exports = router;
