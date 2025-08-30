const express = require("express");

const {
    getAllConversations,
    createConversation,
    getConversation,
    deleteConversation,
} = require("../controllers/conversation.controller");

const router = express.Router();

router.get("/", getAllConversations);
router.post("/", createConversation);
router.get("/latest", getConversation);
router.delete("/:id", deleteConversation);

module.exports = router;