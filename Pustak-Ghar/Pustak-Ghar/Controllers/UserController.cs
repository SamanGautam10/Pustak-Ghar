using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Pustak_Ghar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        public UserController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("current-user-id")]
        public IActionResult GetCurrentUserId()
        {
            var user = _userManager.GetUserAsync(User).GetAwaiter().GetResult();
            if (user == null) return Unauthorized();
            return Ok(new {id=user.Id});
        }
    }
}