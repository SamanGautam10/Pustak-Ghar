using Pustak_Ghar.Dto;
using Pustak_Ghar.Models;
using Pustak_Ghar.Services.Interface;
using System.Diagnostics;
using System.Security.Claims;
using WebApplication1.Data;

namespace Pustak_Ghar.Services
{
    public class WishlistService : WishlistInterface
    {
        private readonly ApplicationDbContext dbinstance;

        public WishlistService(ApplicationDbContext context)
        {
            dbinstance = context;
        }
        public void AddToWishList(AddWishlistDto addWishlistDto)
        {
            try
            {
                if (addWishlistDto.BookId == Guid.Empty)
                {
                    throw new Exception("Book ID is required.");
                }

                if (string.IsNullOrWhiteSpace(addWishlistDto.UserId))
                {
                    throw new Exception("User ID is required.");
                }

                bool bookAlreadyExist = dbinstance.Wishlists
                    .Any(w => w.BookId == addWishlistDto.BookId && w.UserId == addWishlistDto.UserId);
                if (bookAlreadyExist)
                {
                    var bookToRemove = dbinstance.Wishlists
                        .FirstOrDefault(w => w.BookId == addWishlistDto.BookId && w.UserId == addWishlistDto.UserId);

                    if (bookToRemove != null)
                    {
                        dbinstance.Wishlists.Remove(bookToRemove);
                        dbinstance.SaveChanges();
                        return;
                    }
                }
                else
                {
                    var wishlist = new Wishlist
                    {
                        AddedOn = DateTime.UtcNow,
                        BookId = addWishlistDto.BookId,
                        UserId = addWishlistDto.UserId
                    };

                    dbinstance.Wishlists.Add(wishlist);
                    dbinstance.SaveChanges();
                }


            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred: " + ex.Message);
            }
        }

        public void DeleteWishListItem(Guid wishlistId)
        {
            try
            {
                var wishlist = dbinstance.Wishlists.FirstOrDefault(w => w.WishlistId == wishlistId);
                if (wishlist == null)
                {
                    throw new Exception("Wishlist item not found.");
                }

                dbinstance.Wishlists.Remove(wishlist);
                dbinstance.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public List<WishlistDto> GetWishlistByUserId(string userId)
        {
            try
            {
                var wishlist = dbinstance.Wishlists
                    .Where(w => w.UserId == userId)
                    .Join(
                        dbinstance.Books,
                        w => w.BookId,
                        b => b.BookId,
                        (w, b) => new WishlistDto
                        {
                            WishlistId = w.WishlistId,
                            AddedOn = w.AddedOn,
                            BookId = b.BookId,
                            Title = b.Title,
                            Author = b.Author,
                            Price = b.Price,
                            format = (Enums.format)b.format,
                            rating = b.ratings
                        }
                    )
                    .ToList();
                if (wishlist == null || !wishlist.Any())
                {
                    throw new Exception("No wishlist items found.");
                }

                return wishlist;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred. " + ex.Message);
            }
        }

    }
}