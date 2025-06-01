using Pustak_Ghar.Enums;

namespace Pustak_Ghar.Dto
{
    public class FilterBooksDto
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Genre { get; set; }
        public string? Publisher { get; set; }
        public double? MinPrice { get; set; }
        public double? MaxPrice { get; set; }
        public DateTime? MinPublicationDate { get; set; }
        public DateTime? MaxPublicationDate { get; set; }
        public bool? IsInStock { get; set; }
        public bool? OnSale { get; set; }
        public bool? IsAwardWinning { get; set; }
        public string? Language { get; set; }
        public string? Format { get; set; }
        public int? MinSoldCount { get; set; }
        public double? MinRating { get; set; }
    }
}