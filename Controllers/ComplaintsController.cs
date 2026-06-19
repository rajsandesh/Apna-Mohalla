using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CommunityPortalApi.Data;
using CommunityPortalApi.DTOs;
using CommunityPortalApi.Models;
using CommunityPortalApi.Services;

namespace CommunityPortalApi.Controllers
{
    // Base URL: /api/complaints
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ComplaintsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<ComplaintsController> _logger;

        public ComplaintsController(
            ApplicationDbContext context,
            IEmailService emailService,
            ILogger<ComplaintsController> logger)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        // Helper: get the current user's ID from the JWT claims
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim!);
        }

        // POST /api/complaints
        // Resident only — submit a new complaint
        [HttpPost]
        [Authorize(Roles = "Resident")]
        public async Task<IActionResult> Create([FromBody] ComplaintDto dto)
        {
            int userId = GetCurrentUserId();

            var complaint = new Complaint
            {
                Title       = dto.Title,
                Description = dto.Description,
                Category    = dto.Category,
                Status      = "Pending",
                UserId      = userId
            };

            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Complaint submitted successfully.", complaintId = complaint.Id });
        }

        // GET /api/complaints/my
        // Resident only — view their own complaints
        [HttpGet("my")]
        [Authorize(Roles = "Resident")]
        public async Task<IActionResult> GetMyComplaints()
        {
            int userId = GetCurrentUserId();

            var complaints = await _context.Complaints
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ComplaintResponseDto
                {
                    Id           = c.Id,
                    Title        = c.Title,
                    Description  = c.Description,
                    Category     = c.Category,
                    Status       = c.Status,
                    CreatedAt    = c.CreatedAt,
                    ResolvedAt   = c.ResolvedAt,
                    ResidentName = c.User!.FullName,
                    UserId       = c.UserId
                })
                .ToListAsync();

            return Ok(complaints);
        }

        // GET /api/complaints
        // Admin only — view all complaints from all residents
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var complaints = await _context.Complaints
                .Include(c => c.User)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ComplaintResponseDto
                {
                    Id           = c.Id,
                    Title        = c.Title,
                    Description  = c.Description,
                    Category     = c.Category,
                    Status       = c.Status,
                    CreatedAt    = c.CreatedAt,
                    ResolvedAt   = c.ResolvedAt,
                    ResidentName = c.User!.FullName,
                    UserId       = c.UserId
                })
                .ToListAsync();

            return Ok(complaints);
        }

        // PUT /api/complaints/{id}/resolve
        // Admin only — mark a complaint as resolved and email the resident
        [HttpPut("{id}/resolve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Resolve(int id)
        {
            // Load the complaint together with the resident's user record
            // so we can access their email address and full name for the notification
            var complaint = await _context.Complaints
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (complaint == null)
                return NotFound(new { message = $"Complaint with ID {id} not found." });

            if (complaint.Status == "Resolved")
                return BadRequest(new { message = "This complaint has already been resolved." });

            complaint.Status     = "Resolved";
            complaint.ResolvedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Send a resolution notification email to the resident (fire-and-forget style;
            // if the email fails we still return success — the status was already saved)
            if (complaint.User != null)
            {
                try
                {
                    await _emailService.SendComplaintResolvedEmailAsync(
                        complaint.User.Email,
                        complaint.User.FullName,
                        complaint.Title);
                }
                catch (Exception ex)
                {
                    // Log the error but do NOT fail the request — DB update already succeeded
                    _logger.LogWarning(ex,
                        "Failed to send resolution email to {Email} for complaint {Id}.",
                        complaint.User.Email, complaint.Id);
                }
            }

            return Ok(new { message = "Complaint marked as resolved." });
        }
    }
}
