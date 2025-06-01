namespace Pustak_Ghar.Dto
{
    public class AddReviewDto
    {
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public Guid BookId { get; set; }
        public string UserId { get; set; } = null!;
    }
}
