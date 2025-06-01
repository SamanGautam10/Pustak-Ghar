using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pustak_Ghar.Models
{
    public class UserProfile
    {
        [Key]
        public Guid UserProfileId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public string UserRole { get; set; } = "Member";
        public int OrderCount { get; set; } = 0;
        public string UserId { get; set; } = null!;
        public IdentityUser User { get; set; } = null!;
    }
}
