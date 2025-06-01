using Pustak_Ghar.Dto;
using Pustak_Ghar.Models;
using Pustak_Ghar.Services.Interface;
using WebApplication1.Data;

namespace Pustak_Ghar.Services
{
    public class CartsService : CartInterface
    {
        private readonly ApplicationDbContext _context;

        public CartsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public Cart AddBookToCart(CartDto dto)
        {
            var userId = dto.UserId;
            var bookId = dto.Item.BookId;
            var quantity = dto.Item.Quantity;

            var cart = _context.Cart.FirstOrDefault(c => c.UserId == userId);
            if (cart == null)
            {
                cart = new Cart { CardId = Guid.NewGuid(), UserId = userId };
                _context.Cart.Add(cart);
                _context.SaveChanges();
            }

            var book = _context.Books.Find(bookId);
            if (book == null) throw new Exception("Book not found.");

            var price = book.DiscountPercent > 0
                ? book.Price - (book.Price * book.DiscountPercent.Value / 100)
                : book.Price;

            var existingItem = _context.CartItem.FirstOrDefault(ci => ci.CartId == cart.CardId && ci.BookId == bookId);
            if (existingItem != null)
            {
                // If item already exists in cart, increase quantity instead of adding duplicate
                existingItem.Quantity += quantity;
                existingItem.TotalPrice = existingItem.UnitPrice * existingItem.Quantity;
                _context.CartItem.Update(existingItem);
            }
            else
            {
                var cartItem = new CartItem
                {
                    CartItemId = Guid.NewGuid(),
                    CartId = cart.CardId,
                    BookId = bookId,
                    Quantity = quantity,
                    UnitPrice = price,
                    TotalPrice = price * quantity
                };

                _context.CartItem.Add(cartItem);
            }

            _context.SaveChanges();

            // Recalculate gross total
            cart.GrossTotal = _context.CartItem
                .Where(c => c.CartId == cart.CardId)
                .Sum(c => c.TotalPrice);

            _context.Cart.Update(cart);
            _context.SaveChanges();

            return cart;
        }
    }
}
