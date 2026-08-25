async function loadDashboard() {
    try {
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
            throw new Error("Dashboard API failed");
        }

        const data = await response.json();

        document.getElementById("securityScore").textContent =
            data.security_score;

        document.getElementById("critical").textContent =
            data.critical;

        document.getElementById("high").textContent =
            data.high;

        document.getElementById("iamRisks").textContent =
            data.iam_risks;

        document.getElementById("mfa").textContent =
            data.mfa_coverage + "%";

        document.getElementById("criticalRisk").textContent =
            data.critical;

        document.getElementById("highRisk").textContent =
            data.high;

        document.getElementById("mediumRisk").textContent =
            data.medium;

        document.getElementById("lowRisk").textContent =
            data.low;

        document.getElementById("findingsContainer").innerHTML =
            data.findings.map(finding => `
                <div class="finding">
                    <div>
                        <h4>${finding.title}</h4>
                        <p>
                            ${finding.service} ·
                            ${finding.description}
                        </p>
                    </div>

                    <span class="severity ${finding.severity}">
                        ${finding.severity}
                    </span>
                </div>
            `).join("");
       document.querySelectorAll(".finding").forEach(finding => {
    finding.addEventListener("click", () => {
        const title =
            finding.querySelector("h4")?.textContent || "Security Finding";

        const details =
            finding.querySelector("p")?.textContent || "";

        const severity =
            finding.querySelector(".severity")?.textContent || "";

        const container = document.getElementById("findingsContainer");

        let detailsBox = document.getElementById("findingDetails");

        if (!detailsBox) {
            detailsBox = document.createElement("div");
            detailsBox.id = "findingDetails";
            container.prepend(detailsBox);
        }

        detailsBox.innerHTML = `
            <div style="
                margin-bottom:20px;
                padding:18px;
                border:1px solid rgba(255,255,255,.15);
                border-radius:12px;
                background:rgba(20,35,70,.65);
            ">
                <h4 style="margin:0 0 10px;font-size:18px;">
                    ${title}
                </h4>

                <p style="margin:0 0 12px;">
                    ${details}
                </p>

                <span style="font-weight:700;">
                    Severity: ${severity}
                </span>
            </div>
        `;

        detailsBox.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    });
});
    } catch (error) {
        console.error("Dashboard error:", error);

        document.getElementById("findingsContainer").innerHTML =
            "<p>Unable to load security data.</p>";
    }
}
    


    document.getElementById("scanButton").addEventListener("click", async () => {
    const button = document.getElementById("scanButton");

    button.textContent = "⏳ Scanning...";
    button.disabled = true;

    try {
        const response = await fetch("/api/scan", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Security scan failed");
        }

        const result = await response.json();

        let statusBox = document.getElementById("scanStatus");

        if (!statusBox) {
            statusBox = document.createElement("div");
            statusBox.id = "scanStatus";

            const container =
                document.getElementById("findingsContainer");

            container.parentElement.prepend(statusBox);
        }

        statusBox.innerHTML = `
            <div style="
                margin-bottom:18px;
                padding:14px 18px;
                border-radius:10px;
                background:rgba(52,211,153,.12);
                border:1px solid rgba(52,211,153,.35);
                color:#34d399;
                font-weight:600;
            ">
                ✓ ${result.message}
                <span style="margin-left:8px;opacity:.8;">
                    ${result.findings} findings detected
                </span>
            </div>
        `;

        await loadDashboard();

        statusBox.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    } catch (error) {
        console.error("Scan error:", error);

        let statusBox = document.getElementById("scanStatus");

        if (!statusBox) {
            statusBox = document.createElement("div");
            statusBox.id = "scanStatus";

            const container =
                document.getElementById("findingsContainer");

            container.parentElement.prepend(statusBox);
        }

        statusBox.innerHTML = `
            <div style="
                margin-bottom:18px;
                padding:14px 18px;
                border-radius:10px;
                background:rgba(239,68,68,.12);
                border:1px solid rgba(239,68,68,.35);
                color:#f87171;
                font-weight:600;
            ">
                ✕ Security scan failed. Please try again.
            </div>
        `;

    } finally {
        button.textContent = "🔍 Run Security Scan";
        button.disabled = false;
    }
});

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        document.querySelectorAll("nav a").forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

        const section = this.dataset.section;

        if (section === "dashboard") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        if (section === "findings") {
            document.querySelector(".findings-panel")?.scrollIntoView({
                behavior: "smooth"
            });
        }

        if (section === "iam") {
    document.querySelector(".findings-panel")?.scrollIntoView({
        behavior: "smooth"
    });
}

if (section === "network") {
    document.querySelector(".findings-panel")?.scrollIntoView({
        behavior: "smooth"
    });
}

if (section === "reports") {
    document.querySelector(".findings-panel")?.scrollIntoView({
        behavior: "smooth"
    });
}
        
    });
});
loadDashboard();