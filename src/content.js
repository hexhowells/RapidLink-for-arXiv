function getArxivIdFromUrl() {
    const urlPattern = /arxiv\.org\/abs\/(\d+\.\d+|[a-z\-\.]+\d{4,}\S*)/i;
    const match = window.location.href.match(urlPattern);
    return match ? match[1] : null;
}


function extractCategories(inputString) {
    const regex = /\(([^)]+)\)/g;
    let matches = [];
    let match;

    while ((match = regex.exec(inputString)) !== null) {
        matches.push(match[1]);
    }

    return matches;
}


function containsValidCategory(categories) {
    const validCategories = ['cs.AI', 'cs.CL', 'cs.CV', 'cs.LG', 'cs.MA', 'cs.NE', 'cs.RO', 'stat.ML'];
    const matches = categories.filter(value => validCategories.includes(value));

    return matches.length > 0;
}


function insertRapidPapersButton() {
    const subjects = extractCategories(document.querySelector("td.subjects").innerHTML);

    if (!containsValidCategory(subjects)) {
        console.log('[rapidlink-for-arxiv] paper is not in valid category.');
        return;
    }

    // insert the button by all the paper links
    const fullTextDiv = document.querySelector("div.full-text");

    if (!fullTextDiv) {
        console.warn('[rapidlink-for-arxiv] "full-text" div not found on the page.');
        return;
    }

    // Ensure the button is only added once
    if (fullTextDiv.querySelector(".rapidpapers-button")) {
        return;
    }

    // Button
    const button = document.createElement("button");
    button.textContent = "Open in RapidPapers";
    button.style.marginTop = "10px";
    button.style.padding = "6px 12px";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.backgroundColor = "#333333";
    button.style.color = "#FFFFFF";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.cursor = "pointer";
    button.className = "rapidpapers-button";

    // Logo
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("assets/favicon.ico");
    img.alt = "Rapid papers logo.";
    img.style.width = "20px";
    img.style.height = "20px";
    img.style.marginRight = "5px";

    button.prepend(img);

    // Button action
    button.addEventListener("click", () => {
        const arxivId = getArxivIdFromUrl();
        if (arxivId) {
            const rapidPapersUrl = `https://rapidpapers.org/paper/${arxivId}`;
            window.open(rapidPapersUrl, "_blank");
        } else {
            alert("Could not extract the arXiv ID from the URL.");
        }
    });

    // Add button to page
    fullTextDiv.appendChild(button);
}

// Observe the DOM for changes
const observer = new MutationObserver(() => {
    insertRapidPapersButton(); // Check if the button needs to be added
});

// Start observing the body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Initial check in case the "full-text" div is already present
insertRapidPapersButton();
