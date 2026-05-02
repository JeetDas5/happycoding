export interface TokenEmailParams {
  name: string;
  token: string;
  verificationUrl: string;
  expiresIn?: string;
}

export function generateTokenEmail({
  name,
  token,
  verificationUrl,
  expiresIn = "1 hour",
}: TokenEmailParams): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
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
      background-color: #f5f5f5;
      padding: 20px;
      line-height: 1.6;
      color: #000000;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .header {
      background-color: #000000;
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .header-title {
      font-size: 28px;
      font-weight: 600;
      letter-spacing: -0.5px;
      margin: 0;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .greeting {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 20px;
      color: #000000;
    }
    
    .message {
      font-size: 14px;
      color: #4a4a4a;
      margin-bottom: 30px;
      line-height: 1.7;
    }
    
    .cta-container {
      margin: 40px 0;
      text-align: center;
    }
    
    .cta-button {
      display: inline-block;
      background-color: #000000;
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      transition: background-color 0.2s ease;
      border: 1px solid #000000;
    }
    
    .cta-button:hover {
      background-color: #1a1a1a;
      border-color: #1a1a1a;
    }
    
    .token-section {
      background-color: #f9f9f9;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      padding: 20px;
      margin: 30px 0;
      font-family: 'Courier New', monospace;
      word-break: break-all;
    }
    
    .token-label {
      font-size: 12px;
      color: #666666;
      font-weight: 500;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }
    
    .token-value {
      font-size: 13px;
      color: #000000;
      letter-spacing: 0.3px;
    }
    
    .expiry-notice {
      background-color: #ffffff;
      border-left: 3px solid #808080;
      padding: 15px;
      margin: 25px 0;
      font-size: 13px;
      color: #4a4a4a;
    }
    
    .expiry-notice strong {
      color: #000000;
    }
    
    .security-notice {
      background-color: #fafafa;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      padding: 15px;
      margin: 25px 0;
      font-size: 12px;
      color: #666666;
      line-height: 1.6;
    }
    
    .security-icon {
      display: inline-block;
      margin-right: 8px;
    }
    
    .footer {
      background-color: #f9f9f9;
      border-top: 1px solid #e5e5e5;
      padding: 25px 30px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
    
    .footer-links {
      margin: 15px 0 10px 0;
    }
    
    .footer-link {
      color: #000000;
      text-decoration: none;
      margin: 0 10px;
      font-size: 11px;
    }
    
    .footer-link:hover {
      text-decoration: underline;
    }
    
    .divider {
      height: 1px;
      background-color: #e5e5e5;
      margin: 20px 0;
    }
    
    @media (max-width: 600px) {
      .container {
        border: none;
      }
      
      .header {
        padding: 30px 20px;
      }
      
      .header-title {
        font-size: 24px;
      }
      
      .content {
        padding: 25px 20px;
      }
      
      .footer {
        padding: 20px;
      }
      
      .cta-button {
        display: block;
        width: 100%;
        padding: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1 class="header-title">HappyCoding</h1>
    </div>
    
    <!-- Content -->
    <div class="content">
      <p class="greeting">Hi ${name},</p>
      
      <p class="message">
        Welcome to HappyCoding! To complete your registration and gain access to your account, please verify your email address by clicking the button below.
      </p>
      
      <!-- CTA Button -->
      <div class="cta-container">
        <a href="${verificationUrl}" class="cta-button">Verify Email Address</a>
      </div>
      
      <p class="message">
        Or copy and paste this token if the button doesn't work:
      </p>
      
      <!-- Token -->
      <div class="token-section">
        <div class="token-label">Verification Token</div>
        <div class="token-value">${token}</div>
      </div>
      
      <!-- Expiry Notice -->
      <div class="expiry-notice">
        ⏱️ <strong>This verification link expires in ${expiresIn}.</strong> Make sure to verify your email before it expires.
      </div>
      
      <!-- Security Notice -->
      <div class="security-notice">
        <span class="security-icon">🔒</span>
        <strong>Security Notice:</strong> If you didn't create this account, please ignore this email or contact our support team. Your account won't be created unless you click the verification link.
      </div>
      
      <div class="divider"></div>
      
      <p class="message">
        If you have any questions or need help, feel free to reach out to our support team.
      </p>
      
      <p class="message" style="margin-bottom: 0;">
        Best regards,<br />
        <strong>The HappyCoding Team</strong>
      </p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-links">
        <a href="https://happycoding.app" class="footer-link">Website</a>
        <a href="https://happycoding.app/privacy" class="footer-link">Privacy</a>
        <a href="https://happycoding.app/terms" class="footer-link">Terms</a>
      </div>
      <p style="margin: 10px 0; color: #999999;">
        © ${new Date().getFullYear()} HappyCoding. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
