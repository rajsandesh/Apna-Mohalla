namespace CommunityPortalApi.Models
{
    // Represents a complaint submitted by a Resident
    public class Complaint
    {
        public int Id { get; set; }

        // Brief title describing the issue
        public string Title { get; set; } = string.Empty;

        // Detailed description of the problem
        public string Description { get; set; } = string.Empty;

        // Category e.g. "Plumbing", "Electricity", "Security"
        public string Category { get; set; } = string.Empty;

        // Status of the complaint: "Pending" or "Resolved"
        public string Status { get; set; } = "Pending";

        // When the complaint was submitted
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // When the complaint was resolved (null if still pending)
        public DateTime? ResolvedAt { get; set; }

        // Foreign key - which resident submitted this complaint
        public int UserId { get; set; }

        // Navigation property - the user who submitted this complaint
        public User? User { get; set; }
    }
}
