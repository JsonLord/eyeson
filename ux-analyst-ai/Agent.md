# Agent.md

## 1. Deployment Configuration

### Target Space
- **Profile:** `harvesthealth`
- **Space:** `agenticSeek`
- **Full Identifier:** `harvesthealth/agenticSeek`
- **Frontend Port:** `7860` (mandatory for all Hugging Face Spaces)

### Deployment Method
Choose the correct SDK based on the app type based on the codebase language:

- **Gradio SDK** — for Gradio applications
- **Streamlit SDK** — for Streamlit applications
- **Docker SDK** — for all other applications (recommended default for flexibility)

### HF Token
- The environment variable **`HF_TOKEN` will always be provided at execution time**.
- Never hardcode the token. Always read it from the environment.
- All monitoring and log‑streaming commands rely on `HF_TOKEN`.

### Required Files
- `Dockerfile` (or `app.py` for Gradio/Streamlit SDKs)
- `README.md` with Hugging Face YAML frontmatter:
  ```yaml
  ---
  title: UX Analyst AI
  sdk: docker
  app_port: 7860
  ---
  ```
- `.hfignore` to exclude unnecessary files
- This `Agent.md` file (must be committed before deployment)

---

## 2. API Exposure and Documentation

### Mandatory Endpoints
Every deployment **must** expose:

- **`/health`**
  - Returns HTTP 200 when the app is ready.
  - Required for Hugging Face to transition the Space from *starting* → *running*.

- **`/api-docs`**
  - Documents **all** available API endpoints.
  - Must be reachable at:
    `https://harvesthealth-agenticSeek.hf.space/api-docs`

### Functional Endpoints
Document each endpoint here. For every endpoint, include:

- **Method:** GET/POST/PUT/DELETE
- **Path:** `/predict`, `/generate`, `/upload`, etc.
- **Purpose:** What the endpoint does
- **Request Example:** JSON or query parameters
- **Response Example:** JSON schema or example payload

### /api/analyze
- **Method:** POST
- **Purpose:** Start a new UX analysis
- **Request Example:**
  ```json
  {
    "url": "https://example.com",
    "options": {
      "viewports": ["desktop", "tablet", "mobile"],
      "includeAccessibility": true
    }
  }
  ```
- **Response Example:**
  ```json
  {
    "id": "uuid",
    "status": "processing"
  }
  ```

### /api/analyze/:id
- **Method:** GET
- **Purpose:** Get analysis result
- **Request Example:** None (path parameter `:id`)
- **Response Example:**
  ```json
  {
    "id": "uuid",
    "status": "completed",
    "results": {}
  }
  ```

### /api/analyze/:id/report
- **Method:** GET
- **Purpose:** Get formatted HTML report
- **Request Example:** None (path parameter `:id`)
- **Response Example:**
  `<html>...</html>`

---

## 3. Deployment Workflow

### Standard Deployment Command
After any code change, run:

```bash
hf upload harvesthealth/agenticSeek --repo-type=space
```

This command must be executed **after updating and committing Agent.md**.

### Deployment Steps
1. Ensure all code changes are committed.
2. Ensure `Agent.md` is updated and committed.
3. Run the upload command.
4. Wait for the Space to build.
5. Monitor logs (see next section).
6. When the Space is running, execute all test cases.

### Continuous Deployment Rule
After **every** relevant edit (logic, dependencies, API changes):

- Update `Agent.md`
- Redeploy using the upload command
- Re-run all test cases
- Confirm `/health` and `/api-docs` are functional

This applies even for long-running projects.

---

## 4. Monitoring and Logs

### Build Logs (SSE)
```bash
curl -N \
  -H "Authorization: Bearer $HF_TOKEN" \
  "https://huggingface.co/api/spaces/harvesthealth/agenticSeek/logs/build"
```

### Run Logs (SSE)
```bash
curl -N \
  -H "Authorization: Bearer $HF_TOKEN" \
  "https://huggingface.co/api/spaces/harvesthealth/agenticSeek/logs/run"
```

### Notes
- If the Space stays in *starting* for too long, `/health` is usually failing.
- If the Space times out after ~30 minutes, check logs immediately.
- Fix issues, commit changes, redeploy.

---

## 5. Test Run Cases (Mandatory After Every Deployment)

These tests ensure the agentic system can verify the deployment automatically.

### 1. Health Check
```
GET https://harvesthealth-agenticSeek.hf.space/health
Expected: HTTP 200, body: {"status": "ok"} or similar
```

### 2. API Docs Check
```
GET https://harvesthealth-agenticSeek.hf.space/api-docs
Expected: HTTP 200, valid documentation UI or JSON spec
```

### 3. Functional Endpoint Tests
For each endpoint documented above, define:

- Example request
- Expected response structure
- Validation criteria (e.g., non-empty output, valid JSON)

Example:

```
POST https://harvesthealth-agenticSeek.hf.space/api/analyze
Payload:
{
  "url": "https://example.com"
}
Expected:
- HTTP 200
- JSON with key "id"
- No error fields
```

### 4. End-to-End Behaviour
- Confirm the UI loads (if applicable)
- Confirm API endpoints respond within reasonable time
- Confirm no errors appear in run logs

---

## 6. Maintenance Rules

- `Agent.md` must always reflect the **current** deployment configuration, API surface, and test cases.
- Any change to:
  - API routes
  - Dockerfile
  - Dependencies
  - App logic
  - Deployment method
  requires updating this file.
- This file must be committed **before** every deployment.
- This file is the operational contract for autonomous agents interacting with the project.
