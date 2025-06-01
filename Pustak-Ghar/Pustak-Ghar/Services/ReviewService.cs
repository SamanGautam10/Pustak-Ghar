using Microsoft.EntityFrameworkCore;
using Pustak_Ghar.Dto;
using Pustak_Ghar.Models;
using Pustak_Ghar.Services.Interface;
using System.Net;
using System.Security.Claims;
using WebApplication1.Data;

namespace Pustak_Ghar.Services
{
    public class ReviewService : IReview
    {
        private readonly ApplicationDbContext dbinstance;
        public ReviewService(ApplicationDbContext context)
        {
            dbinstance = context;
        }

        // This method is responsible for adding a review to the database.
        public void AddReview(AddReviewDto addReview)
        {
            try
            { 
                if (addReview.Comment.Length > 2500)
                {
                    throw new Exception("Comment cannot exceed 2500 characters.");
                }

                // Validate BookId: must not be an empty Guid
                if (addReview.BookId == Guid.Empty)
                {
                    throw new Exception("Book ID is required.");
                }

                // Validate UserId: must not be null or empty
                if (string.IsNullOrWhiteSpace(addReview.UserId))
                {
                    throw new Exception("User ID is required.");
                }

                // Check if user has purchased the book (via Order + OrderItem)
                bool hasPurchased = dbinstance.Order
                    .Where(o => o.UserId == addReview.UserId && !o.IsCanceled)
                    .Join(dbinstance.OrderItem,
                          order => order.OrderId,
                          item => item.OrderId,
                          (order, item) => new { order, item })
                    .Any(oi => oi.item.BookId == addReview.BookId);

                if (!hasPurchased)
                {
                    throw new Exception("You can only review books you have purchased.");
                }

                // Restricting user from adding more than one review for same book
                bool alreadyReviewed = dbinstance.Reviews.Any(r => r.BookId == addReview.BookId && r.UserId == addReview.UserId);

                if (alreadyReviewed)
                {
                    throw new Exception("User cannot post a new review for the same book more than once.");
                }

                var review = new Review
                {
                    Rating = addReview.Rating,
                    Comment = addReview.Comment,
                    ReviewOn = DateTime.UtcNow,
                    BookId = addReview.BookId,
                    UserId = addReview.UserId
                };
                dbinstance.Reviews.Add(review);
                dbinstance.SaveChanges();

                var book = dbinstance.Books.Where(b => b.BookId == addReview.BookId).Include(b => b.Reviews).FirstOrDefault();
                if (book != null)
                {
                    book.UpdateAverageRating();
                    dbinstance.Books.Update(book);
                    dbinstance.SaveChanges();
                }
                else
                {
                    throw new Exception("Book not found.");
                }
            }
            catch(Exception ex)
            {
                throw new Exception( ex.Message);
            }
        }
        public List<reviewDTO> GetReviewsByBookId(Guid bookId)
        {
            try
            {
                if (bookId == Guid.Empty)
                    throw new Exception("Book ID is required.");
                var reviews = dbinstance.Reviews
                    .Where(r => r.BookId == bookId)
                    .Select(r => new reviewDTO
                    {
                        ReviewId = r.ReviewId,
                        Rating = r.Rating,
                        Comment = r.Comment,
                        ReviewOn = r.ReviewOn,
                        BookId = r.BookId,
                        UserId = r.UserId,
                        username = dbinstance.UserProfiles.FirstOrDefault(up => up.UserId == r.UserId).FirstName.Substring(0, 1).ToUpper() + dbinstance.UserProfiles.FirstOrDefault(up => up.UserId == r.UserId).FirstName.Substring(1).ToLower()
                    })
                    .ToList();

                if (reviews == null || reviews.Count == 0)
                    throw new Exception("No reviews found for this book.");

                return reviews;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving reviews. " + ex.Message);
            }
        }



        public void DeleteReview(Guid reviewId, ClaimsPrincipal user)
        {
            try
            {
                var review = dbinstance.Reviews.FirstOrDefault(r => r.ReviewId == reviewId);
                if (review == null)
                    throw new Exception("Review not found.");
                var currentUserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (currentUserId == null)
                    throw new Exception("User not authenticated.");
                if (review.UserId != currentUserId)
                    throw new Exception("You are not authorized to delete this review.");
                dbinstance.Reviews.Remove(review);
                dbinstance.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void UpdateReview(Guid reviewId, UpdateReviewDto updateReview, ClaimsPrincipal user)
        {
            try
            {
                // Validate Rating: must be between 1 and 5
                if (updateReview.Rating < 1 || updateReview.Rating > 5)
                {
                    throw new Exception("Rating must be between 1 and 5.");
                }

                // Validate Comment: must not be null or exceed 2500 characters
                if (string.IsNullOrWhiteSpace(updateReview.Comment))
                {
                    throw new Exception("Comment cannot be null or empty.");
                }
                if (updateReview.Comment.Length > 2500)
                {
                    throw new Exception("Comment cannot exceed 2500 characters.");
                }

                // Get review that needs to be updated
                var review = dbinstance.Reviews.FirstOrDefault(r => r.ReviewId == reviewId);

                if (review == null)
                    throw new Exception("Review not found.");

                // Get current user ID from Claims
                var currentUserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (currentUserId == null)
                    throw new Exception("User not authenticated.");

                if (review.UserId != currentUserId)
                    throw new Exception("You are not authorized to update this review.");

                // Update fields
                review.Rating = updateReview.Rating;
                review.Comment = updateReview.Comment;
                review.ReviewOn = updateReview.ReviewOn;

                dbinstance.Reviews.Update(review);
                dbinstance.SaveChanges();
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
