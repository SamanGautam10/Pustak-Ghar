using Pustak_Ghar.Models;
namespace Pustak_Ghar.Dto
{
   public class GetOrdersItemsDTO
    {
        public Guid BookId { get; set; }
        public int Quantity { get; set; }
        public string BookTitle { get; set; }
        public string BookAuthor { get; set; }
        public decimal price { get; set; }
    }
}
