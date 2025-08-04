const getJobAcceptanceEmailTemplate = (job, provider, seeker) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Job Acceptance - Hustlefy</title>
    <style>
      /* Reset styles */
      body,
      table,
      td,
      p,
      a,
      li,
      blockquote {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table,
      td {
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
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif;
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
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        padding: 30px 30px;
        text-align: center;
      }

      .logo-container {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(34, 197, 94, 0.2);
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

      /* Job Details Section */
      .job-details {
        background: linear-gradient(
          135deg,
          rgba(34, 197, 94, 0.1) 0%,
          rgba(22, 163, 74, 0.05) 100%
        );
        border: 1px solid rgba(34, 197, 94, 0.2);
        border-radius: 16px;
        padding: 32px 24px;
        margin: 32px 0;
      }

      .job-title {
        font-size: 22px;
        font-weight: bold;
        color: #16a34a;
        margin-bottom: 16px;
        text-align: center;
      }

      .detail-item {
        width: 100%;
        border-collapse: collapse;
        padding: 12px 0;
        border-bottom: 1px solid rgba(34, 197, 94, 0.1);
      }

      .detail-item:last-child {
        border-bottom: none;
      }

      .detail-item td {
        padding: 8px 0;
        vertical-align: middle;
      }

      .detail-label {
        font-weight: 600;
        color: #374151;
        font-size: 14px;
        text-align: left;
        width: 40%;
        padding-right: 20px;
      }

      .detail-value {
        color: #16a34a;
        font-weight: 600;
        font-size: 14px;
        text-align: right;
        width: 60%;
        padding-left: 20px;
      }

      .payment-highlight {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 16px;
        font-weight: bold;
      }

      /* Provider Contact Section */
      .provider-contact {
        background: linear-gradient(
          135deg,
          rgba(59, 130, 246, 0.1) 0%,
          rgba(37, 99, 235, 0.05) 100%
        );
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 12px;
        padding: 24px;
        margin: 24px 0;
      }

      .provider-title {
        font-size: 18px;
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 16px;
        text-align: center;
      }

      .contact-item {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 12px;
        font-size: 14px;
      }

      .contact-icon {
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        border-radius: 50%;
        text-align: center;
        line-height: 24px;
        margin-right: 12px;
        font-size: 12px;
        color: white;
        vertical-align: middle;
      }

      .contact-link {
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;
      }

      .contact-link:hover {
        text-decoration: underline;
      }

      /* Next Steps Section */
      .next-steps {
        background-color: #f8f9fa;
        border-radius: 12px;
        padding: 25px;
        margin: 30px 0;
      }

      .next-steps-title {
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 15px;
        text-align: center;
      }

      .step-list {
        list-style: none;
        padding: 0;
      }

      .step-item {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 12px;
        font-size: 14px;
        color: #555;
      }

      .step-number {
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        border-radius: 15px;
        text-align: center;
        line-height: 30px;
        color: white;
        font-weight: bold;
        font-size: 14px;
        vertical-align: middle;
        padding: 0;
        margin-right: 15px;
        display: inline-block;
        min-width: 30px;
      }

      .step-text {
        vertical-align: middle;
        padding-left: 15px;
        line-height: 1.4;
      }

      .step-item td {
        padding: 8px 0;
        vertical-align: middle;
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
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
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

        .header,
        .content,
        .footer {
          padding: 20px;
        }

        .greeting {
          font-size: 20px;
        }

        .header-title {
          font-size: 22px;
        }

        .step-number {
          width: 28px;
          height: 28px;
          line-height: 28px;
          font-size: 12px;
          margin-right: 12px;
          border-radius: 14px;
        }

        .step-text {
          font-size: 13px;
          padding-left: 12px;
        }

        .detail-label,
        .detail-value {
          font-size: 13px;
        }

        /* Mobile button styles */
        .button-container a {
          display: block !important;
          width: 100% !important;
          margin: 8px 0 !important;
          padding: 16px 20px !important;
          font-size: 16px !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo-container">
          <img
            src="https://hustlefy-frontend.vercel.app/assets/images/hustlefy-logo.png"
            alt="Hustlefy"
            class="logo"
          />
        </div>
        <h1 class="header-title">🎉 You're Hired!</h1>
        <div class="header-subtitle">
          Congratulations on your new opportunity
        </div>
      </div>

      <!-- Main Content -->
      <div class="content">
        <div class="greeting">Congratulations ${seeker.name}! 🎊</div>

        <div class="message">
          Great news! You have been <strong>accepted</strong> for the job
          position. ${provider.name} was impressed with your application and
          is excited to work with you.
        </div>

        <!-- Job Details Section -->
        <div class="job-details">
          <div class="job-title">"${job.title}"</div>

          <div class="detail-item">
            <span class="detail-label">📍 Location</span>
            <span class="detail-value">${job.location}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">🏷️ Category</span>
            <span class="detail-value">${job.category}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">⏰ Duration</span>
            <span class="detail-value">${job.duration}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">💰 Payment</span>
            <span class="payment-highlight">₹${job.payment}</span>
          </div>
        </div>

        <!-- Provider Contact Section -->
        <div class="provider-contact">
          <div class="provider-title">📞 Contact Your Provider</div>

          <table class="contact-item">
            <tr>
              <td class="contact-icon">👤</td>
              <td><strong>Provider:</strong> ${provider.name}</td>
            </tr>
          </table>

          <table class="contact-item">
            <tr>
              <td class="contact-icon">📧</td>
              <td>
                <a href="mailto:${provider.email}" class="contact-link"
                  >${provider.email}</a
                >
              </td>
            </tr>
          </table>

          ${
            provider.phone
              ? `
          <table class="contact-item">
            <tr>
              <td class="contact-icon">📱</td>
              <td>
                <a href="tel:${provider.phone}" class="contact-link"
                  >${provider.phone}</a
                >
              </td>
            </tr>
          </table>
          `
              : ""
          }
        </div>

        <!-- Accept/Decline Buttons -->
        <div style="text-align: center; margin: 30px 0">
          <table style="width: 100%; border-collapse: collapse">
            <tr>
              <td style="text-align: center; padding: 10px">
                <a
                  href="mailto:${
                    provider.email
                  }?subject=Job%20Acceptance%20-%20${encodeURIComponent(
    job.title
  )}&body=Hi%20${encodeURIComponent(
    provider.name
  )},%0A%0AI%20am%20writing%20to%20confirm%20my%20acceptance%20of%20the%20job%20position%20%22${encodeURIComponent(
    job.title
  )}%22.%0A%0AI%20am%20excited%20to%20work%20with%20you%20and%20look%20forward%20to%20discussing%20the%20next%20steps.%0A%0APlease%20let%20me%20know%20when%20would%20be%20a%20good%20time%20to%20connect.%0A%0ABest%20regards,%0A${encodeURIComponent(
    seeker.name
  )}"
                  style="
                    display: inline-block;
                    padding: 14px 28px;
                    background: linear-gradient(
                      135deg,
                      #22c55e 0%,
                      #16a34a 100%
                    );
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: 600;
                    font-size: 16px;
                    margin: 0 8px;
                  "
                >
                  ✅ Accept Job
                </a>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding: 10px">
                <a
                  href="mailto:${
                    provider.email
                  }?subject=Job%20Decline%20-%20${encodeURIComponent(
    job.title
  )}&body=Hi%20${encodeURIComponent(
    provider.name
  )},%0A%0AThank%20you%20for%20considering%20me%20for%20the%20position%20%22${encodeURIComponent(
    job.title
  )}%22.%0A%0AAfter%20careful%20consideration,%20I%20have%20decided%20to%20decline%20this%20opportunity.%20I%20appreciate%20your%20time%20and%20consideration.%0A%0AI%20wish%20you%20the%20best%20in%20finding%20the%20right%20candidate.%0A%0ABest%20regards,%0A${encodeURIComponent(
    seeker.name
  )}"
                  style="
                    display: inline-block;
                    padding: 14px 28px;
                    background: linear-gradient(
                      135deg,
                      #ef4444 0%,
                      #dc2626 100%
                    );
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: 600;
                    font-size: 16px;
                    margin: 0 8px;
                  "
                >
                  ❌ Decline Job
                </a>
              </td>
            </tr>
          </table>
        </div>

        <!-- Next Steps Section -->
        <div class="next-steps">
          <div class="next-steps-title">🚀 What's Next?</div>
          <div class="step-list">
            <table class="step-item">
              <tr>
                <td class="step-number">1</td>
                <td class="step-text">
                  <strong>Click "Accept Job" or "Decline Job" above</strong> to
                  respond to the provider
                </td>
              </tr>
            </table>
            <table class="step-item">
              <tr>
                <td class="step-number">2</td>
                <td class="step-text">
                  Confirm your availability and discuss job specifics
                </td>
              </tr>
            </table>
            <table class="step-item">
              <tr>
                <td class="step-number">3</td>
                <td class="step-text">
                  Show up on time and deliver excellent work
                </td>
              </tr>
            </table>
            <table class="step-item">
              <tr>
                <td class="step-number">4</td>
                <td class="step-text">
                  Get paid and build your reputation on Hustlefy
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Important Note -->
        <div class="warning">
          <div class="warning-text">
            📋 <strong>Important:</strong> Please reach out to the provider
            within 24 hours to confirm your participation. Failure to respond
            may result in your position being offered to another candidate.
          </div>
        </div>

        <div class="message">
          We're excited to see you succeed! If you have any questions or
          concerns, our support team is always here to help.
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-content">
          <strong>Questions or Need Support?</strong><br />
          We're here to help you succeed
        </div>

        <div class="social-links">
          <a href="mailto:hustlefyy@gmail.com" class="social-link"
            >📧 Support</a
          >
          <a href="#" class="social-link">📱 Download App</a>
          <a href="https://hustlefy-frontend.vercel.app" class="social-link"
            >🌐 Website</a
          >
        </div>

        <div class="copyright">
          © 2025 Hustlefy. All rights reserved.<br />
          Sent to: ${seeker.email}
        </div>
      </div>
    </div>
  </body>
</html>


  `;
};

module.exports = { getJobAcceptanceEmailTemplate };
