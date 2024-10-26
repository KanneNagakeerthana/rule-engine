import React, { useState } from 'react';
import axios from 'axios';

const RuleForm = () => {
  const [ruleString, setRuleString] = useState('');
  const [attributes, setAttributes] = useState({
    age: '',
    department: '',
    income: '',
    experience: '',
  });
  const [result, setResult] = useState(null);

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setAttributes((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: ast } = await axios.post('/api/rules/create', { rule_string: ruleString });
      //const { data: ast } = await axios.post('http://localhost:5000/api/rules/create', { rule_string: ruleString });
      console.log('AST received:', ast); 
      const { data: evalResult } = await axios.post('/api/rules/evaluate', { ast, data: attributes });
      console.log('Evaluation Result:', evalResult); 
      setResult(evalResult.result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ruleString}
          onChange={(e) => setRuleString(e.target.value)}
          placeholder="Enter rule string"
        />
        <input
          type="number"
          name="age"
          value={attributes.age}
          onChange={handleAttributeChange}
          placeholder="Enter age"
        />
        <input
          type="text"
          name="department"
          value={attributes.department}
          onChange={handleAttributeChange}
          placeholder="Enter department"
        />
        <input
          type="number"
          name="income"
          value={attributes.salary}
          onChange={handleAttributeChange}
          placeholder="Enter income"
        />
        <input
          type="number"
          name="experience"
          value={attributes.experience}
          onChange={handleAttributeChange}
          placeholder="Enter experience"
        />
        <button type="submit">Evaluate Rule</button>
      </form>
      {console.log('Result State:', result)}
      {result !== null && <p>Result: {result ? 'Eligible' : 'Not Eligible'}</p>}
      
    </div>
  );
};

export default RuleForm;
