
const API_URL = "https://job-board-service-ak9c.onrender.com";

let localJobCache = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchJobs();
    setupFilters();
});

// Fetch listings securely via the Middleware API without knowing database keys
async function fetchJobs() {
    const statusMsg = document.getElementById("status-message");
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Could not pull jobs data");
        
        localJobCache = await response.json();
        statusMsg.style.display = "none";
        renderJobs(localJobCache);
    } catch (error) {
        console.error(error);
        statusMsg.innerText = "Error pulling active roles. Showing demo roles instead.";
        statusMsg.className = "loading error";
        
        // Mock data fallback so the CEO can visualize it even if your server is offline
        localJobCache = [
            { id: "1", title: "Senior Software Engineer", department: "Technology", location: "London (Hybrid)", salary_range: "£85,000", job_type: "Full-time", description: "Node/React stack development..." },
            { id: "2", title: "Financial Analyst", department: "Finance", location: "Manchester", salary_range: "£45,000", job_type: "Full-time", description: "Corporate forecasting and structures..." }
        ];
        renderJobs(localJobCache);
    }
}

function renderJobs(jobsList) {
    const container = document.getElementById("job-board");
    container.innerHTML = "";

    if(jobsList.length === 0) {
        container.innerHTML = "<p>No active openings match this department.</p>";
        return;
    }

    jobsList.forEach(job => {
        const card = document.createElement("div");
        card.classList.add("job-card");
        card.innerHTML = `
            <h3>${job.title}</h3>
            <div class="job-meta">
                <span>📍 ${job.location}</span>
                <span>💼 ${job.job_type}</span>
                <span>💰 ${job.salary_range}</span>
                <span>📂 ${job.department}</span>
            </div>
            <p>${job.description}</p>
        `;
        container.appendChild(card);
    });
}

function setupFilters() {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(button => {
        button.addEventListener("click", (e) => {
            buttons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");

            const selectedCat = e.target.getAttribute("data-category");
            if (selectedCat === "All") {
                renderJobs(localJobCache);
            } else {
                const filtered = localJobCache.filter(j => j.department === selectedCat);
                renderJobs(filtered);
            }
        });
    });
}
