const classificationMapping = (className) => {
    const fruitKeywords = ['apple', 'banana', 'orange', 'berry', 'fruit', 'mango', 'pear', 'peach', 'plum', 'grape', 'cherry'];
    const vegetableKeywords = ['carrot', 'lettuce', 'broccoli', 'vegetable', 'tomato', 'cucumber', 'pepper', 'spinach', 'potato', 'onion'];
    const grainKeywords = ['rice', 'wheat', 'bread', 'grain', 'corn', 'oats', 'barley'];
  
    const classNameLower = className.toLowerCase();
    console.log('Class Name Lower:', classNameLower); // Debug log
  
    if (fruitKeywords.some(keyword => classNameLower.includes(keyword))) {
      console.log('Mapped Category: fruit'); // Debug log
      return 'fruit';
    } else if (vegetableKeywords.some(keyword => classNameLower.includes(keyword))) {
      console.log('Mapped Category: vegetable'); // Debug log
      return 'vegetable';
    } else if (grainKeywords.some(keyword => classNameLower.includes(keyword))) {
      console.log('Mapped Category: grain'); // Debug log
      return 'grain';
    } else {
      console.log('Mapped Category: other'); // Debug log
      return 'other';
    }
  };
  
  export default classificationMapping;
  