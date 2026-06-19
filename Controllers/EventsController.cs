using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CommunityPortalApi.Data;
using CommunityPortalApi.DTOs;
using CommunityPortalApi.Models;

namespace CommunityPortalApi.Controllers
{
    // Base URL: /api/events
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /api/events
        // Any logged-in user can view events
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            // Return upcoming events first, then past events
            var events = await _context.Events
                .OrderBy(e => e.EventDate)
                .Select(e => new EventResponseDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    Location = e.Location,
                    EventDate = e.EventDate,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt
                })
                .ToListAsync();

            return Ok(events);
        }

        // GET /api/events/{id}
        // Get a single event by ID
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var ev = await _context.Events.FindAsync(id);

            if (ev == null)
            {
                return NotFound(new { message = $"Event with ID {id} not found." });
            }

            return Ok(new EventResponseDto
            {
                Id = ev.Id,
                Title = ev.Title,
                Description = ev.Description,
                Location = ev.Location,
                EventDate = ev.EventDate,
                CreatedAt = ev.CreatedAt,
                UpdatedAt = ev.UpdatedAt
            });
        }

        // POST /api/events
        // Admin only - create a new event
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] EventDto dto)
        {
            var ev = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                Location = dto.Location,
                EventDate = dto.EventDate
            };

            _context.Events.Add(ev);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = ev.Id }, new EventResponseDto
            {
                Id = ev.Id,
                Title = ev.Title,
                Description = ev.Description,
                Location = ev.Location,
                EventDate = ev.EventDate,
                CreatedAt = ev.CreatedAt
            });
        }

        // PUT /api/events/{id}
        // Admin only - update an existing event
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] EventDto dto)
        {
            var ev = await _context.Events.FindAsync(id);

            if (ev == null)
            {
                return NotFound(new { message = $"Event with ID {id} not found." });
            }

            ev.Title = dto.Title;
            ev.Description = dto.Description;
            ev.Location = dto.Location;
            ev.EventDate = dto.EventDate;
            ev.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Event updated successfully." });
        }

        // DELETE /api/events/{id}
        // Admin only - delete an event
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var ev = await _context.Events.FindAsync(id);

            if (ev == null)
            {
                return NotFound(new { message = $"Event with ID {id} not found." });
            }

            _context.Events.Remove(ev);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Event deleted successfully." });
        }
    }
}
