from flask import Flask, jsonify, send_from_directory
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app = Flask(__name__, static_folder=str(FRONTEND_DIR))


security_data = {
    "security_score": 82,
    "critical": 2,
    "high": 5,
    "medium": 7,
    "low": 3,
    "iam_risks": 4,
    "network_exposure": 3,
    "mfa_coverage": 76,
    "findings": [
        {
            "title": "Public Storage Bucket",
            "service": "Object Storage",
            "severity": "Critical",
            "description": "Storage resource is publicly accessible."
        },
        {
            "title": "Overly Permissive IAM Policy",
            "service": "IAM",
            "severity": "High",
            "description": "IAM policy grants excessive permissions."
        },
        {
            "title": "Open Security Group",
            "service": "Network",
            "severity": "High",
            "description": "Network access is exposed to the internet."
        },
        {
            "title": "MFA Not Enabled",
            "service": "IAM",
            "severity": "Medium",
            "description": "Multi-factor authentication is missing."
        },
        {
            "title": "Unused Access Key",
            "service": "IAM",
            "severity": "Medium",
            "description": "Access key has not been used recently."
        }
    ]
}


@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/api/dashboard")
def dashboard():
    return jsonify(security_data)


@app.route("/api/health")
def health():
    return jsonify({
        "status": "online",
        "service": "CloudGuard",
        "version": "1.0.0"
    })


@app.route("/api/scan", methods=["POST"])
def scan():
    return jsonify({
        "status": "completed",
        "message": "Security scan completed successfully.",
        "findings": len(security_data["findings"])
    })


@app.route("/style.css")
def style():
    return send_from_directory(FRONTEND_DIR, "style.css")


@app.route("/script.js")
def script():
    return send_from_directory(FRONTEND_DIR, "script.js")



if __name__ == "__main__":
    app.run(debug=True)