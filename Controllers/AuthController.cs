using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CommunityPortalApi.Data;
using CommunityPortalApi.DTOs;
using CommunityPortalApi.Models;
using CommunityPortalApi.Services;
using BCrypt.Net;

namespace CommunityPortalApi.Controllers
{
    // Base URL for all routes in this controller: /api/auth
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IEmailService _emailService;

        // Inject database context, JWT service, and email service via constructor
        public AuthController(ApplicationDbContext context, JwtService jwtService, IEmailService emailService)
        {
            _context = context;
            _jwtService = jwtService;
            _emailService = emailService;
        }

        // POST /api/auth/register
        // Allows a new resident to create an account
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            string emailLower = dto.Email.ToLower();
            if (!emailLower.EndsWith("@iqra.edu.pk") && !emailLower.EndsWith("@gmail.com"))
            {
                return BadRequest(new { message = "Only @iqra.edu.pk and @gmail.com email addresses are allowed to register." });
            }

            // Check if an account with this email already exists
            bool emailExists = await _context.Users
                .AnyAsync(u => u.Email == dto.Email.ToLower());

            if (emailExists)
            {
                return BadRequest(new { message = "An account with this email already exists." });
            }

            // Hash the password using BCrypt before saving to database
            // BCrypt automatically adds a random salt for extra security
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // Create a new User object with role set to "Resident" by default
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email.ToLower(), // Store email in lowercase
                PasswordHash = hashedPassword,
                Role = "Resident"            // All registered users are Residents
            };

            // Save the user to the database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful. You can now log in." });
        }

        // POST /api/auth/login
        // Validates credentials and returns a JWT token
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Find user by email (case-insensitive search)
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email.ToLower());

            // Check if user exists
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Verify the provided password against the stored hash
            bool passwordMatches = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!passwordMatches)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Generate a JWT token containing user ID, email, name, and role
            string token = _jwtService.GenerateToken(user);

            // Return the token along with basic user info
            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role
                }
            });
        }

        // POST /api/auth/forgot-password
        // Generates an OTP and sends it via email
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email.ToLower());

            if (user == null)
            {
                // We return Ok even if the user isn't found to prevent email enumeration attacks
                return Ok(new { message = "If your email is registered, you will receive a password reset OTP shortly." });
            }

            // Generate a 6-digit random numeric OTP
            Random rand = new Random();
            string otp = rand.Next(100000, 999999).ToString();

            user.ResetToken = otp;
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(15);
            await _context.SaveChangesAsync();

            await _emailService.SendPasswordResetOtpAsync(user.Email, user.FullName, otp);

            return Ok(new { message = "If your email is registered, you will receive a password reset OTP shortly." });
        }

        // POST /api/auth/reset-password
        // Verifies the OTP and updates the password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email.ToLower());

            if (user == null || user.ResetToken != dto.Otp || user.ResetTokenExpiry < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Invalid or expired OTP." });
            }

            // Hash the new password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            
            // Clear the reset token so it can't be reused
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Your password has been successfully reset. You can now log in." });
        }
    }
}
