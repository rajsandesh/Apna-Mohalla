namespace CommunityPortalApi.Models
{
    // Represents a community announcement posted by Admin
    public class Announcement
    {
        public int Id { get; set; }

        // Short headline for the announcement
        public string Title { get; set; } = string.Empty;

        // Full announcement body text
        public string Content { get; set; } = string.Empty;

        // Category helps residents filter announcements e.g. "Maintenance", "Community"
        public string Category { get; set; } = string.Empty;

        // When this announcement was published
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // When this announcement was last edited (null if never updated)
        public DateTime? UpdatedAt { get; set; }
    }
}
