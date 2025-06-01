using Pustak_Ghar.Dto;
using Pustak_Ghar.Models;
namespace Pustak_Ghar.Services.Interface
{
    public interface BookInterface
    {
        public List<Books> getallBooks();
        public Books getbookByid(Guid id);
        public void addbook(BookAddDto books);
        public void deleteBook(Guid id);
        public void updateBook(Guid id, UpdateBookDto bookDto);
        public void updateDiscount(Guid id, UpdateDiscount discountDto);
        public void removeDiscount(Guid id);
        public List<Books> filterBooks(FilterBooksDto filterDto);
        public List<Books> GetRecentlyAddedBooks();
        public List<Books> GetTopSellingBooks();
        public List<Books> SortBooks(SortBooksDto sortBooksDto);
    }
}
