const express = require("express");

const {
    getOrganizations,
    createOrganization,
    getOrganization,
    deleteOrganization,
} = require("../controllers/organization.controller");

const router = express.Router();

router.get("/", getOrganizations);
router.post("/", createOrganization);
router.get("/:id", getOrganization);
router.delete("/:id", deleteOrganization);

module.exports = router;