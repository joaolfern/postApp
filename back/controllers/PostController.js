const Post = require("../models/Post");

module.exports = {
  index: async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  store: async (req, res) => {
    const { name, description } = req.body;

    const post = new Post({ name, description });

    try {
      const savedPost = await post.save();
      res.json(savedPost);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  show: async (req, res) => {
    const { match } = req.params;
    const pattern = new RegExp(`${match}`, "ig");

    try {
      const foundRegistry = await Post.find({
        $or: [{ name: { $regex: pattern } }, { description: { $regex: pattern } }]
      });

      res.json(foundRegistry);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  destroy: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedRegistry = await Post.deleteOne({ _id: id });
      res.json(deletedRegistry);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const updatedRegistry = await Post.updateOne(
        { _id: id },
        { $set: { name, description } }
      );
      res.json(updatedRegistry);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
