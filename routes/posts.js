var express = require('express');
const checkAuth = require('../auth/checkAuth');
var router = express.Router();
const models = require('../models');

/* GET posts. */
router.get('/', async (req, res) => {
  const posts = await models.Post.findAll({
    include: [{ model: models.User, attributes: ['username', 'id'] }],
  });

  res.json(posts);
});

router.post('/', checkAuth, async (req, res) => {
  // if any fields missing
  if (!req.body.title || !req.body.content) {
    //   send 400 error
    return req.status(400).json({
      error: 'Please include all title and content',
    });
  }

  // create new post
  const post = await models.Post.create({
    title: req.body.title,
    content: req.body.content,
    UserId: req.session.user.id,
  });

  // send back new post data
  res.status(201).json(post);
});

module.exports = router;
