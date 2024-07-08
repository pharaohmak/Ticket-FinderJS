document.addEventListener("DOMContentLoaded", () => {
const eventDetailsEL = document.getElementById("events-panel")

  // Get the hamburger icon and overlay elements
  const hamburger = document.getElementById("hamburger");
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("close-btn");

  // Add event listeners to the hamburger icon and close button
  hamburger.addEventListener("click", () => {
    overlay.classList.toggle("active");
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.toggle("active");
  });

  const isEventsPage = window.location.pathname.includes("events.html");

  if (isEventsPage && searchQuery) {
    searchInput.value = searchQuery;
    performSearch(searchQuery);
  }

  searchButton.addEventListener("click", () =>
    handleSearch(searchInput.value.trim())
  );
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch(searchInput.value.trim());
    }
  });

  async function handleSearch(query) {
    if (query === "") {
      eventsListEl.innerHTML = "<p>Please enter a search query.</p>";
      return;
    }

    if (isEventsPage) {
      localStorage.setItem("searchQuery", query);
    }

    performSearch(query);
  }

  async function performSearch(query) {
    try {
      loadingEl.style.display = "block";

      const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(
          query
        )}&countryCode=US&apikey=qZWhqtApmbArpBw5qrGmoA6xfOZtpYaZ`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const eventsData = await response.json();
      loadingEl.style.display = "none";
      eventsListEl.style.display = "block";
      searchResultsTextEl.innerHTML = `Search results for "${query}"`;

      if (!eventsData._embedded || !eventsData._embedded.events) {
        eventsListEl.innerHTML = "<p>No events found.</p>";
        return;
      }

      eventsListEl.innerHTML = eventsData._embedded.events
        .map((event) => eventsHTML(event))
        .join("");
    } catch (error) {
      loadingEl.style.display = "none";
      console.error("Failed to fetch events:", error);
      eventsListEl.innerHTML = "<p>Failed to fetch events.</p>";
    }
  }
});

function eventDetailsHTML(event) {

  return `
    <div id="events-panel"></div>
    <div id="loading__state">Loading...</div>
    <div class="search__info"></div>
    `;
}
