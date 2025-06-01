using Microsoft.AspNetCore.Mvc;
using Pustak_Ghar.Dto;
using Pustak_Ghar.Services.Interface;

namespace Pustak_Ghar.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CartController : ControllerBase
    {
        private readonly CartInterface _cartService;

        public CartController(CartInterface cartService)
        {
            _cartService = cartService;
        }

        [HttpPost("add-to-cart")]
        public IActionResult AddToCart([FromBody] CartDto cartDto)
        {
            try
            {
                var cart = _cartService.AddBookToCart(cartDto);
                return Ok(cart);
            }
            catch (Exception ex)
            {
                return BadRequest(new 
                { 
                    message = ex.Message 
                });
            }
        }
    }
}

