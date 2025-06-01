using Microsoft.AspNetCore.Mvc;
using Pustak_Ghar.Dto;
using Pustak_Ghar.Services.Interface;
using System.Threading.Tasks;

namespace Pustak_Ghar.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminController : Controller
    {
        private readonly IAnnouncementService _announcementService;

        public AdminController(IAnnouncementService announcementService)
        {
            _announcementService = announcementService;
        }

        [HttpPost("create-announcement")]
        public async Task<IActionResult> CreateAnnouncement([FromForm] AnnouncementDto dto)
        {
            await _announcementService.CreateAnnouncementAsync(dto);
            return Ok(new
            {
                success = true,
                message = "Announcement created successfully"
            });
        }

        [HttpGet("unexpired-announcement")]
        public async Task<IActionResult> GetActiveAnnouncements()
        {
            var activeAnnouncements = await _announcementService.GetActiveAnnouncementsAsync();
            return Json(activeAnnouncements);
        }
    }
}
