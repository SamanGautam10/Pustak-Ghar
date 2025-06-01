using Pustak_Ghar.Enums;

namespace Pustak_Ghar.Dto
{
    public class BookAddDto
    {
        public string Title { get; set; }
        public string ISBN { get; set; }
        public string Description { get; set; }
        public string Author { get; set; }
        public string Publisher { get; set; } 
        public Genre Genre { get; set; }= Genre.Fiction;
        public decimal Price { get; set; }
        public DateTime PublicationDate { get; set; } = DateTime.Today;
        public int SoldCount { get; set; } = 0;
        public decimal? DiscountPercent { get; set; } = 0.0m;
        public int StockCount { get; set; } = 0;
        public bool? is_awardwinning { get; set; } = false;
        public DateTime? DiscountEndDate { get; set; }
        public format format { get; set; } = format.First;
        public Language language { get; set; } = Language.English;
        public float ratings { get; set; } = 0.0f;
    }
}
