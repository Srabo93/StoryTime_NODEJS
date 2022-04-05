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
module.exports = router;
