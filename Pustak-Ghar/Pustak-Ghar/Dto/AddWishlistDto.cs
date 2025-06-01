namespace Pustak_Ghar.Dto
{
    public class AddWishlistDto
    {
        public Guid BookId { get; set; }
        public string UserId { get; set; } = null!;
    }
}
