using Microsoft.AspNetCore.Mvc;
using Pustak_Ghar.Dto;
using Pustak_Ghar.Services.Interface;
using System.Security.Claims;

namespace Pustak_Ghar.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly WishlistInterface _wishlistService;
        public WishlistController(WishlistInterface wishlistInterface)
        {
            _wishlistService = wishlistInterface;
        }

        [HttpPost("add-to-wishlist")]
        public IActionResult AddToWishlist([FromBody] AddWishlistDto addWishlistDto)
        {
            try
            {
                if (addWishlistDto == null)
                {
                    return BadRequest("Wishlist data is required.");
                }

                // Call the service to add the book to the wishlist
                _wishlistService.AddToWishList(addWishlistDto);
                return Ok(new
                {
                    success = true,
                    message = "Book added to wishlist."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"{ex.Message}"
                });
            }
        }

        [HttpGet("get-wishlist")]
        public IActionResult GetWishlist(string userId)
        {
            try
            {
                var wishlist = _wishlistService.GetWishlistByUserId(userId);
                if (wishlist == null || !wishlist.Any())
                {
                    return NotFound("No books found in the wishlist.");
                }

                return Ok(wishlist);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"{ex.Message}"
                });
            }
        }

        [HttpDelete("delete-wishlist-item/{id:guid}")]
        public IActionResult DeleteWishlistItem(Guid id)
        {
            try
            {
                _wishlistService.DeleteWishListItem(id);
                return Ok(new
                {
                    success = true,
                    message = "Book deleted from wishlist."
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"{ex.Message}"
                }); ;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"{ex.Message}"
                });
            }
        }
    }
}
