using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pustak_Ghar.Models
{
    public class Wishlist
    {
        [Key]
        public Guid WishlistId { get; set; }
        public DateTime AddedOn { get; set; } = DateTime.Today;
        public Guid BookId { get; set; }

        [ForeignKey(nameof(IdentityUser))]
        public string UserId { get; set; } = null!;
        public virtual IdentityUser? User { get; set; }
    }
}
