# Agent Deployment Guide: AUXteam/UX-agent

This file informs future agents about deployment specifics and best practices for the UX Analyst AI app on Hugging Face Spaces.

## 1. Deployment Configuration

### Target Space
- **Profile:** `AUXteam`
- **Space:** `UX-agent`
- **Full Identifier:** `AUXteam/UX-agent`
- **Frontend Port:** `7860` (mandatory for all Hugging Face Spaces)

### Deployment Method
- **SDK:** `docker`

### HF Token
- The HF Token is provided in the environment.
- All monitoring and log‑streaming commands rely on this token.

### Required Files
- `Dockerfile`
- `README.md` with Hugging Face YAML frontmatter:
  ```yaml
  ---
  title: UX Analyst AI
  sdk: docker
  app_port: 7860
  ---
  ```
- `.hfignore` to exclude unnecessary files
- `Agent.md` (this file)

---

## 2. API Exposure and Documentation

### Mandatory Endpoints
Every deployment **must** expose:

- **`/health`**
  - Returns HTTP 200 when the app is ready.
  - Required for Hugging Face to transition the Space from *starting* → *running*.

- **`/api-docs`**
  - Documents **all** available API endpoints.
  - Reachable at: `https://AUXteam-UX-agent.hf.space/api-docs`

### Functional Endpoints

#### /api/analyze
- **Method:** POST
- **Purpose:** Start a new UX analysis for a given URL.
- **Request Example:**
  ```json
  {
    "url": "https://example.com",
    "options": {
      "viewports": ["desktop", "mobile"],
      "includeAccessibility": true,
      "analysisType": "comprehensive"
    }
  }
  ```
- **Response Example:**
  ```json
  {
    "id": "analysis-uuid",
    "status": "pending",
    "url": "https://example.com"
  }
  ```

#### /api/analyze/:id
- **Method:** GET
- **Purpose:** Get the status and results of a specific analysis.

#### /api/health
- **Method:** GET
- **Purpose:** Detailed health status of all internal services.

---

## 3. Deployment Workflow

### Standard Deployment Command
```bash
hf upload AUXteam/UX-agent . --repo-type=space --delete "*"
```

### Monitoring Logs
**Build Logs:**
```bash
curl -N -H "Authorization: Bearer $HF_TOKEN" "https://huggingface.co/api/spaces/AUXteam/UX-agent/logs/build"
```

**Run Logs:**
```bash
curl -N -H "Authorization: Bearer $HF_TOKEN" "https://huggingface.co/api/spaces/AUXteam/UX-agent/logs/run"
```
