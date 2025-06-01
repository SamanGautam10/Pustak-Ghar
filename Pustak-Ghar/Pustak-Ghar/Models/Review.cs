using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pustak_Ghar.Models
{
    public class Review
    {
        [Key]
        public Guid ReviewId { get; set; }
        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; }
        [MaxLength(2500, ErrorMessage = "Review text cannot exceed 2500 characters.")]
        public string? Comment { get; set; }
        public DateTime ReviewOn { get; set; } = DateTime.Today;
        public Guid BookId { get; set; }
        public Books Book { get; set; } = null!;

        [ForeignKey(nameof(IdentityUser))]
        public string UserId { get; set; } = null!;
        public virtual IdentityUser? User { get; set; }
    }
}
 