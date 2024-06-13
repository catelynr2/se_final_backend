const Article = require("../models/article");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");

const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => {
      res.send({ data: article });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError(e.message));
      } else {
        next(e);
      }
    });
};

const getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => {
      res.send(articles);
    })
    .catch((e) => {
      next(e);
    });
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findById(articleId)
    .orFail()
    .then((article) => {
      if (String(article.owner) !== req.user._id) {
        throw new ForbiddenError("Forbidden Error");
      }
      return article
        .deleteOne()
        .then(() => res.send({ message: "Item deleted." }));
    })

    .catch((e) => {
      if (e.name === "CastError") {
        next(new BadRequestError(e.message));
      } else if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError(e.message));
      } else {
        next(e);
      }
    });
};

// const likeItem = (req, res, next) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.itemId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true }
//   )
//     .orFail()
//     .then((item) => res.send(item))
//     .catch((e) => {
//       if (e.name === "DocumentNotFoundError") {
//         next(new NotFoundError(e.message));
//       } else if (e.name === "CastError") {
//         next(new BadRequestError(e.message));
//       } else {
//         next(e);
//       }
//     });
// };

// const dislikeItem = (req, res, next) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.itemId,
//     { $pull: { likes: req.user._id } },
//     { new: true }
//   )
//     .orFail()
//     .then((item) => res.send(item))
//     .catch((e) => {
//       if (e.name === "DocumentNotFoundError") {
//         next(new NotFoundError(e.message));
//       } else if (e.name === "CastError") {
//         next(new BadRequestError(e.message));
//       } else {
//         next(e);
//       }
//     });
// };

module.exports = {
  createArticle,
  getArticles,
  deleteArticle,
  // bookmarkArticle,
  // unbookmarkArticle,
};
