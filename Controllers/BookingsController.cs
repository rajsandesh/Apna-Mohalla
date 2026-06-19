using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CommunityPortalApi.Data;
using CommunityPortalApi.Models;
using CommunityPortalApi.DTOs;
using System.Security.Claims;

namespace CommunityPortalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BookingsController> _logger;

        public BookingsController(ApplicationDbContext context, ILogger<BookingsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET /api/bookings — get all bookings (admin only)
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetAllBookings()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim?.Value, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user?.Role != "Admin")
            {
                return Forbid("Only admins can view all bookings");
            }

            var bookings = await _context.Bookings
                .Include(b => b.User)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new BookingDto
                {
                    Id = b.Id,
                    UserId = b.UserId,
                    UserName = b.User!.FullName,
                    UserEmail = b.User.Email,
                    Facility = b.Facility,
                    BookingDate = b.BookingDate,
                    TimeSlot = b.TimeSlot,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // GET /api/bookings/my — get current user's bookings
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetMyBookings()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim?.Value, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var bookings = await _context.Bookings
                .Where(b => b.UserId == userId)
                .Include(b => b.User)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new BookingDto
                {
                    Id = b.Id,
                    UserId = b.UserId,
                    UserName = b.User!.FullName,
                    UserEmail = b.User.Email,
                    Facility = b.Facility,
                    BookingDate = b.BookingDate,
                    TimeSlot = b.TimeSlot,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // POST /api/bookings — create a new booking
        [HttpPost]
        public async Task<ActionResult<BookingDto>> CreateBooking([FromBody] CreateBookingDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim?.Value, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Validate booking date
            if (dto.BookingDate.Date < DateTime.UtcNow.Date)
            {
                return BadRequest("Booking date cannot be in the past");
            }

            var booking = new Booking
            {
                UserId = userId,
                Facility = dto.Facility,
                BookingDate = dto.BookingDate,
                TimeSlot = dto.TimeSlot,
                Status = "Confirmed",
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Booking created: {BookingId} for user {UserId}", booking.Id, userId);

            var result = new BookingDto
            {
                Id = booking.Id,
                UserId = booking.UserId,
                UserName = user.FullName,
                UserEmail = user.Email,
                Facility = booking.Facility,
                BookingDate = booking.BookingDate,
                TimeSlot = booking.TimeSlot,
                Status = booking.Status,
                CreatedAt = booking.CreatedAt
            };

            return CreatedAtAction(nameof(GetMyBookings), result);
        }

        // PUT /api/bookings/:id — update booking status (admin can cancel)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, [FromBody] Dictionary<string, string> updates)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim?.Value, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound("Booking not found");
            }

            // Only the booking owner or admin can update
            if (booking.UserId != userId && user.Role != "Admin")
            {
                return Forbid("You can only update your own bookings");
            }

            if (updates.ContainsKey("Status"))
            {
                booking.Status = updates["Status"];
                booking.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return Ok(booking);
        }

        // DELETE /api/bookings/:id — delete a booking (owner or admin)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim?.Value, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound("Booking not found");
            }

            // Only the booking owner or admin can delete
            if (booking.UserId != userId && user.Role != "Admin")
            {
                return Forbid("You can only delete your own bookings");
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Booking deleted: {BookingId}", id);

            return Ok(new { message = "Booking cancelled successfully" });
        }
    }
}
