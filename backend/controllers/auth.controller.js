const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const { Log } = require("../models");

exports.register = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Missing fields" });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
        return res
            .status(409)
            .json({ error: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.SALT) || 10
    );

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || "USER",
    });

    await Log.create({
        action: "Create",
        userId: newUser.id,
        table: User.tableName,
    });

    const jsonResponse = {
        message: "User registered",
        user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
        },
    };

    res.status(201).json(jsonResponse);
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
        return res
            .status(401)
            .json({ error: "User with this email does not exist" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || "1h" }
    );

    await Log.create({
        action: "Login",
        userId: user.id,
        table: User.tableName,
    });

    res.json({ message: "Logged in", token, role: user.role });
};