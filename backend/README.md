# OPPRADAR AI — Backend Architecture

This directory houses the backend API router, automated web intelligence pipelines, and opportunity scoring services.

## Directory Structure
* **`apiRouter.js`**: Central API dispatcher handling radar search, real-time chat search, action planning, and health checks.
* **`services/`**:
  * **`serpApiService.js`**: Core pipeline making live Google Search and Google Jobs requests.
  * **`searchPlanner.js`**: Constructs specialized boolean query plans based on user academic profile and skills.
  * **`scoringEngine.js`**: Computes relevance and eligibility scores (0–100%) against user degree, year, and skills.
  * **`dedupService.js`**: Normalizes and deduplicates listings across multiple sources.
  * **`normalizerService.js`**: Cleans and extracts dates, stipends, prize pools, and application URLs.
  * **`skillGapEngine.js`**: Identifies missing skills required for specific opportunities.
  * **`actionPlanEngine.js`**: Generates step-by-step preparation roadmaps for matched opportunities.
* **`routes/`**: Serverless function handlers for Vercel deployment.
