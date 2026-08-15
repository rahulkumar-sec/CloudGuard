async function loadDashboard() {

    try {

        const response = await fetch("/api/dashboard");

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
                            ${finding.service} •
                            ${finding.description}
                        </p>
                    </div>

                    <span class="severity ${finding.severity}">
                        ${finding.severity}
                    </span>

                </div>

            `).join("");


        document.getElementById("criticalBar").style.width =
            Math.min(data.critical * 10, 100) + "%";

        document.getElementById("highBar").style.width =
            Math.min(data.high * 10, 100) + "%";

        document.getElementById("mediumBar").style.width =
            Math.min(data.medium * 10, 100) + "%";

        document.getElementById("lowBar").style.width =
            Math.min(data.low * 10, 100) + "%";


    } catch (error) {

        console.error("Dashboard error:", error);

        document.getElementById("findingsContainer").innerHTML =
            "<p>Unable to load security data.</p>";
    }
}


document.getElementById("scanButton").addEventListener(
    "click",
    async function () {

        const button = this;

        button.textContent = "⏳ Scanning...";
        button.disabled = true;


        try {

            const response = await fetch("/api/scan", {
                method: "POST"
            });

            const result = await response.json();

            alert(result.message);

            await loadDashboard();

        } catch (error) {

            alert("Security scan failed.");

        } finally {

            button.textContent = "🔍 Run Security Scan";
            button.disabled = false;
        }

    }
);


loadDashboard();