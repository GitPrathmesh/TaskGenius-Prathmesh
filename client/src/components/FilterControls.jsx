import React from 'react';



function FilterControls({ currentFilter, onFilterChange }) {
  const filters = ['ALL', 'ACTIVE', 'COMPLETED'];

  return (
    <div className="filter-controls">
      {filters.map((filterName) => (
        <button
          key={filterName}
          className={`filter-btn ${
            currentFilter === filterName ? 'active' : ''
          }`}
          onClick={() => onFilterChange(filterName)}
        >
         
          {filterName.charAt(0) + filterName.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  );
}

export default FilterControls;