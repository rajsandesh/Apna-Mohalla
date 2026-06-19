namespace CommunityPortalApi.Models
{
    // Represents a community event created by Admin
    public class Event
    {
        public int Id { get; set; }

        // Name of the event e.g. "Weekend Farmer's Market"
        public string Title { get; set; } = string.Empty;

        // Detailed description of the event
        public string Description { get; set; } = string.Empty;

        // Physical or virtual location of the event
        public string Location { get; set; } = string.Empty;

        // Date and time the event will take place
        public DateTime EventDate { get; set; }

        // When this event record was created
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // When this record was last edited (null if never updated)
        public DateTime? UpdatedAt { get; set; }
    }
}
