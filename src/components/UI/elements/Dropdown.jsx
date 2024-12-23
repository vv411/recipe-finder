import React from 'react';

const Dropdown = ({ value, onChange, options, defaultLabel }) => (
  <select value={value} onChange={onChange} className="custom-dropdown">
    <option value="">{defaultLabel}</option>
    {options.map((option) => (
      <option key={option.id} value={option.id}>
        {option.strCategory || option.strArea} {/* Dynamically render the label */}
      </option>
    ))}
  </select>
);

export default Dropdown;