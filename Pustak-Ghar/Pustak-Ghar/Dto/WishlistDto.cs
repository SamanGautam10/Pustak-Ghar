using Pustak_Ghar.Enums;
namespace Pustak_Ghar.Dto
{
    public class WishlistDto
    {
        public Guid WishlistId { get; set; }
        public DateTime AddedOn { get; set; }
        public Guid BookId { get; set; }
        public string Title { get; set; } = null!;
        public string Author { get; set; } = null!;
        public decimal Price { get; set; }
        public  format format { get; set; }
        public float rating { get; set; }
    }
}

