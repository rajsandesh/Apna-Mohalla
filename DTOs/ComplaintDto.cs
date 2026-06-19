using System.ComponentModel.DataAnnotations;

namespace CommunityPortalApi.DTOs
{
    // DTO for submitting a new complaint (Resident only)
    public class ComplaintDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required")]
        [StringLength(50, ErrorMessage = "Category cannot exceed 50 characters")]
        public string Category { get; set; } = string.Empty;
    }

    // DTO for returning complaint data to the frontend
    public class ComplaintResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }

        // The name of the resident who submitted the complaint
        public string ResidentName { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}
