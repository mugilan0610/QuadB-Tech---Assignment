document.addEventListener("DOMContentLoaded", function () {
  // Function to setup a dropdown
  const buyButton = document.getElementById("buyButton");
  function setupDropdown(dropdownClass, items, isBaseCurrency = false) {
    const dropdown = document.querySelector(`.${dropdownClass}`);
    const dropdownToggle = dropdown.querySelector(".dropdown-toggle");
    const dropdownMenu = dropdown.querySelector(".dropdown-menu");

    // Function to create a dropdown item
    function createDropdownItem(item) {
      const a = document.createElement("a");
      a.setAttribute("value", item.value);
      a.setAttribute("tabindex", "0");
      a.setAttribute("role", "menuitem");
      a.classList.add("dropdown-item");
      a.href = item.href;
      a.textContent = item.text;
      return a;
    }

    // Add menu items to the dropdown
    items.forEach((item) => {
      const menuItem = createDropdownItem(item);
      dropdownMenu.appendChild(menuItem);
    });

    // Get all dropdown items after they've been added
    const dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");

    function toggleDropdown() {
      const isExpanded =
        dropdownToggle.getAttribute("aria-expanded") === "true";

      dropdownToggle.setAttribute("aria-expanded", !isExpanded);
      dropdownMenu.classList.toggle("show");
      dropdownMenu.setAttribute("aria-hidden", isExpanded);
    }

    // Toggle dropdown on button click
    dropdownToggle.addEventListener("click", toggleDropdown);

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
      if (!dropdown.contains(event.target)) {
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownMenu.classList.remove("show");
        dropdownMenu.setAttribute("aria-hidden", "true");
      }
    });

    // Handle keyboard navigation
    dropdownToggle.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleDropdown();
      }
    });

    dropdownItems.forEach(function (item, index) {
      item.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          dropdownItems[(index + 1) % dropdownItems.length].focus();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          dropdownItems[
            (index - 1 + dropdownItems.length) % dropdownItems.length
          ].focus();
        } else if (event.key === "Escape") {
          dropdownToggle.focus();
          toggleDropdown();
        }
      });
    });

    // Update button text when an item is selected and change the URL
    dropdownItems.forEach(function (item) {
      item.addEventListener("click", function (event) {
        event.preventDefault();
        dropdownToggle.textContent = this.textContent;
        toggleDropdown();

        if (isBaseCurrency) {
          updateBuyButtonText(this.textContent);
      }
      });
    });
  }

  // Define the menu items for each dropdown
  const cryptoItems = [
    { value: "BTC", text: "BTC", href: "/BTC-INR" },
    { value: "ETH", text: "ETH", href: "/ETH-INR" },
    { value: "XRP", text: "XRP", href: "/XRP-INR" },
  ];

  const fiatItems = [{ value: "INR", text: "INR", href: "/BTC-INR" }];

  // Setup both dropdowns
  setupDropdown('crypto-dropdown', cryptoItems, true);
  setupDropdown("fiat-dropdown", fiatItems);

  // Function to update the "Buy BTC" button text
  function updateBuyButtonText(crypto) {
    buyButton.textContent = `Buy ${crypto}`;
  }
});



//update progress bar

// Call the function to fetch data and render the table

let timerValue = 60; // Initial timer value

const updateProgressBar = () => {
    const progressBar = document.querySelector('.CircularProgressbar-path');
    const timerText = document.querySelector('.CircularProgressbar-text');
    
    // Calculate the dash offset based on the timer value
    const dashOffset = (60 - timerValue) / 60 * 289.027;
    
    progressBar.style.strokeDashoffset = dashOffset;
    timerText.textContent = timerValue;

    // Decrease the timer value
    if (timerValue > 0) {
        timerValue--;
        setTimeout(updateProgressBar, 1000); // Update every second
    } else {
        timerValue = 60; // Reset the timer value
        setTimeout(updateProgressBar, 1000); // Restart the progress bar
    }
};

// Initial call to start the progress bar
updateProgressBar();



// fetch data

// Function to fetch data from the server
const fetchDataFromServer = async () => {
  try {
      const response = await fetch('http://localhost:5000/api/wazirx/');
      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data:', error.message);
  }
};

// Function to generate serial numbers
const generateSerialNumbers = (data) => {
  return data.map((item, index) => {
      return { ...item, serialNumber: index + 1 };
  });
};

const processData = (item) => {
  console.log(item.serialNumber);
  
  let name = item.name
  
  const last = item.last;
  const buy = item.buy;
  const sell = item.sell;
  let diff = ((item.sell - item.buy) * 100 ) / item.buy;
  let saving = (item.sell - item.buy) * item.volume 
  // ans=-0.1434
  return {
    name: name,
    last: last,
    buy: buy,
    sell: sell,
    difference: diff,
    savings: saving
};


}

// Function to render the table rows
const renderTableRows = (data) => {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  data.forEach((item) => {
    const last = item.last;
    const buy = item.buy;
    const sell = item.sell;
    const difference = sell - buy;
    const percentageChange = buy == 0 ? 0 : ((sell - buy) * 100) / buy; // Avoid division by zero
    const baseUnit = item.base_unit;
    const savings =  (item.sell - item.buy) * item.volume 

      const row = document.createElement('tr');
    
      const color = buy === 0 ? 'red' : 'white';
      const percentageColor = percentageChange === 0 ? '#ef4444' : 'green';
      const savingColor = savings === 0 ? '#ef4444': 'green'
      row.innerHTML = `
           <td >${item.serialNumber}</td>
            <td>${item.name}</td>
            <td>₹ ${last}</td>
            <td>₹ ${buy} / ₹ ${sell}</td>
            <td style="color: ${percentageColor}">${percentageChange.toFixed(2)}%</td>
            <td  style="color: ${savingColor}">${savings} %</td>
      `;
      tableBody.appendChild(row);
  });
};

// Fetch data and render the table
const fetchDataAndRenderTable = async () => {
  const data = await fetchDataFromServer();
  if (data) {
      const dataWithSerialNumbers = generateSerialNumbers(data);
      console.log(dataWithSerialNumbers);
      
      renderTableRows(dataWithSerialNumbers);
  }
};

// Call the function to fetch data and render the table
fetchDataAndRenderTable();
