using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.Razor;
using Pustak_Ghar.Enums;
namespace Pustak_Ghar.Models
{
    public class Books
    {
        [Key]
        public Guid BookId { get; set; }
        public string Title { get; set; }
        public string ISBN { get; set; }
        public string Description { get; set; }
        public string Author { get; set; } 
        public string Publisher { get; set; } 
        public Genre ?Genre { get; set; }
        public decimal Price { get; set; }
        public decimal DiscountedPrice { get; set; } = 0.0m;
        public DateTime PublicationDate { get; set; } = DateTime.UtcNow.Date;
        public bool IsInStock { get; set; } = true;
        public int SoldCount { get; set; } = 0;
        public bool? OnSale { get; set; } = false;
        public decimal? DiscountPercent { get; set; } = 0.0m;
        public int StockCount { get; set; } = 10;
        public bool? is_awardwinning { get; set; } = false;
        public format? format { get; set; }
        public Language? language { get; set; }
        public float ratings { get; set; } = 0.0f;
        public DateTime? DiscountEndDate { get; set; }
        public DateTime? AddedDate { get; set; } = DateTime.UtcNow.Date;

        // Reference to Review model for foreign key
        public ICollection<Review>? Reviews { get; set; }

        // Reference to Wishlist model for foreign key
        public ICollection<Wishlist>? Wishlists { get; set; }

        // Call this method when saving or updating the book
        // This will update the price of book if there is any dicount
        public void CalculateDiscountedPrice()
        {
            bool isDiscountActive = DiscountPercent.HasValue && DiscountPercent.Value > 0 &&
                                    (!DiscountEndDate.HasValue || DiscountEndDate.Value > DateTime.UtcNow);
            if (isDiscountActive)
            {
                DiscountedPrice = Price - (Price * DiscountPercent.Value / 100);
                OnSale = true;
            }
            else
            {
                DiscountedPrice = 0.0m;
                DiscountPercent = 0.0m;
                OnSale = false;
            }
        }

        public void UpdateAverageRating()
        {
            if (Reviews != null && Reviews.Any())
            {
                ratings = (float)Reviews.Average(r => r.Rating);
            }
            else
            {
                ratings = 0.0f;
            }
        }
    }
}
