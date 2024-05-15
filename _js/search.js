// Function to perform search
const performSearch = (query) => {
  const collections = window.collections; // Assume you have a global variable containing your collections data

  // Perform search logic (adjust as needed)
  const results = collections.filter((item) => {
    const searchableFields = ["title", "categories", "description"]; // Fields to search
    const searchString = query.toLowerCase();

    return searchableFields.some((field) => {
      const fieldValue = item.data[field] || "";
      return fieldValue.toLowerCase().includes(searchString);
    });
  });

  displayResults(results);
};

// Function to display search results
const displayResults = (results) => {
  const resultsContainer = document.getElementById("search-results"); // Adjust the container ID

  // Clear previous results
  resultsContainer.innerHTML = "";

  // Display results
  results.forEach((result) => {
    const resultItem = document.createElement("div");
    resultItem.innerHTML = `<h3>${result.data.title}</h3>
                           <p>${result.data.description}</p>
                           <a href="${result.url}">Read more</a>`;
    resultsContainer.appendChild(resultItem);
  });
};

// Event listener for search input
const searchInput = document.getElementById("search-input"); // Adjust the input ID
searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim();
  performSearch(query);
});
