using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pustak_Ghar.Models
{
    public class Cart
    {
        [Key]
        public Guid CardId { get; set; }
        public decimal GrossTotal{ get; set; } = 0.0m;
        public decimal OrderDiscount { get; set; } = 0.0m;

        [ForeignKey(nameof(IdentityUser))]
        public string UserId { get; set; } = null!;
        public virtual IdentityUser? User { get; set; }
        public virtual ICollection<CartItem> CartItem { get; set; } = new List<CartItem>();
    }
}
