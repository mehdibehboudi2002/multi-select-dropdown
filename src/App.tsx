import MultiSelectDropdown from './components/MultiSelectDropdown/MultiSelectDropdown';
import './App.scss';

function App() {
  return (
    <div className="app">
      <div className="container">
        <h1>Multi-Select Dropdown</h1>
        <p className="subtitle">Search, select, and add custom categories!</p>

        <MultiSelectDropdown enableSelectAll={true} placeholder="Select Categories..." searchPlaceholder="Search or type to add..." />
      </div>
    </div>
  );
}

export default App;