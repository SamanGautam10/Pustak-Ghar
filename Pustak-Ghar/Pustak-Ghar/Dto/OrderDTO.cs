using Microsoft.AspNetCore.Identity;
using Pustak_Ghar.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pustak_Ghar.Dto
{
    public class OrderDTO
    {
        public string UserId { get; set; }
        public decimal total { get; set; }
        public List<OrderItemDTO> OrderItems { get; set; }
    }
}
