import { envVars } from "../config/env";

export const getServerLandingPageHtml = (uptimeSeconds: number, reqProtocol: string, reqHost: string): string => {
  const currentEnv = envVars.NODE_ENV || "development";
  const baseUrl = `${reqProtocol}://${reqHost}/api/v1`;
  const swaggerUrl = `${reqProtocol}://${reqHost}/api/docs`;
  const postmanDownloadUrl = `${reqProtocol}://${reqHost}/postman.json`;
  const healthUrl = `${reqProtocol}://${reqHost}/health`;
  const frontendUrl = envVars.FRONTEND_URL || "http://localhost:3000";

  const formatUptime = (sec: number) => {
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = Math.floor(sec % 60);
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(" ");
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DocPulse - Doctor & Patient Tracker | Backend API</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(18, 24, 38, 0.75);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-hover-border: rgba(14, 165, 233, 0.4);
      --primary: #0ea5e9;
      --primary-glow: rgba(14, 165, 233, 0.25);
      --accent: #6366f1;
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.2);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --code-bg: #030712;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg);
      background-image: 
        radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(16, 185, 129, 0.08) 0px, transparent 50%);
      background-attachment: fixed;
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.6;
    }

    header {
      border-bottom: 1px solid var(--card-border);
      backdrop-filter: blur(12px);
      background: rgba(9, 13, 22, 0.6);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text);
    }

    .brand-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0ea5e9, #6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px var(--primary-glow);
      font-size: 1.25rem;
    }

    .brand-text h1 {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .badge-api {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.15rem 0.45rem;
      background: rgba(14, 165, 233, 0.15);
      border: 1px solid rgba(14, 165, 233, 0.3);
      color: var(--primary);
      border-radius: 9999px;
      font-weight: 700;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #34d399;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite ease-in-out;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.6; }
    }

    main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 1.5rem 5rem;
      width: 100%;
    }

    .hero {
      text-align: center;
      max-width: 760px;
      margin: 0 auto 3rem;
    }

    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 1rem;
      border-radius: 9999px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #a5b4fc;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }

    .hero-title {
      font-size: clamp(2.2rem, 5vw, 3.2rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin-bottom: 1.25rem;
      background: linear-gradient(135deg, #ffffff 30%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-desc {
      font-size: 1.05rem;
      color: var(--text-muted);
      margin-bottom: 2rem;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: #ffffff;
      box-shadow: 0 4px 20px var(--primary-glow);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--card-border);
      color: var(--text);
      backdrop-filter: blur(10px);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .btn-swagger {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
    }

    .btn-swagger:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.45);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
    }

    .btn-outline:hover {
      background: rgba(16, 185, 129, 0.1);
      transform: translateY(-2px);
    }

    .grid-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 3rem;
    }

    .info-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      backdrop-filter: blur(16px);
      transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .info-card:hover {
      border-color: var(--card-hover-border);
      transform: translateY(-2px);
    }

    .info-card-label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.35rem;
    }

    .info-card-val {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      word-break: break-all;
    }

    .mono {
      font-family: 'JetBrains Mono', monospace;
    }

    .section-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .postman-box {
      background: linear-gradient(135deg, rgba(235, 87, 87, 0.08), rgba(243, 112, 33, 0.04));
      border: 1px solid rgba(243, 112, 33, 0.25);
      border-radius: 18px;
      padding: 1.75rem;
      margin-bottom: 3rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .postman-left {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .postman-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, #FF6C37, #E0531A);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      flex-shrink: 0;
      box-shadow: 0 4px 20px rgba(243, 112, 33, 0.3);
    }

    .postman-text h3 {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      color: #fff;
    }

    .postman-text p {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .postman-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .btn-postman {
      background: #FF6C37;
      color: #fff;
      border-radius: 10px;
      padding: 0.7rem 1.4rem;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      box-shadow: 0 4px 15px rgba(255, 108, 55, 0.35);
    }

    .btn-postman:hover {
      background: #ff5719;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 108, 55, 0.5);
    }

    .table-container {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 18px;
      overflow: hidden;
      backdrop-filter: blur(16px);
      margin-bottom: 3rem;
    }

    .table-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .table-header h3 {
      font-size: 1.1rem;
      font-weight: 700;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      padding: 0.85rem 1.5rem;
      background: rgba(255, 255, 255, 0.02);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      border-bottom: 1px solid var(--card-border);
    }

    td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 0.9rem;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .method {
      display: inline-block;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .method-get { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .method-post { background: rgba(14, 165, 233, 0.15); color: #38bdf8; }
    .method-put { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .method-patch { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
    .method-delete { background: rgba(239, 68, 68, 0.15); color: #f87171; }

    .endpoint-path {
      font-family: 'JetBrains Mono', monospace;
      color: #e2e8f0;
      font-weight: 500;
    }

    .tag-auth {
      display: inline-block;
      font-size: 0.7rem;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-muted);
    }

    footer {
      border-top: 1px solid var(--card-border);
      padding: 2rem 1.5rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    .copy-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--code-bg);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.4rem 0.75rem;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      cursor: pointer;
      color: #e2e8f0;
      transition: border-color 0.2s ease;
    }

    .copy-chip:hover {
      border-color: var(--primary);
    }

    @media (max-width: 768px) {
      .postman-box {
        flex-direction: column;
        align-items: flex-start;
      }
      .postman-actions {
        width: 100%;
      }
      .btn-postman, .btn {
        width: 100%;
        justify-content: center;
      }
      th, td {
        padding: 0.75rem 1rem;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="nav-container">
      <a href="/" class="brand">
        <div class="brand-icon">🩺</div>
        <div class="brand-text">
          <h1>DocPulse <span class="badge-api">REST API</span></h1>
        </div>
      </a>
      <div class="status-pill">
        <span class="status-dot"></span>
        <span>Operational</span>
      </div>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="hero-eyebrow">🚀 DocPulse - Doctor & Patient Tracking System</div>
      <h2 class="hero-title">DocPulse API Engine Online</h2>
      <p class="hero-desc">
        High-performance RESTful API powering healthcare professional management, patient assignment tracking, role-based security, and clinical workload analytics.
      </p>

      <div class="hero-actions">
        <a href="${swaggerUrl}" target="_blank" class="btn btn-swagger">
          <span>⚡</span> Interactive Swagger UI
        </a>
        <a href="${postmanDownloadUrl}" download="docpulse-doctor-tracker.postman_collection.json" class="btn btn-primary">
          <span>📥</span> Download Postman
        </a>
        <a href="${frontendUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          <span>🌐</span> Visit Web Application
        </a>
        <a href="${healthUrl}" target="_blank" class="btn btn-outline">
          <span>🩺</span> Health Check
        </a>
      </div>
    </section>

    <!-- Metrics Cards -->
    <div class="grid-info">
      <div class="info-card">
        <div class="info-card-label">Server Status</div>
        <div class="info-card-val" style="color: #34d399;">
          <span>🟢</span> Online & Listening
        </div>
      </div>
      <div class="info-card">
        <div class="info-card-label">API Version</div>
        <div class="info-card-val mono">v1.0.0</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">Environment</div>
        <div class="info-card-val mono">${currentEnv}</div>
      </div>
      <div class="info-card">
        <div class="info-card-label">Uptime</div>
        <div class="info-card-val mono">${formatUptime(uptimeSeconds)}</div>
      </div>
    </div>

    <!-- Swagger Interactive Docs Box -->
    <div class="postman-box" style="border-color: rgba(16, 185, 129, 0.4); background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 78, 59, 0.15) 100%);">
      <div class="postman-left">
        <div class="postman-icon" style="background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.4);">⚡</div>
        <div class="postman-text">
          <h3 style="color: #34d399;">Interactive Swagger OpenAPI 3.0 Documentation</h3>
          <p>Explore live API schemas, request/response models, test endpoints with Bearer JWT tokens directly from your browser.</p>
        </div>
      </div>
      <div class="postman-actions">
        <a href="${swaggerUrl}" target="_blank" class="btn btn-swagger">
          <span>🚀</span> Open Swagger UI (/api/docs)
        </a>
        <a href="${swaggerUrl}/swagger.json" target="_blank" class="btn btn-secondary">
          <span>📄</span> Raw OpenAPI JSON
        </a>
      </div>
    </div>

    <!-- Postman Box -->
    <div class="postman-box">
      <div class="postman-left">
        <div class="postman-icon">🚀</div>
        <div class="postman-text">
          <h3>DocPulse Postman Collection Ready (v2.1)</h3>
          <p>Complete set of pre-configured endpoints with auto JWT token extraction on login, mock queries, and clinical workload tests.</p>
        </div>
      </div>
      <div class="postman-actions">
        <a href="${postmanDownloadUrl}" download="docpulse-doctor-tracker.postman_collection.json" class="btn-postman">
          <span>📥</span> Download JSON
        </a>
        <a href="${postmanDownloadUrl}" target="_blank" class="btn btn-secondary">
          <span>👀</span> View Raw JSON
        </a>
        <button onclick="navigator.clipboard.writeText('${postmanDownloadUrl}'); alert('Postman Collection URL copied to clipboard! Paste into Postman -> Import -> Link');" class="btn btn-secondary">
          <span>📋</span> Copy Import URL
        </button>
      </div>
    </div>

    <!-- Quick Info & Base URL -->
    <div style="margin-bottom: 2rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
      <h3 class="section-title" style="margin-bottom: 0;">⚡ Core Modules & Routes</h3>
      <div class="copy-chip" onclick="navigator.clipboard.writeText('${baseUrl}'); alert('Base URL copied: ${baseUrl}');">
        <span style="color: var(--text-muted);">Base URL:</span>
        <span style="color: var(--primary);">${baseUrl}</span>
        <span>📋</span>
      </div>
    </div>

    <!-- Table of Core Routes -->
    <div class="table-container">
      <div class="table-header">
        <h3>Primary API Endpoints</h3>
        <span style="font-size: 0.8rem; color: var(--text-muted);">Total Endpoints: 24+</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Endpoint</th>
            <th>Module</th>
            <th>Access</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="method method-post">POST</span></td>
            <td class="endpoint-path">/api/v1/auth/login</td>
            <td>Authentication</td>
            <td><span class="tag-auth">Public</span></td>
          </tr>
          <tr>
            <td><span class="method method-post">POST</span></td>
            <td class="endpoint-path">/api/v1/user/register</td>
            <td>User Management</td>
            <td><span class="tag-auth">Public</span></td>
          </tr>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="endpoint-path">/api/v1/user/me</td>
            <td>User Profile</td>
            <td><span class="tag-auth">Authenticated</span></td>
          </tr>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="endpoint-path">/api/v1/doctors</td>
            <td>Doctors Directory</td>
            <td><span class="tag-auth">Authenticated</span></td>
          </tr>
          <tr>
            <td><span class="method method-post">POST</span></td>
            <td class="endpoint-path">/api/v1/doctors</td>
            <td>Doctors Management</td>
            <td><span class="tag-auth">Admin Only</span></td>
          </tr>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="endpoint-path">/api/v1/doctors/:id/patients</td>
            <td>Doctor Patients</td>
            <td><span class="tag-auth">Doctor / Admin</span></td>
          </tr>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="endpoint-path">/api/v1/patients</td>
            <td>Patients Directory</td>
            <td><span class="tag-auth">Authenticated</span></td>
          </tr>
          <tr>
            <td><span class="method method-post">POST</span></td>
            <td class="endpoint-path">/api/v1/patients</td>
            <td>Create Patient</td>
            <td><span class="tag-auth">Doctor / Admin</span></td>
          </tr>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="endpoint-path">/api/v1/patients/conditions</td>
            <td>Conditions List</td>
            <td><span class="tag-auth">Authenticated</span></td>
          </tr>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="endpoint-path">/api/v1/dashboard/analytics</td>
            <td>Dashboard Metrics</td>
            <td><span class="tag-auth">Admin Only</span></td>
          </tr>
          <tr>
            <td><span class="method method-post">POST</span></td>
            <td class="endpoint-path">/api/v1/contact</td>
            <td>Contact Inquiry</td>
            <td><span class="tag-auth">Public</span></td>
          </tr>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="endpoint-path">/health</td>
            <td>System Health</td>
            <td><span class="tag-auth">Public</span></td>
          </tr>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="endpoint-path">/api/docs</td>
            <td>Swagger UI Interactive Docs</td>
            <td><span class="tag-auth">Public</span></td>
          </tr>
          <tr>
            <td><span class="method method-get">GET</span></td>
            <td class="endpoint-path">/postman.json</td>
            <td>Postman Spec</td>
            <td><span class="tag-auth">Public</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>

  <footer>
    <p>© 2026 DocPulse Doctor Tracker. Built with Next.js, Express & TypeScript. High availability & clinical safeguards.</p>
  </footer>
</body>
</html>`;
};
