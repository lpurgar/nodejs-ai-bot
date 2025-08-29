const express = require("express");

const {
    authenticate,
    authorizeRole,
} = require("../middlewares/auth.middleware");
const {
    getAllConversations,
    createConversation,
    getConversation,
    deleteConversation,
} = require("../controllers/conversation.controller");

const router = express.Router();

router.use(authenticate);

router.get("/", getAllConversations);
router.post("/", createConversation);
router.get("/latest", getConversation);
router.delete("/:id", deleteConversation);

module.exports = router;