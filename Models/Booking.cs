namespace CommunityPortalApi.Models
{
    // Represents a facility booking by a resident
    public class Booking
    {
        public int Id { get; set; }

        // Foreign key to the User who made the booking
        public int UserId { get; set; }
        public User? User { get; set; }

        // Name of the facility (e.g., "Clubhouse", "Pool Area", "Tennis Court")
        public string Facility { get; set; } = string.Empty;

        // Date of the booking
        public DateTime BookingDate { get; set; }

        // Time slot (e.g., "08:00 AM - 09:00 AM")
        public string TimeSlot { get; set; } = string.Empty;

        // Status: "Confirmed", "Cancelled", "Completed"
        public string Status { get; set; } = "Confirmed";

        // When the booking was created
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // When the booking was last updated
        public DateTime? UpdatedAt { get; set; }
    }
}
