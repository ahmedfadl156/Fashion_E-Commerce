const User = require('../Models/userModel');  
const jwt = require('jsonwebtoken');


exports.getall = async (req , res) => {
    try{
        const users = await User.find()
        res.json(users);
    }catch(error){
        res.json('No Users Found!');
    }
}

exports.delete = async (req , res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            res.json("Cant Find The User!");
        }
    }catch(error){
        res.json('There Is Error While Delete User!');
    }
}

exports.add = async (req, res) => {
    try {
        const {username, email, password , role} = req.body;

        console.log("Registration attempt with:", { username, email });

        if (!username || !email || !password || !role) {
            return res.status(400).json({message: "All fields are required"});
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        const newUser = new User({username, email, password , role});
        await newUser.save();
        
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables");
            return res.status(500).json({message: "Server configuration error"});
        }
        
        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: '24h'});
        
        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({message: "There is an error while registering the user"});
    }
};

exports.register = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        console.log("Registration attempt with:", { username, email , password });

        if (!username || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        const newUser = new User({username, email, password});
        await newUser.save();
        
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables");
            return res.status(500).json({message: "Server configuration error"});
        }
        
        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: '24h'});
        
        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({message: "There is an error while registering the user"});
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password , role} = req.body;
        
        console.log("Login attempt for:", email);
        
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({message: "Email or password is incorrect"});
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({message: "Email or password is incorrect"});
        }
        
        if (!process.env.JWT_SECRET || !process.env.JWT_SECRET.length) {
            console.error("JWT_SECRET is not defined in environment variables");
            return res.status(500).json({message: "Server configuration error"});
        }
        
        const token = jwt.sign(
            {userId: user._id , role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );
        
        res.json({
            token,
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({message: 'There was an error logging in'});
    }
};

