// // backend/controllers/ruleController.js
// const Node = require('../models/Rule');

// // Function to parse a rule string and generate AST
// {/*const create_rule = (rule_string) => {
//   // This is a parser to generate AST from rule_string
//   const parse = (str) => {
//     //const upperStr = str.toUpperCase(); // Convert to uppercase for uniformity

//     // Handle AND and OR operators
//     if (str.includes('AND')) {
//       const parts = str.split('AND');
//       return new Node('operator', parse(parts[0].trim()), parse(parts[1].trim()), 'AND');
//     } else if (str.includes('OR')) {
//       const parts = str.split('OR');
//       return new Node('operator', parse(parts[0].trim()), parse(parts[1].trim()), 'OR');
//     } else {
//       // Operand node: Parse attribute, operator, and value from conditions like 'AGE > 30'
//       // Regex to match 'attribute operator value' pattern, with optional quotes around value
//       const condition = str.match(/([A-Z]+)\s*(>|<|=)\s*['"]?([\w\s]+)['"]?/);

//       // Check if the condition matches the expected format
//       if (condition) {
//         const [, attribute, operator, value] = condition;
//         return new Node('operand', null, null, [attribute, operator, value.trim()]);
//       } else {
//         console.error('Invalid condition format:', str);
//         return null; // Handle invalid formats
//       }
//     }
//   };

//   return parse(rule_string);
// };
// */}

// const create_rule = (rule_string) => {
//   const parse = (str) => {
//     const upperStr = str.toUpperCase(); // Convert to uppercase for uniformity

//     // Handle AND and OR operators
//     if (upperStr.includes('AND')) {
//       const parts = upperStr.split('AND');
//       return new Node('operator', parse(parts[0].trim()), parse(parts[1].trim()), 'AND');
//     } else if (upperStr.includes('OR')) {
//       const parts = upperStr.split('OR');
//       return new Node('operator', parse(parts[0].trim()), parse(parts[1].trim()), 'OR');
//     } else {
//       const condition = upperStr.match(/([A-Z]+)\s*(>|<|=)\s*['"]?([\w\s]+)['"]?/);

//       if (condition) {
//         const [, attribute, operator, value] = condition;
//         return new Node('operand', null, null, [attribute, operator, value.trim()]);
//       } else {
//         console.error('Invalid condition format:', str);
//         return null;
//       }
//     }
//   };

//   return parse(rule_string);
// };


// // Function to combine multiple rules
// const combine_rules = (rules) => {
//   if (rules.length === 0) return null;

//   let combinedAST = null;

//   rules.forEach((rule) => {
//     const ruleAST = create_rule(rule);
//     if (ruleAST) {
//       if (!combinedAST) {
//         combinedAST = ruleAST;
//       } else {
//         combinedAST = new Node('operator', combinedAST, ruleAST, 'AND');
//       }
//     } else {
//       console.error(`Skipping invalid rule: ${rule}`);
//     }
//   });

//   return combinedAST;
// };

// // Function to evaluate a rule based on data
// const evaluate_rule = (ast, data) => {
//   if (ast.type === 'operand') {
//     const [attr, operator, value] = ast.value;
//     console.log(attr);
//     // Check if the data attribute exists and handle undefined case
//     if (attr === undefined) {
//       console.log(`Attribute ${attr} not found in data`);
//       return false; // or handle as needed, e.g., treat undefined attributes as false
//     }

//     console.log(`Evaluating: ${attr} ${operator} ${value} with data: ${data[attr]}`);

//     if (operator === '>') return data[attr] > Number(value);
//     if (operator === '<') return data[attr] < Number(value);
//     if (operator === '=') return data[attr].toUpperCase() === value.toUpperCase();
//   } else if (ast.type === 'operator') {
//     const leftResult = evaluate_rule(ast.left, data);
//     const rightResult = evaluate_rule(ast.right, data);

//     console.log(`Operator ${ast.value}: Left result is ${leftResult}, Right result is ${rightResult}`);

//     if (ast.value === 'AND') return leftResult && rightResult;
//     if (ast.value === 'OR') return leftResult || rightResult;
//   }
//   return false;
// };


// module.exports = { create_rule, combine_rules, evaluate_rule };
const Node = require('../models/Rule');

// Function to parse a rule string and generate AST
const create_rule = (rule_string) => {
  const parse = (str) => {
    const upperStr = str.toUpperCase(); // Case insensitive

    if (upperStr.includes('AND')) {
      const parts = upperStr.split('AND');
      return new Node('operator', parse(parts[0].trim()), parse(parts[1].trim()), 'AND');
    } else if (upperStr.includes('OR')) {
      const parts = upperStr.split('OR');
      return new Node('operator', parse(parts[0].trim()), parse(parts[1].trim()), 'OR');
    } else {
      const condition = upperStr.match(/([A-Z]+)\s*(>|<|=)\s*['"]?([\w\s]+)['"]?/);

      if (condition) {
        const [, attribute, operator, value] = condition;
        return new Node('operand', null, null, [attribute, operator, value.trim()]);
      } else {
        console.error('Invalid condition format:', str);
        return null;
      }
    }
  };

  return parse(rule_string);
};

// Combine multiple rules into an AST with AND operators
const combine_rules = (rules) => {
  if (rules.length === 0) return null;

  let combinedAST = null;

  rules.forEach((rule) => {
    const ruleAST = create_rule(rule);
    if (ruleAST) {
      if (!combinedAST) {
        combinedAST = ruleAST;
      } else {
        combinedAST = new Node('operator', combinedAST, ruleAST, 'AND');
      }
    } else {
      console.error(`Skipping invalid rule: ${rule}`);
    }
  });

  return combinedAST;
};

// Evaluate rule AST
const evaluate_rule = (ast, data) => {
  if (!ast) {
    console.log('AST node is null');
    return false;
  }

  if (ast.type === 'operand') {
    const [attr, operator, value] = ast.value;

    if (!attr) {
      console.log(`Invalid condition: ${attr} is undefined.`);
      return false;
    }

    const dataAttr = data[attr.toLowerCase()];
    console.log(dataAttr);
    console.log(`Evaluating: ${attr} ${operator} ${value} with data: ${attr.toLowerCase()}`);

    if (operator === '>') return dataAttr !== undefined && data[attr.toLowerCase()] > Number(value);
    if (operator === '<') return dataAttr !== undefined && data[attr.toLowerCase()] < Number(value);
    if (operator === '=') return dataAttr !== undefined && data[attr.toLowerCase()].toString().toUpperCase() === value.toUpperCase();
  } else if (ast.type === 'operator') {
    const leftResult = ast.left ? evaluate_rule(ast.left, data) : false;
    const rightResult = ast.right ? evaluate_rule(ast.right, data) : false;

    console.log(`Operator ${ast.value}: Left result is ${leftResult}, Right result is ${rightResult}`);

    if (ast.value === 'AND') return leftResult && rightResult;
    if (ast.value === 'OR') return leftResult || rightResult;
  }

  return false;
};


module.exports = { create_rule, combine_rules, evaluate_rule };
