namespace CommunityPortalApi.Models
{
    // Represents a user in the system (can be Admin or Resident)
    public class User
    {
        public int Id { get; set; }

        // Full name of the user e.g. "Ali Ahmed"
        public string FullName { get; set; } = string.Empty;

        // Unique email address used for login
        public string Email { get; set; } = string.Empty;

        // BCrypt hashed password - never stored as plain text
        public string PasswordHash { get; set; } = string.Empty;

        // Role: "Admin" or "Resident"
        public string Role { get; set; } = "Resident";

        // Date when the account was created
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property - complaints submitted by this user
        public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();

        // OTP for password reset
        public string? ResetToken { get; set; }

        // Expiry time for password reset OTP
        public DateTime? ResetTokenExpiry { get; set; }
    }
}
