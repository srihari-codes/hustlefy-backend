const getOtpEmailTemplate = (otp, userEmail) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Hustlefy Verification Code</title>
    <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            outline: none;
            text-decoration: none;
        }

        /* Base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff7ed;
            margin: 0;
            padding: 0;
            width: 100%;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        /* Header styles */
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            padding: 30px 30px;
            text-align: center;
        }

        .logo-container {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(249, 115, 22, 0.2);
            border-radius: 12px;
            display: inline-block;
            padding: 6px;
            margin-bottom: 16px;
        }

        .logo {
            width: 40px;
            height: 40px;
            display: block;
            font-size: 32px;
        }

        .header-title {
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            margin: 8px 0 0 0;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        /* OTP Section - Mobile Email Client Friendly */
        .otp-section {
            text-align: center;
            margin: 32px 0;
            padding: 32px 24px;
            background: linear-gradient(135deg, rgba(255, 247, 237, 0.8) 0%, rgba(254, 215, 170, 0.3) 100%);
            border: 1px solid rgba(249, 115, 22, 0.2);
            border-radius: 16px;
        }

        .otp-label {
            font-size: 16px;
            color: #6b7280;
            margin: 0 0 16px 0;
            font-weight: 500;
        }

        .otp-code {
            background: linear-gradient(135deg, #ffffff 0%, rgba(255, 247, 237, 0.8) 100%);
            border: 2px solid #f97316;
            border-radius: 12px;
            padding: 24px;
            margin: 16px 0;
            display: inline-block;
            box-shadow: 0 8px 24px rgba(249, 115, 22, 0.15);
            /* Remove interactive styles for email clients */
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
        }

        .otp-digits {
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #ea580c;
            margin: 0;
            text-shadow: 0 2px 4px rgba(234, 88, 12, 0.1);
            /* Make text selectable */
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
        }

        .copy-instruction {
            font-size: 12px;
            color: #6b7280;
            margin: 8px 0 0 0;
            font-style: italic;
        }

        /* Alternative: Individual digit boxes for easier selection */
        .otp-digits-alternative {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin: 16px 0;
        }

        .digit-box {
            width: 45px;
            height: 50px;
            background: #ffffff;
            border: 2px solid #f97316;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 24px;
            font-weight: bold;
            color: #ea580c;
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
        }

        .expiry-info {
            background: linear-gradient(135deg, rgba(254, 215, 170, 0.3) 0%, rgba(253, 186, 116, 0.2) 100%);
            border: 1px solid rgba(251, 146, 60, 0.3);
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
            text-align: center;
        }

        .expiry-text {
            color: #92400e;
            font-size: 14px;
            font-weight: 600;
            margin: 0;
        }
        
        .features {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .features-title {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .feature-list {
            list-style: none;
            padding: 0;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 14px;
            color: #555;
        }
        
        .feature-icon {
            width: 20px;
            height: 20px;
            background: transparent;
            border-radius: 50%;
            margin-right: 7px;
            flex-shrink: 0;
            position: relative;
        }
        
        .feature-icon::after {
            content: "✓";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        
        .warning-text {
            color: #856404;
            font-size: 14px;
            font-weight: 500;
        }
        
        .footer {
            background-color: #2c3e50;
            color: #ecf0f1;
            padding: 30px;
            text-align: center;
        }
        
        .footer-content {
            margin-bottom: 20px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 10px;
            padding: 8px 16px;
            background-color: #34495e;
            color: #ecf0f1;
            text-decoration: none;
            border-radius: 20px;
            font-size: 12px;
            transition: background-color 0.3s ease;
        }
        
        .copyright {
            font-size: 12px;
            color: #95a5a6;
            border-top: 1px solid #34495e;
            padding-top: 20px;
        }
        
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s ease;
        }
        
        .button:hover {
            transform: translateY(-2px);
        }
        
        @media only screen and (max-width: 600px) {
            .container {
                margin: 0;
                box-shadow: none;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .otp-digits {
                font-size: 28px;
                letter-spacing: 4px;
            }
            
            .greeting {
                font-size: 20px;
            }

            .header-title {
                font-size: 22px;
            }

            .digit-box {
                width: 35px;
                height: 40px;
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-container">
                <img src="https://hustlefy-frontend.vercel.app/assets/images/hustlefy-logo.png" alt="Hustlefy" class="logo" />
            </div>
            <h1 class="header-title">Verification Code</h1>
            <div class="header-subtitle">Your Gateway to Quick Work Opportunities</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Welcome to Hustlefy! 👋</div>
            
            <div class="message">
                Hi there! <br><br>
                Thank you for choosing <strong>Hustlefy</strong> - the platform that connects skilled workers with exciting opportunities. 
            </div>
            
            <!-- OTP Section - Email Client Friendly -->
            <div class="otp-section">
                <p class="otp-label">Enter this code to complete verification</p>
                <div class="otp-code">
                    <p class="otp-digits">${otp}</p>
                </div>
            </div>

            <div class="expiry-info">
                <p class="expiry-text">⏰ This code expires in 10 minutes</p>
            </div>
            
            <!-- Features Section -->
            <div class="features">
                <div class="features-title">🎯 What's Next?</div>
                <ul class="feature-list">
                    <li class="feature-item">
                        <div class="feature-icon">👤</div>
                        <span>Complete your profile and showcase your skills</span>
                    </li>
                    <li class="feature-item">
                        <div class="feature-icon">🔍</div>
                        <span>Browse and apply for jobs that match your expertise</span>
                    </li>
                    <li class="feature-item">
                        <div class="feature-icon">🤝</div>
                        <span>Connect with top providers and grow your network</span>
                    </li>
                    <li class="feature-item">
                        <div class="feature-icon">💰</div>
                        <span>Get paid quickly and securely for your work</span>
                    </li>
                </ul>
            </div>
            
            <!-- Security Warning -->
            <div class="warning">
                <div class="warning-text">
                    🔒 <strong>Security Note:</strong> Never share this code with anyone. Hustlefy will never ask for your verification code via phone or email.
                </div>
            </div>
            
            <div class="message">
                If you didn't request this verification code, please ignore this email or contact our support team.
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <strong>Need Help?</strong><br>
                Our support team is here for you 24/7
            </div>
            
            <div class="social-links">
                <a href="mailto:hustlefyy@gmail.com" class="social-link">📧 Support</a>
                <a href="#" class="social-link">📱 Download App</a>
                <a href="https://hustlefy-frontend.vercel.app" class="social-link">🌐 Website</a>
            </div>
            
            <div class="copyright">
                © 2025 Hustlefy. All rights reserved.<br>
                Sent to: ${userEmail}
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports = { getOtpEmailTemplate };
