using Microsoft.AspNetCore.Mvc;
using Pustak_Ghar.Dto;
using Pustak_Ghar.Services.Interface;

namespace Pustak_Ghar.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly IReview _reviewService;
        public ReviewController(IReview reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost("add-review")]
        public IActionResult AddReview([FromBody] AddReviewDto addReview)
        {
            try
            {
                if (addReview == null)
                {
                    return BadRequest("Review data is required.");
                }

                _reviewService.AddReview(addReview);
                return Ok(new
                {
                    success = true,
                    message = "Review added successfully."
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

        // This API endpoint is used to get review of a specific book from database
        [HttpGet("getbookreview/{id:guid}")]
        public IActionResult GetReviewsByBookId(Guid id)
        {
            try
            {
                var reviews = _reviewService.GetReviewsByBookId(id);

                if (reviews == null || !reviews.Any())
                {
                    return NotFound("No reviews found for this book.");
                }
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                });
            }
        }

        // This API endpoint is used to update a review in the database
        [HttpPut("update-review/{id:guid}")]
        public IActionResult UpdateReview(Guid id, [FromBody] UpdateReviewDto updateReview)
        {
            try
            {
                if (updateReview == null)
                {
                    return BadRequest("Review data is required.");
                }

                // Call the service to update the review
                _reviewService.UpdateReview(id, updateReview, User);
                return Ok(new
                {
                    success = true,
                    message = "Review updated successfully."
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message); // 403 error sent
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                });
            }
        }

        [HttpDelete("delete-review/{id:guid}")]
        public IActionResult DeleteReview(Guid id)
        {
            try
            {
                _reviewService.DeleteReview(id, User);
                return Ok(new
                {
                    success = true,
                    message = "Review deleted successfully."
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                });
            }
        }
    }
}
