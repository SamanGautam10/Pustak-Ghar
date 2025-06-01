using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Pustak_Ghar.Models;
using Pustak_Ghar.Services;
using Pustak_Ghar.Services.Interface;
using WebApplication1.Data;

namespace Pustak_Ghar.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DiscountController:ControllerBase
    {
        private readonly IDiscountService _discountService;
        public DiscountController( IDiscountService discountService)
        {
            _discountService = discountService;
        }
        [HttpGet("{id}")]
        public IActionResult eligible(string id)
        {
            var result = _discountService.eligiblitry_check(id);
            if (result == true)
            {
                return Ok(new
                {
                    IsEligible = true,
                    DiscountPercentage = 10,
                    Message = "Congratulations! You're eligible for a 10% discount.",
                });
            }
            else
            {
                return Ok(new
                {
                    IsEligible = false,
                    DiscountPercentage = 0,
                    Message = "You need to have 10 Orders placed  to fullfill this criteria",
                });
            }
        }

    }
}
