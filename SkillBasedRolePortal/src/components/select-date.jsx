import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function SelectDate() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Define a style object for the DatePicker
  const datePickerStyle = {
    border: '1px solid #dee2e6',
    borderRadius: '0.25rem',
  };

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy" // Customize the date format as needed
        isClearable
        placeholderText="Select a date"
        className="my-datepicker" // Apply a custom CSS class
        style={datePickerStyle} // Apply inline styles using the style prop
      />
      {selectedDate && (
        <p>Selected Date: {selectedDate.toLocaleDateString('en-GB')}</p>
      )}
    </div>
  );
}

export default SelectDate;
