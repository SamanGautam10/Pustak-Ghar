using Pustak_Ghar.Dto;
using Pustak_Ghar.Models;
using System.Security.Claims;

namespace Pustak_Ghar.Services.Interface
{
    public interface IReview
    {
        public void AddReview(AddReviewDto addReview);
        public List<reviewDTO> GetReviewsByBookId(Guid bookId);
        public void UpdateReview(Guid reviewId, UpdateReviewDto updateReview, ClaimsPrincipal user);
        public void DeleteReview(Guid reviewId, ClaimsPrincipal user);
    }
}
