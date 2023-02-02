import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

const persons = [
  {
    id: 1,
    name: 'Matti meikäläinen',
    number: '123 321'
  }
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <App persons={persons} />
)
