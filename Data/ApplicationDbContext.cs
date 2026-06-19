using Microsoft.EntityFrameworkCore;
using CommunityPortalApi.Models;

namespace CommunityPortalApi.Data
{
    // ApplicationDbContext is the bridge between C# models and the PostgreSQL database.
    // Entity Framework Core uses this to create tables and run queries.
    public class ApplicationDbContext : DbContext
    {
        // Constructor receives options (like the connection string) from Program.cs
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Each DbSet maps to a database table
        public DbSet<User> Users { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        // Configure relationships and constraints
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ensure emails are unique - no two users can have the same email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Set default role to "Resident" at the database level
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasDefaultValue("Resident");

            // Set default complaint status to "Pending"
            modelBuilder.Entity<Complaint>()
                .Property(c => c.Status)
                .HasDefaultValue("Pending");

            // A complaint belongs to one User (Resident)
            // If a user is deleted, their complaints remain (restrict delete)
            modelBuilder.Entity<Complaint>()
                .HasOne(c => c.User)
                .WithMany(u => u.Complaints)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
