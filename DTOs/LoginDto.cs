using System.ComponentModel.DataAnnotations;

namespace CommunityPortalApi.DTOs
{
    // Data Transfer Object for user login
    // This is what the frontend sends to POST /api/auth/login
    public class LoginDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }
}
