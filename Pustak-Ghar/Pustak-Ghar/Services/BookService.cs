using Pustak_Ghar.Models;
using Pustak_Ghar.Services.Interface;
using WebApplication1.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using Pustak_Ghar.Dto;
using System.Runtime.CompilerServices;
using Pustak_Ghar.Enums;
using System.Text.RegularExpressions;

namespace Pustak_Ghar.Services
{
    public class BookService : BookInterface
    {
        private readonly ApplicationDbContext dbinstance;

        public BookService(ApplicationDbContext context)
        {
            dbinstance = context;
        }
        public void addbook(BookAddDto bookDto)
        {
            try
            {
                bool titleExists = dbinstance.Books.Any(b => b.Title.ToLower() == bookDto.Title.ToLower());
                if (titleExists)
                {
                    throw new Exception("A book with the same title already exists.");
                }

                if (Regex.IsMatch(bookDto.Title, @"^\d+$"))
                {
                    throw new Exception("Book title cannot be only numeric.");
                }

                if (!decimal.TryParse(bookDto.Price.ToString(), out decimal price) || price < 0)
                {
                    throw new Exception("Invalid price. Price must be a numeric value and non-negative.");
                }

                if (string.IsNullOrEmpty(bookDto.ISBN) || bookDto.ISBN.Length != 13)
                {
                    throw new Exception("ISBN must be exactly 13 characters long.");
                }

                if (bookDto.DiscountPercent.HasValue && bookDto.DiscountPercent.Value < 0)
                {
                    throw new Exception("Invalid discount. Discount cannot be less than 0.");
                }

                // ISBN validation: must be 13 characters and can only contain digits or end with 'X'
                if (!Regex.IsMatch(bookDto.ISBN, @"^\d{12}[\dX]$"))
                {
                    throw new Exception("ISBN can only contain digits, except for an optional 'X' at the end.");
                }

                if (Regex.IsMatch(bookDto.Author, @"\d"))
                {
                    throw new Exception("Author name cannot contain numeric values.");
                }

                if (Regex.IsMatch(bookDto.Publisher, @"^\d+$"))
                {
                    throw new Exception("Publisher name cannot be only numeric.");
                }

                if (bookDto.PublicationDate > DateTime.UtcNow)
                {
                    throw new Exception("Publication date cannot be in the future.");
                }

                var book = new Books
                {
                    BookId = Guid.NewGuid(),
                    Title = bookDto.Title,
                    ISBN = bookDto.ISBN,
                    Description = bookDto.Description,
                    Author = bookDto.Author,
                    Publisher = bookDto.Publisher,
                    Genre = bookDto.Genre,
                    Price = price,
                    DiscountedPrice = (decimal)(bookDto.Price - (bookDto.Price * bookDto.DiscountPercent / 100)),
                    PublicationDate = DateTime.SpecifyKind(bookDto.PublicationDate, DateTimeKind.Utc),
                    DiscountEndDate = bookDto.DiscountEndDate,
                    OnSale = bookDto.DiscountPercent > 0,
                    IsInStock = bookDto.StockCount > 0,
                    SoldCount = 0,
                    DiscountPercent = bookDto.DiscountPercent,
                    StockCount = bookDto.StockCount,
                    is_awardwinning = bookDto.is_awardwinning,
                    format = bookDto.format,
                    language = bookDto.language,
                    ratings = bookDto.ratings,
                };
                dbinstance.Books.Add(book);
                dbinstance.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding book: " + ex.Message);
            }
        }
        public void deleteBook(Guid id)
        {
            try
            {
                var book = dbinstance.Books.FirstOrDefault(b => b.BookId == id);
                if (book == null)
                    throw new Exception("Book not found!");
                dbinstance.Books.Remove(book);
                dbinstance.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting book: " + ex.Message);
            }
        }

        public List<Books> getallBooks()
        {
            try
            {
                List<Books> bookListFromPostgres = dbinstance.Books.ToList();
                bool isUpdated = false;

                foreach (var book in bookListFromPostgres)
                {
                    // Check if the discount has expired
                    if (book.DiscountEndDate.HasValue && book.DiscountEndDate.Value <= DateTime.UtcNow)
                    {
                        book.DiscountPercent = 0.0m;
                        book.DiscountedPrice = 0.0m;
                        book.OnSale = false;
                        book.DiscountEndDate = null;
                        isUpdated = true;
                    }
                    else
                    {
                        book.CalculateDiscountedPrice();
                    }
                }

                if (isUpdated)
                {
                    dbinstance.SaveChanges();
                }

                return bookListFromPostgres;
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving books: " + ex.Message);
            }
        }

        public Books getbookByid(Guid id)
        {
            try
            {
                var book = dbinstance.Books.FirstOrDefault(b => b.BookId == id);
                if (book == null)
                    throw new Exception("No book found with Given ID");

                bool isUpdated = false;

                    // Check if the discount has expired
                    if (book.DiscountEndDate.HasValue && book.DiscountEndDate.Value <= DateTime.UtcNow)
                    {
                    book.DiscountPercent = 0.0m;
                    book.DiscountedPrice = 0.0m;
                    book.OnSale = false;
                    book.DiscountEndDate = null;
                    isUpdated = true;
                }
                else
                {
                    // Recalculate discount if it's still valid
                    book.CalculateDiscountedPrice();
                }

                if (isUpdated)
                {
                    dbinstance.SaveChanges();
                }

                return book;
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving book: " + ex.Message);
            }
        }

        public void updateBook(Guid id, UpdateBookDto bookDto)
        {
            try
            {
                var book = dbinstance.Books.FirstOrDefault(b => b.BookId == id);
                if (book == null)
                    throw new Exception("Book not found!");

                if (Regex.IsMatch(bookDto.Title, @"^\d+$"))
                {
                    throw new Exception("Book title cannot be only numeric.");
                }

                if (!decimal.TryParse(bookDto.Price.ToString(), out decimal price) || price < 0)
                {
                    throw new Exception("Invalid price. Price must be numeric and non-negative.");
                }

                if (string.IsNullOrEmpty(bookDto.ISBN) || bookDto.ISBN.Length != 13)
                {
                    throw new Exception("ISBN must be exactly 13 characters long.");
                }

                // ISBN validation: must be 13 characters and can only contain digits or end with 'X'
                if (!Regex.IsMatch(bookDto.ISBN, @"^\d{12}[\dX]$"))
                {
                    throw new Exception("ISBN can only contain digits, except for an optional 'X' at the end.");
                }

                if (Regex.IsMatch(bookDto.Author, @"\d"))
                {
                    throw new Exception("Author name cannot contain numeric values.");
                }

                if (Regex.IsMatch(bookDto.Publisher, @"^\d+$"))
                {
                    throw new Exception("Publisher name cannot be only numeric.");
                }

                if (bookDto.PublicationDate > DateTime.UtcNow)
                {
                    throw new Exception("Publication date cannot be in the future.");
                }

                bool titleExists = dbinstance.Books.Any(b =>
                    b.BookId != id &&
                    b.Title.ToLower() == bookDto.Title.ToLower());

                if (titleExists)
                {
                    throw new Exception("Another book with the same title already exists.");
                }
                book.Title = bookDto.Title;
                book.ISBN = bookDto.ISBN;
                book.Price = price;
                book.Author = bookDto.Author;
                book.Genre = bookDto.Genre;
                book.Publisher = bookDto.Publisher;
                book.DiscountPercent = bookDto.DiscountPercent;
                book.PublicationDate = DateTime.SpecifyKind(bookDto.PublicationDate, DateTimeKind.Utc);
                book.DiscountedPrice = (decimal)(book.Price - (book.Price * book.DiscountPercent / 100));
                book.Description = bookDto.Description;
                book.StockCount = bookDto.StockCount;
                book.IsInStock = bookDto.StockCount > 0 ||
                                 dbinstance.Books.Any(b => b.BookId == id && b.StockCount > 0);
                book.is_awardwinning = bookDto.is_awardwinning;
                book.format = bookDto.format;
                book.language = bookDto.language;

                book.CalculateDiscountedPrice();

                dbinstance.Books.Update(book);
                dbinstance.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void updateDiscount(Guid id, UpdateDiscount discountDto)
        {
            try
            {
                var discount = dbinstance.Books.FirstOrDefault(b => b.BookId == id);
                if (discount == null)
                    throw new Exception("Book not found!");

                if (discountDto.DiscountPercent < 0)
                    throw new Exception("Discount cannot be less than 0.");

                if (discountDto.DiscountEndDate.HasValue && discountDto.DiscountEndDate.Value <= DateTime.UtcNow)
                    throw new Exception("Discount end date must be in the future.");

                discount.DiscountPercent = discountDto.DiscountPercent;
                discount.DiscountEndDate = discountDto.DiscountEndDate;

                discount.CalculateDiscountedPrice();

                dbinstance.Books.Update(discount);
                dbinstance.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void removeDiscount(Guid id)
        {
            try
            {
                var discount = dbinstance.Books.FirstOrDefault(b => b.BookId == id);
                if (discount == null)
                    throw new Exception("Book not found!");
                if (discount.DiscountPercent == 0)
                    throw new Exception("Discount is not applied yet in this book!");  
                discount.DiscountPercent = 0;
                discount.OnSale = false;
                discount.CalculateDiscountedPrice();
                dbinstance.Books.Update(discount);
                dbinstance.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public List<Books> filterBooks(FilterBooksDto filterDto)
        {
            try
            {
                IQueryable<Books> query = dbinstance.Books.AsQueryable();

                // Title filter
                if (!string.IsNullOrEmpty(filterDto.Title))
                {
                    query = query.Where(b => b.Title.ToLower().Contains(filterDto.Title.ToLower()));
                }

                // Author filter
                if (!string.IsNullOrEmpty(filterDto.Author))
                {
                    query = query.Where(b => b.Author.ToLower().Contains(filterDto.Author.ToLower()));
                }

                if (!string.IsNullOrEmpty(filterDto.Genre))
                {
                    if (Enum.TryParse<Genre>(filterDto.Genre, true, out var genre))
                    {
                        query = query.Where(b => b.Genre == genre);
                    }
                }

                if (!string.IsNullOrEmpty(filterDto.Format))
                {
                    if (Enum.TryParse<format>(filterDto.Format, true, out var formatEnum))
                    {
                        query = query.Where(b => b.format == formatEnum);
                    }
                }

                // Publisher filter
                if (!string.IsNullOrEmpty(filterDto.Publisher))
                {
                    query = query.Where(b => b.Publisher.ToLower().Contains(filterDto.Publisher.ToLower()));
                }

                if (filterDto.MinPrice.HasValue || filterDto.MaxPrice.HasValue)
                {
                    decimal minPrice = filterDto.MinPrice.HasValue ? (decimal)filterDto.MinPrice.Value : decimal.MinValue;
                    decimal maxPrice = filterDto.MaxPrice.HasValue ? (decimal)filterDto.MaxPrice.Value : decimal.MaxValue;


                }
                if (filterDto.MinPublicationDate.HasValue)
                {
                    query = query.Where(b => b.PublicationDate >= filterDto.MinPublicationDate.Value);
                }
                if (filterDto.MaxPublicationDate.HasValue)
                {
                    query = query.Where(b => b.PublicationDate <= filterDto.MaxPublicationDate.Value);
                }

                // Stock status filter
                if (filterDto.IsInStock.HasValue)
                {
                    query = query.Where(b => b.IsInStock == filterDto.IsInStock.Value);
                }

                // Sale status filter
                if (filterDto.OnSale.HasValue)
                {
                    query = query.Where(b => b.OnSale == filterDto.OnSale.Value);
                }

                // Award winning filter
                if (filterDto.IsAwardWinning.HasValue)
                {
                    query = query.Where(b => b.is_awardwinning == filterDto.IsAwardWinning.Value);
                }

                // Language filter - now supports multiple languages
                if (!string.IsNullOrEmpty(filterDto.Language))
                {
                    if (Enum.TryParse<Language>(filterDto.Language, true, out var language))
                    {
                        query = query.Where(b => b.language == language);
                    }
                }

                // Sold count filter
                if (filterDto.MinSoldCount.HasValue)
                {
                    query = query.Where(b => b.SoldCount >= filterDto.MinSoldCount.Value);
                }

                // Rating filter
                if (filterDto.MinRating.HasValue)
                {
                    query = query.Where(b => b.ratings >= filterDto.MinRating.Value);
                }

                return query.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        // Get top 4 recently added books
        public List<Books> GetRecentlyAddedBooks()
        {
            return dbinstance.Books
                .OrderByDescending(b => b.AddedDate)
                .Take(4)
                .ToList();
        }

        // Get top 4 best selling books
        public List<Books> GetTopSellingBooks()
        {
            return dbinstance.Books
                .OrderByDescending(b => b.SoldCount)
                .Take(4)
                .ToList();
        }

        public List<Books> SortBooks(SortBooksDto sortDto)
            {
                var books = dbinstance.Books.AsQueryable();

                if (string.IsNullOrWhiteSpace(sortDto.SortField) || string.IsNullOrWhiteSpace(sortDto.SortOrder))
                {
                    return books.OrderBy(b => b.Title).ToList();
                }
                bool descending = sortDto.SortOrder.ToLower() == "desc";
                switch (sortDto.SortField.ToLower())
                {
                    case "title":
                        books = descending ? books.OrderByDescending(b => b.Title) : books.OrderBy(b => b.Title);
                        break;
                    case "price":
                        books = descending ? books.OrderByDescending(b => b.Price) : books.OrderBy(b => b.Price);
                        break;
                    default:
                        books = books.OrderBy(b => b.Title);
                        break;  
                }
                return books.ToList();
            }


    }
}