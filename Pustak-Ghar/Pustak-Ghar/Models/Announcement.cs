using System.ComponentModel.DataAnnotations;

namespace Pustak_Ghar.Models
{
    public class Announcement
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime ExpireAt { get; set; }

        public bool IsActive => DateTime.UtcNow <= ExpireAt;
    }
}
