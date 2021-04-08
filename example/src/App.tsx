import React  from 'react';
import 'react-draggable-order/css/defaultTheme.css';
import './customStyle.css';
import Basic from './Basic';
import Customized from './Customized';
import Advanced from './Advanced';
import ModeOver from './ModeOver';

function App() {
  return <div>
    <h1>React draggable order examples</h1>
    <h2>Basic</h2>
    <Basic />
    <h2>Customized</h2>
    <Customized />
    <h2>Different hover effect</h2>
    <ModeOver />
    <h2>Advanced (using hooks)</h2>
    <Advanced />
  </div>;
}

export default App;
