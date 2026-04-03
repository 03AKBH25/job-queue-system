fetch('http://localhost:3000/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({type: 'email', payload: {message: 'test'}, priority: 5})
}).then(res => res.json()).then(console.log).catch(console.error);
