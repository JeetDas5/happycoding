export interface ContactEmailParams {
  name: string;
  email: string;
  type: "bug" | "feature request" | "feedback";
  message: string;
}

export function generateContactEmail({
  name,
  email,
  type,
  message,
}: ContactEmailParams): string {
  const typeColors = {
    bug: "#ef4444",
    "feature request": "#3b82f6",
    feedback: "#10b981",
  };

  const typeColor = typeColors[type] || "#000000";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f8fafc;
      padding: 20px;
      line-height: 1.6;
      color: #1e293b;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    
    .header-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.025em;
      margin: 0;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 8px;
    }
    
    .info-card {
      background-color: #f1f5f9;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
    }
    
    .info-row {
      display: flex;
      margin-bottom: 12px;
    }
    
    .info-label {
      font-weight: 600;
      width: 100px;
      color: #475569;
    }
    
    .info-value {
      flex: 1;
      color: #1e293b;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #ffffff;
      background-color: ${typeColor};
    }
    
    .message-box {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      font-size: 16px;
      color: #1e293b;
      white-space: pre-wrap;
    }
    
    .footer {
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 25px 30px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
    }
    
    @media (max-width: 600px) {
      .container {
        border: none;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="header-title">HappyCoding Support</h1>
    </div>
    
    <div class="content">
      <div class="info-card">
        <div class="info-row">
          <div class="info-label">From:</div>
          <div class="info-value"><strong>${name}</strong> (${email})</div>
        </div>
        <div class="info-row">
          <div class="info-label">Type:</div>
          <div class="info-value"><span class="badge">${type}</span></div>
        </div>
      </div>
      
      <h2 class="section-title">Message</h2>
      <div class="message-box">${message}</div>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} HappyCoding. Received via Contact Form.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
