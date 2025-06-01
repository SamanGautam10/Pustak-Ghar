using Pustak_Ghar.Dto;
using Pustak_Ghar.Models;

namespace Pustak_Ghar.Services.Interface
{
    public interface IAnnouncementService
    {
        Task CreateAnnouncementAsync(AnnouncementDto dto);
        Task<List<Announcement>> GetActiveAnnouncementsAsync();
    }
}
