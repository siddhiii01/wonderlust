//console.log("Calender", window.disabledDate)
flatpickr("#checkin", {
    dateFormat: "Y-m-d",
    minDate: "today",
    disable: window.disabledDate,
    onChange: function(selectedDates) {
      if (selectedDates.length > 0) {
        // set checkout's minDate to checkin date
        checkoutPicker.set("minDate", selectedDates[0]);
      }
    }
  });

  const checkoutPicker = flatpickr("#checkout", {
    dateFormat: "Y-m-d",
    minDate: "today",
    disable: window.disabledDate,
  });