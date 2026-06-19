using System.Net;
using System.Net.Mail;

namespace CommunityPortalApi.Services
{
    // ─────────────────────────────────────────────────────────
    // IEmailService — injectable abstraction so the controller
    // does not depend directly on System.Net.Mail internals.
    // ─────────────────────────────────────────────────────────
    public interface IEmailService
    {
        Task SendComplaintResolvedEmailAsync(string toEmail, string residentName, string complaintTitle);
        Task SendPasswordResetOtpAsync(string toEmail, string residentName, string otp);
    }

    // ─────────────────────────────────────────────────────────
    // EmailService — sends email via SMTP.
    // Configure host / credentials in appsettings.json under
    // the "Email" section.  When SmtpEnabled = false the
    // service just logs the email and skips sending so the
    // app works out-of-the-box without a mail server.
    // ─────────────────────────────────────────────────────────
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendComplaintResolvedEmailAsync(
            string toEmail,
            string residentName,
            string complaintTitle)
        {
            // Read settings — all optional so the app runs without SMTP config
            bool smtpEnabled = _config.GetValue<bool>("Email:SmtpEnabled");
            if (!smtpEnabled)
            {
                _logger.LogInformation(
                    "[EMAIL DISABLED] Would have sent resolution notice to {Email} for complaint \"{Title}\".",
                    toEmail, complaintTitle);
                return;
            }

            string host     = _config["Email:SmtpHost"]     ?? throw new InvalidOperationException("Email:SmtpHost not set");
            int    port     = _config.GetValue<int>("Email:SmtpPort", 587);
            bool   useSsl   = _config.GetValue<bool>("Email:SmtpUseSsl", true);
            string userName = _config["Email:SmtpUser"]     ?? "";
            string password = _config["Email:SmtpPassword"] ?? "";
            string fromAddr = _config["Email:FromAddress"]  ?? userName;
            string fromName = _config["Email:FromName"]     ?? "Apna mohalla";

            // Build a polished HTML email body
            string body = BuildHtmlBody(residentName, complaintTitle);

            using var client = new SmtpClient(host, port)
            {
                EnableSsl   = useSsl,
                Credentials = new NetworkCredential(userName, password)
            };

            using var message = new MailMessage
            {
                From       = new MailAddress(fromAddr, fromName),
                Subject    = $"✅ Your complaint has been resolved — {complaintTitle}",
                Body       = body,
                IsBodyHtml = true
            };
            message.To.Add(new MailAddress(toEmail, residentName));

            await client.SendMailAsync(message);

            _logger.LogInformation(
                "Resolution email sent to {Email} for complaint \"{Title}\".",
                toEmail, complaintTitle);
        }

        public async Task SendPasswordResetOtpAsync(string toEmail, string residentName, string otp)
        {
            bool smtpEnabled = _config.GetValue<bool>("Email:SmtpEnabled");
            if (!smtpEnabled)
            {
                _logger.LogInformation(
                    "[EMAIL DISABLED] Would have sent password reset OTP '{Otp}' to {Email}.",
                    otp, toEmail);
                return;
            }

            string host     = _config["Email:SmtpHost"]     ?? throw new InvalidOperationException("Email:SmtpHost not set");
            int    port     = _config.GetValue<int>("Email:SmtpPort", 587);
            bool   useSsl   = _config.GetValue<bool>("Email:SmtpUseSsl", true);
            string userName = _config["Email:SmtpUser"]     ?? "";
            string password = _config["Email:SmtpPassword"] ?? "";
            string fromAddr = _config["Email:FromAddress"]  ?? userName;
            string fromName = _config["Email:FromName"]     ?? "Apna mohalla";

            string body = BuildOtpBody(residentName, otp);

            using var client = new SmtpClient(host, port)
            {
                EnableSsl   = useSsl,
                Credentials = new NetworkCredential(userName, password)
            };

            using var message = new MailMessage
            {
                From       = new MailAddress(fromAddr, fromName),
                Subject    = $"🔒 Your Password Reset OTP — {otp}",
                Body       = body,
                IsBodyHtml = true
            };
            message.To.Add(new MailAddress(toEmail, residentName));

            await client.SendMailAsync(message);

            _logger.LogInformation(
                "Password reset OTP email sent to {Email}.",
                toEmail);
        }

        // ── Private helpers ────────────────────────────────────
        private static string BuildHtmlBody(string residentName, string complaintTitle)
        {
            return $"""
                <!DOCTYPE html>
                <html lang="en">
                <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
                <body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
                    <tr><td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

                        <!-- Header -->
                        <tr>
                          <td style="background:#2563eb;padding:32px 40px;text-align:center;">
                            <p style="margin:0;font-size:28px;">🏛️</p>
                            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">Apna mohalla</h1>
                            <p style="margin:4px 0 0;color:#bfdbfe;font-size:13px;">Apna mohalla</p>
                          </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                          <td style="padding:40px;">
                            <p style="margin:0 0 8px;font-size:20px;">✅ Complaint Resolved</p>
                            <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                              Dear <strong>{residentName}</strong>,
                            </p>
                            <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                              We are pleased to inform you that your complaint has been reviewed and resolved
                              by our site management team.
                            </p>

                            <!-- Complaint box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:4px;margin-bottom:24px;">
                              <tr>
                                <td style="padding:16px 20px;">
                                  <p style="margin:0 0 4px;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Complaint</p>
                                  <p style="margin:0;font-size:15px;color:#1e40af;font-weight:600;">{complaintTitle}</p>
                                </td>
                              </tr>
                            </table>

                            <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                              You can log in to the portal at any time to view the full history of your complaints
                              and their statuses.
                            </p>

                            <!-- CTA button -->
                            <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                              <tr>
                                <td style="background:#2563eb;border-radius:8px;">
                                  <a href="#" style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
                                    View My Complaints →
                                  </a>
                                </td>
                              </tr>
                            </table>

                            <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                              Thank you for helping us maintain a better community.<br>
                              — <strong>Community Management Team</strong>
                            </p>
                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
                            <p style="margin:0;font-size:12px;color:#9ca3af;">
                              © 2026 Apna mohalla. All rights reserved.<br>
                              This is an automated message — please do not reply.
                            </p>
                          </td>
                        </tr>

                      </table>
                    </td></tr>
                  </table>
                </body>
                </html>
                """;
        }

        private static string BuildOtpBody(string residentName, string otp)
        {
            return $"""
                <!DOCTYPE html>
                <html lang="en">
                <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
                <body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
                    <tr><td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
                        <tr>
                          <td style="background:#2563eb;padding:32px 40px;text-align:center;">
                            <p style="margin:0;font-size:28px;">🏛️</p>
                            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">Apna mohalla</h1>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:40px;">
                            <p style="margin:0 0 8px;font-size:20px;">🔒 Password Reset</p>
                            <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                              Dear <strong>{residentName}</strong>,
                            </p>
                            <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                              We received a request to reset your password. Use the verification code below to complete the process. This code will expire in 15 minutes.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:4px;margin-bottom:24px;">
                              <tr>
                                <td style="padding:16px 20px;text-align:center;">
                                  <p style="margin:0;font-size:32px;color:#1e40af;font-weight:700;letter-spacing:4px;">{otp}</p>
                                </td>
                              </tr>
                            </table>

                            <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                              If you didn't request a password reset, you can safely ignore this email.
                            </p>
                            <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                              Thank you,<br>
                              — <strong>Community Management Team</strong>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
                            <p style="margin:0;font-size:12px;color:#9ca3af;">
                              © 2026 Apna mohalla. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td></tr>
                  </table>
                </body>
                </html>
                """;
        }
    }
}
