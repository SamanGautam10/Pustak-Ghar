using Pustak_Ghar.Dto;
using Pustak_Ghar.Models;
using System.Security.Claims;

namespace Pustak_Ghar.Services.Interface
{
    public interface WishlistInterface
    {
        public void AddToWishList(AddWishlistDto addWishlistDto);
        public void DeleteWishListItem(Guid wishlistId);
        public List<WishlistDto> GetWishlistByUserId(string userId);
    }
}
