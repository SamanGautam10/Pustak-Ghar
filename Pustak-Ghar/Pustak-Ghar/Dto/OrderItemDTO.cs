using Pustak_Ghar.Models;

namespace Pustak_Ghar.Dto
{
    public class OrderItemDTO
    {
        public Guid BookId { get; set; }
        public int Quantity { get; set; }
    }
}
