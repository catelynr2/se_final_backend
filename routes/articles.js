const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  createArticle,
  getArticles,
  deleteArticle,
} = require("../controllers/articles");

// Create
router.post("/", authMiddleware, createArticle);

// Read
router.get("/", getArticles);

// Delete
router.delete("/:itemId", authMiddleware, deleteArticle);
router.delete("/:itemId/likes", authMiddleware);

module.exports = router;
