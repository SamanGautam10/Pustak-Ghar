using Pustak_Ghar.Enums;

namespace Pustak_Ghar.Dto
{
    public class UpdateBookDto
    {
        public string Title { get; set; }
        public string ISBN { get; set; }
        public string Description { get; set; }
        public string Author { get; set; }//Foreign Key here From Author Model  
        public string Publisher { get; set; } //Foreign key from publisher
        public Genre? Genre { get; set; }
        public decimal Price { get; set; }
        public DateTime PublicationDate { get; set; } = DateTime.Today;
        public decimal? DiscountPercent { get; set; } = 0.0m;
        public int StockCount { get; set; }
        public bool? is_awardwinning { get; set; } = false;
        public format? format { get; set; }
        public Language? language { get; set; } 
    }
}
