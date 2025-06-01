using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Pustak_Ghar.Models;
using System.Net;

namespace WebApplication1.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // This method should be placed here, inside the class but outside the constructor
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed Role
            var adminRoleId = Guid.NewGuid().ToString();
            var adminUserId = Guid.NewGuid().ToString();

            modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = adminRoleId,
                Name = "Admin",
                NormalizedName = "ADMIN"
            });

            // Create password hasher to hash the password
            var hasher = new PasswordHasher<IdentityUser>();

            var adminUser = new IdentityUser
            {
                Id = adminUserId,
                UserName = "admin@yourapp.com",
                NormalizedUserName = "ADMIN@YOURAPP.COM",
                Email = "admin@yourapp.com",
                NormalizedEmail = "ADMIN@YOURAPP.COM",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString("D"),
                ConcurrencyStamp = Guid.NewGuid().ToString("D")
            };

            adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin@123");

            modelBuilder.Entity<IdentityUser>().HasData(adminUser);

            // Assign Role to Admin User
            modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                RoleId = adminRoleId,
                UserId = adminUserId
            });


            // Seed admin in UserProfile
            modelBuilder.Entity<UserProfile>().HasData(new UserProfile
            {
                UserProfileId = Guid.NewGuid(),
                UserId = adminUserId,
                FirstName = "Admin",
                LastName = "User",
                Address = "Kathmandu",
                Gender = "Male",
                PhoneNumber = "9800000000",
                UserRole = "Admin"
            });
        }
        public DbSet<Books> Books { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderItem> OrderItem { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Cart> Cart { get; set; }
        public DbSet<CartItem> CartItem { get; set; }

        public DbSet<Announcement> Announcements { get; set; }
    }
}
