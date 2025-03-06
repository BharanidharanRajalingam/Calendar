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
    <div className="app-container">
      <div className="calendar-wrapper">
        <Calendar initialView={view} onViewChange={handleViewChange} />
      </div>
    </div>
  );
}

export default App;
