// Debug Guard - Protects debug pages in production
// Add this at the top of every debug HTML file

import { APP_CONFIG } from '../src/config/app-config.js';

// Block access when DEBUG is false (production)
if (!APP_CONFIG.DEBUG) {
  document.body.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #0a0e14;
      color: #c9d1d9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      text-align: center;
      padding: 2rem;
    ">
      <div>
        <h1 style="color: #f85149; font-size: 3rem; margin-bottom: 1rem;">⛔</h1>
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">404 - Page Not Found</h2>
        <p style="color: #8b949e;">This page does not exist.</p>
        <a href="../index.html" style="
          display: inline-block;
          margin-top: 2rem;
          padding: 0.75rem 1.5rem;
          background: #238636;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
        ">← Go Home</a>
      </div>
    </div>
  `;
  
  throw new Error('Debug pages are disabled in production');
}

console.log('✅ Debug guard passed - page accessible');
