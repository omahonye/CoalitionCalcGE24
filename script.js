document.addEventListener("DOMContentLoaded", () => {
  const parties = document.querySelectorAll(".party");
  const coalitionDisplay = document.getElementById("coalition");
  const totalSeatsDisplay = document.getElementById("total-seats");
  const restartButton = document.getElementById("restart-btn");
  const notice = document.createElement("p"); // For displaying the coalition success message
  notice.setAttribute("id", "success-notice");
  notice.style.display = "none"; // Hide initially
  notice.style.color = "green";
  notice.textContent = "Congratulations! You have reached the required 88 seats for a coalition.";
  document.querySelector(".status").appendChild(notice);

  let coalition = [];
  let totalSeats = 0;
  let ioSeats = 0; // Track IO seats separately (max 17)

  // Map of party colors
  const partyColors = {
    FG: "#003399",       // Blue
    FF: "#66cc33",       // Green
    SF: "#008000",       // Dark Green
    IO: "#000000",       // Black
    LAB: "#cc0000",      // Red
    "PBP-SOL": "#ff33cc", // Pinkish Purple
    SD: "#800080",       // Purple
    GP: "#99cc33",       // Light Green
    AON: "orange",       // Orange
    II: "pink",          // Pink
  };

  parties.forEach((party) => {
    const addButton = party.querySelector(".add-btn");
    const removeButton = party.querySelector(".remove-btn");
    const partyName = party.querySelector(".party-name").textContent;
    const seatDisplay = party.querySelector(".seats");
    let partySeats = parseInt(party.getAttribute("data-seats"));

    // Add party to the coalition
    addButton.addEventListener("click", () => {
      if (partyName === "IO") {
        // Special behavior for IO: Add 1 seat at a time up to 17 seats
        if (ioSeats < 17) {
          ioSeats++;
          if (!coalition.includes(partyName)) coalition.push(partyName);
          totalSeats++;
        }
        seatDisplay.textContent = `(${ioSeats}) - 17`; // Update IO seat display
      } else {
        // Regular parties: Add only once
        if (!coalition.includes(partyName)) {
          coalition.push(partyName);
          totalSeats += partySeats;
        }
      }
      updateDisplay();
    });

    // Remove party from the coalition
    removeButton.addEventListener("click", () => {
      if (partyName === "IO") {
        // Special behavior for IO: Subtract 1 seat at a time
        if (ioSeats > 0) {
          ioSeats--;
          totalSeats--;
          if (ioSeats === 0) {
            coalition = coalition.filter((p) => p !== partyName); // Remove IO if seats are 0
          }
        }
        seatDisplay.textContent = ioSeats > 0 ? `(${ioSeats}) - 17` : "17"; // Reset display if IO reaches 0
      } else {
        // Regular parties: Remove entirely
        if (coalition.includes(partyName)) {
          totalSeats -= partySeats;
          coalition = coalition.filter((p) => p !== partyName); // Remove party from coalition
        }
      }
      updateDisplay();
    });
  });

  // Reset the coalition
  restartButton.addEventListener("click", () => {
    coalition = [];
    totalSeats = 0;
    ioSeats = 0; // Reset IO seat count
    parties.forEach((party) => {
      const partyName = party.querySelector(".party-name").textContent;
      const seatDisplay = party.querySelector(".seats");
      if (partyName === "IO") {
        seatDisplay.textContent = "17"; // Reset IO seat display
      }
    });
    notice.style.display = "none"; // Hide the success notice
    updateDisplay();
  });

  // Update the display
  function updateDisplay() {
    // Update coalition display with colored party names
    coalitionDisplay.innerHTML = coalition.length > 0 
      ? coalition.map((party) => {
          const color = partyColors[party] || "gray"; // Default to gray if no color found
          return `<span style="background-color: ${color}; color: white; padding: 5px; border-radius: 3px; margin-right: 5px;">${party}</span>`;
        }).join(" ")
      : "None";

    // Update total seats
    totalSeatsDisplay.textContent = totalSeats;

    // Show notice if total seats reach or exceed 88
    if (totalSeats >= 88) {
      notice.style.display = "block";
    } else {
      notice.style.display = "none";
    }
  }
});
