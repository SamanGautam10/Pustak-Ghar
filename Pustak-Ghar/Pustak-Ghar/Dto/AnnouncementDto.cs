namespace Pustak_Ghar.Dto
{
    public class AnnouncementDto
    {
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public DateTime ExpireAt { get; set; }
        public IFormFile? Image { get; set; }
    }
}
