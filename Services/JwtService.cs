using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using CommunityPortalApi.Models;

namespace CommunityPortalApi.Services
{
    // JwtService is responsible for generating JWT tokens.
    // A JWT token contains user info (claims) and is signed with a secret key.
    // The frontend stores this token and sends it with every request.
    public class JwtService
    {
        private readonly IConfiguration _config;

        // IConfiguration lets us read from appsettings.json
        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        // Generate a JWT token for the given user
        public string GenerateToken(User user)
        {
            // Claims are pieces of information stored inside the token
            // The frontend can decode these (but NOT forge them without the secret key)
            var claims = new[]
            {
                // User's unique ID
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                // User's email
                new Claim(ClaimTypes.Email, user.Email),
                // User's full name
                new Claim(ClaimTypes.Name, user.FullName),
                // User's role: "Admin" or "Resident"
                // This is used by [Authorize(Roles = "Admin")] on controllers
                new Claim(ClaimTypes.Role, user.Role)
            };

            // Create a signing key from the secret in appsettings.json
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            );

            // Sign the token using HMAC SHA-256 algorithm
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Build the token with issuer, audience, claims, expiry, and signature
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7), // Token valid for 7 days
                signingCredentials: creds
            );

            // Serialize the token to a string e.g. "eyJhbGci..."
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
