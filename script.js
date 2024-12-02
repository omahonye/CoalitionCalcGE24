document.addEventListener("DOMContentLoaded", () => {
  const parties = document.querySelectorAll(".party");
  const coalitionDisplay = document.getElementById("coalition");
  const totalSeatsDisplay = document.getElementById("total-seats");
  const restartButton = document.getElementById("restart-btn");

  let coalition = [];
  let totalSeats = 0;
  let ioSeats = 0; // Track IO seats separately

  parties.forEach((party) => {
    const addButton = party.querySelector(".add-btn");
    const removeButton = party.querySelector(".remove-btn");
    const partyName = party.querySelector(".party-name").textContent;
    const seatDisplay = party.querySelector(".seats");
    let partySeats = parseInt(party.getAttribute("data-seats"));

    // Add party to the coalition
    addButton.addEventListener("click", () => {
      if (partyName === "IO") {
        // Special behavior for IO: Add 1 seat at a time up to 21 seats
        if (ioSeats < 21) {
          ioSeats++;
          if (!coalition.includes(partyName)) coalition.push(partyName);
          totalSeats++;
        }
        seatDisplay.textContent = `(${ioSeats}) - 21`; // Update IO seat display
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
        seatDisplay.textContent = ioSeats > 0 ? `(${ioSeats}) - 21` : "21"; // Reset display if IO reaches 0
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
        seatDisplay.textContent = "21"; // Reset IO seat display
      }
    });
    updateDisplay();
  });

  // Update the display
  function updateDisplay() {
    coalitionDisplay.textContent = coalition.length > 0 ? coalition.join(", ") : "None";
    totalSeatsDisplay.textContent = totalSeats;
  }
});
