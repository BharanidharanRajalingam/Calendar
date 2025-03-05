import { useState } from 'react';
import Calendar from './component/Calendar';
import './App.css';

function App() {
  const [view, setView] = useState('month');
  
  const handleViewChange = (newView) => {
    console.log('App: View changed to:', newView);
    setView(newView);
  };
  
  return (
    <div className="app-container" style={{ height: '100vh', width: '100%', padding: '20px' }}>
      <div style={{ height: 'calc(100% - 60px)', width: '100%' }}>
        <Calendar title="Your Todo's" initialView={view} />
      </div>
    </div>
  );
}

export default App;
