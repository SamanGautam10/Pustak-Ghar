using Microsoft.AspNetCore.Identity;
using Pustak_Ghar.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Pustak_Ghar.Dto
{
    public class reviewDTO
    {
        public Guid ReviewId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime ReviewOn { get; set; } = DateTime.Today;
        public Guid BookId { get; set; }
        public string UserId { get; set; } = null!;
        public string username { get; set; }
   
    }
}
