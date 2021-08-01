const route = require("express").Router();
const { checkAuth, escapeBadHTML } = require("../utils");
const Card = require("../models/Card");

// Special functions and routes
route.post("/add", checkAuth, async (req, res) => {
  const {question, answer} = req.body;
  const q = escapeBadHTML(question);
  const a = escapeBadHTML(answer);
  const id = String(req.user["_id"]);
  const card = new Card({
      question: q,
      answer: a,
      userId: id,
  });
  await card.save();
  res.redirect("/");
});

route.get("/cards", checkAuth, async (req, res) => {
  const {_id: userID} = req.user;
  const id = String(userID);
  const {offset, limit} = req.query;
  // db.cards.find({"userId": "60ef53e36aeacb29449d917a"}, {question: 1, answer: 1}).sort({"_id": -1}).skip(1).limit(3)
  const result = await Card.aggregate([{$match: {"userId": id}}, {$sort: {"_id": -1}}, {$skip: Number(offset) || 0}, {$limit: Number(limit) || 10}, {$project: {question: 1, answer: 1}}]);
  const count = await Card.countDocuments({"userId": id});
  const finalResult = {
      data: result,
      isCompleted: (offset + limit) >= count,
  }
  res.json(finalResult);
});

route.post("/delete", checkAuth, async (req, res) => {
  await Card.deleteOne({_id: req.body.data});
  res.json({success: true});
});

route.post("/edit", checkAuth, async (req, res) => {
  const {id, answer, question} = req.body;
  await Card.updateOne({_id: id}, {answer, question});
  res.json({success: true});
});

module.exports = route;