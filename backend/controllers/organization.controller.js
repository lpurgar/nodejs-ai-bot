const { Organization } = require("../models");

exports.getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.findAll();
        res.json({ data: organizations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.createOrganization = async (req, res) => {
    try {
        const { name, address } = req.body;

        if (req.auth.role !== "ADMIN") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const organization = await Organization.create({
            name,
            address,
        });

        await Log.create({
            action: "Create",
            userId,
            table: Organization.tableName,
        });

        res.status(201).json(organization);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteOrganization = async (req, res) => {
    try {
        const { params } = req;

        if (req.auth.role !== "ADMIN") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const deleted = await Organization.destroy({
            where: { id: params.id },
        });

        if (!deleted) {
            return res.status(404).json({ message: "Organization not found" });
        }

        res.json({ message: `Organization with id ${params.id} deleted` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};