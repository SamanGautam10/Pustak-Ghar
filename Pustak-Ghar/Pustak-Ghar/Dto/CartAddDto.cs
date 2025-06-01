namespace Pustak_Ghar.Dto
{
    public class CartItemDto
    {
        public Guid BookId { get; set; }
        public int Quantity { get; set; } = 1;
    }

    public class CartDto
    {
        public string UserId { get; set; } = null!;
        public CartItemDto Item { get; set; } = null!;
    }
}
