const express = require("express");
const { redirect } = require("express/lib/response");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");
/**
 * @desc Show Add page
 * @route GET /stories/add
 */
router.get("/add", ensureAuth, (req, res) => {
  res.render("../views/stories/add.hbs");
});

/**
 * @desc Show Stories page
 * @route GET /stories
 */
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", { stories });
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

/**
 * @desc Show single Story
 * @route GET /stories/:id
 */
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById({ _id: req.params.id })
      .populate("user")
      .lean();
    if (!story) return res.render("error/404");
    res.render("stories/show", { story });
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

/**
 * @desc Process added Story
 * @route POST /stories/
 */
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.render("../views/errors/500");
  }
});
/**
 * @desc Edit a Story
 * @route GET /stories/edit/:id
 */
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();

    if (!story) return res.render("error/404");

    story.user != req.user.id
      ? res.redirect("/stories")
      : res.render("stories/edit", { story });
  } catch (error) {
    console.log(error);
    res.redirect("error/500");
  }
});

/**
 * @desc Update a Story
 * @route PUT /stories/:id
 */
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) return res.render("error/404");

    story.user != req.user.id
      ? res.redirect("/stories")
      : (story = await Story.findOneAndUpdate(
          { _id: req.params.id },
          req.body,
          {
            new: true,
            runValidators: true,
          }
        ));

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.redirect("error/500");
  }
});

/**
 * @desc Delete Story
 * @route DELETE /stories/:id
 */
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.redirect("error/500");
  }
});

/**
 * @desc User Stories
 * @route GET /stories/user/:userId
 */
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    let stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();
    res.render("stories/index", { stories });
  } catch (error) {
    console.log(error);
    res.redirect("error/500");
  }
});
module.exports = router;
