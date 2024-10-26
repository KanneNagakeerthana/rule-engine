// backend/routes/ruleRoutes.js
const express = require('express');
const { create_rule, combine_rules, evaluate_rule } = require('../controllers/ruleController');
const router = express.Router();

router.post('/create', (req, res) => {
  try {
      const ruleString = req.body.rule_string;
      const ast = create_rule(ruleString);
      res.json(ast);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});


router.post('/combine', (req, res) => {
  try {
      const rules = req.body.rules;
      if (!Array.isArray(rules) || rules.length === 0) {
          throw new Error("Missing or invalid rules in the request body. It should be a non-empty array.");
      }
      const combinedAST = combine_rules(rules);
      res.json(combinedAST);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});


router.post('/evaluate', (req, res) => {
  try {
      const { ast, data } = req.body;
      if (!ast || !data) {
          throw new Error("Missing ast or data in the request body.");
      }
      const result = evaluate_rule(ast, data);
      res.json({ result });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

module.exports = router;
