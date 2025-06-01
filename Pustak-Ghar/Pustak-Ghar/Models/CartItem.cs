using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pustak_Ghar.Models
{
    public class CartItem
    {
        [Key]
        public Guid CartItemId { get; set; }
        [ForeignKey("Cart")]
        public Guid CartId { get; set; }
        public virtual Cart Cart { get; set; } = null!;
        public Guid BookId { get; set; }
        public Books Book { get; set; } = null!;
        public decimal UnitPrice { get; set; } = 0.0m;
        public int Quantity { get; set; } = 1;
        public decimal TotalPrice { get; set; } = 0.0m;
    }
}
