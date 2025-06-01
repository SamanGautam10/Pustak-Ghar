using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pustak_Ghar.Dto;
using Pustak_Ghar.Enums;
using Pustak_Ghar.Models;
using Pustak_Ghar.Services.Interface;
using WebApplication1.Data;
namespace Pustak_Ghar.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookController : ControllerBase
    {
        private readonly BookInterface _bookService;
        public BookController(BookInterface bookService)
        {
            _bookService = bookService;
        }

        // This API endpoint is used to get all the books from the database
        [HttpGet("{id}")]
        public IActionResult GetBookById(Guid id)
        {
            var book = _bookService.getbookByid(id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }

        [HttpGet("all-books")]
        public IActionResult GetAllBooks()
        {
            var books = _bookService.getallBooks();
            if (books == null || !books.Any())
            {
                return NotFound(new { message = "No books found" ,hasbook=false});
            }
            return Ok(books);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBookbyID(Guid id)
        {
            _bookService.deleteBook(id);
            return Ok(new { status = 200, message = "Book deleted successfully." });

        }

        [HttpPost("/book/add")]
        public IActionResult CreateAbook([FromBody] BookAddDto bookinstance)
        {
            try
            {
                if (bookinstance == null)
                {
                    return BadRequest("Book data is required.");
                }

                _bookService.addbook(bookinstance);

                return Ok(new
                {
                    success = true,
                    message = "Book created successfully"
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

        // This API endpoint updated the book details 
        [HttpPut("update-book/{id:guid}")]
        public IActionResult UpdateBook(Guid id, [FromBody] UpdateBookDto bookDto)
        {
            try
            {
                _bookService.updateBook(id, bookDto);
                return Ok(new 
                { 
                    status = 200, 
                    message = "Book updated successfully." 
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

        [HttpPut("update-discount/{id:guid}")]
        public IActionResult UpdateDiscount(Guid id, [FromBody] UpdateDiscount discountDto)
        {
            try
            {
                _bookService.updateDiscount(id, discountDto);
                return Ok( new{status=200,message="Discount applied successfully."});
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = 400, message = $"Error applying discount: {ex.Message}" });
            }
        }

        [HttpPut("remove-discount/{id:guid}")]
        public IActionResult RemoveDiscount(Guid id)
        {
            try
            {
                _bookService.removeDiscount(id);
                return Ok(new { statusCode = 200, message = "Discount removed successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = 400, error = $"Error removing discount: {ex.Message}" });
            }
        }

        [HttpPost("filter-books")]
        public IActionResult FilterBooks([FromBody] FilterBooksDto filterDto)
        {
            try
            {
                var filteredBooks = _bookService.filterBooks(filterDto);
                if (filteredBooks == null || !filteredBooks.Any())
                {
                    return NotFound(new { message = "No books found with the given filters." });
                }
                return Ok(filteredBooks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = 400, message = $"Error filtering books: {ex.Message}" });
            }
        }

        // This API is used to get 4 recently added books
        [HttpGet("recently-added")]
        public IActionResult GetRecentlyAddedBooks()
        {
            var books = _bookService.GetRecentlyAddedBooks();
            if (books == null || !books.Any())
            {
                return NotFound(new { message = "No recently added books found." });
            }
            return Ok(books);
        }

        [HttpPost("sort-books")]
        public IActionResult SortBooks([FromBody] SortBooksDto sortDto)
        {
            try
            {
                var sortedBooks = _bookService.SortBooks(sortDto);
                if (sortedBooks == null || !sortedBooks.Any())
                {
                    return NotFound(new { message = "No books found." });
                }
                return Ok(sortedBooks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = 400, message = $"Error sorting books: {ex.Message}" });
            }
        }

    }
}