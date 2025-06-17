const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { params } = req;
        const deleted = await User.destroy({ where: { id: params.id } });

        if (!deleted) {
            return res
                .status(404)
                .json({ message: "User not found or not authorized" });
        }

        res.json({ message: `User with id ${params.id} deleted` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};