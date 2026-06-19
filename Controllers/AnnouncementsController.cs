using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CommunityPortalApi.Data;
using CommunityPortalApi.DTOs;
using CommunityPortalApi.Models;

namespace CommunityPortalApi.Controllers
{
    // Base URL: /api/announcements
    [ApiController]
    [Route("api/[controller]")]
    public class AnnouncementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnnouncementsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /api/announcements
        // Public endpoint - any logged-in user (Admin or Resident) can view announcements
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            // Fetch all announcements, newest first
            var announcements = await _context.Announcements
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new AnnouncementResponseDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Content = a.Content,
                    Category = a.Category,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt
                })
                .ToListAsync();

            return Ok(announcements);
        }

        // GET /api/announcements/{id}
        // Get a single announcement by its ID
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);

            if (announcement == null)
            {
                return NotFound(new { message = $"Announcement with ID {id} not found." });
            }

            var response = new AnnouncementResponseDto
            {
                Id = announcement.Id,
                Title = announcement.Title,
                Content = announcement.Content,
                Category = announcement.Category,
                CreatedAt = announcement.CreatedAt,
                UpdatedAt = announcement.UpdatedAt
            };

            return Ok(response);
        }

        // POST /api/announcements
        // Admin only - create a new announcement
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] AnnouncementDto dto)
        {
            var announcement = new Announcement
            {
                Title = dto.Title,
                Content = dto.Content,
                Category = dto.Category
            };

            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();

            // Return 201 Created with the new announcement's location URL
            return CreatedAtAction(nameof(GetById), new { id = announcement.Id }, new AnnouncementResponseDto
            {
                Id = announcement.Id,
                Title = announcement.Title,
                Content = announcement.Content,
                Category = announcement.Category,
                CreatedAt = announcement.CreatedAt
            });
        }

        // PUT /api/announcements/{id}
        // Admin only - update an existing announcement
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] AnnouncementDto dto)
        {
            var announcement = await _context.Announcements.FindAsync(id);

            if (announcement == null)
            {
                return NotFound(new { message = $"Announcement with ID {id} not found." });
            }

            // Update the fields
            announcement.Title = dto.Title;
            announcement.Content = dto.Content;
            announcement.Category = dto.Category;
            announcement.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Announcement updated successfully." });
        }

        // DELETE /api/announcements/{id}
        // Admin only - delete an announcement
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);

            if (announcement == null)
            {
                return NotFound(new { message = $"Announcement with ID {id} not found." });
            }

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Announcement deleted successfully." });
        }
    }
}
