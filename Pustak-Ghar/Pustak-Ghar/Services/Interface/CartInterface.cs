using Pustak_Ghar.Dto;
using Pustak_Ghar.Models;

namespace Pustak_Ghar.Services.Interface
{
    public interface CartInterface
    {
        public Cart AddBookToCart(CartDto dto);
    }
}
