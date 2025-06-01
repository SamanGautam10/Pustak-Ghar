namespace Pustak_Ghar.Dto
{
    public class UpdateReviewDto
    {
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime ReviewOn { get; set; } = DateTime.Today;
    }
}
