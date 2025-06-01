using Microsoft.AspNetCore.Hosting;
using Pustak_Ghar.Dto;
using Pustak_Ghar.Models;
using Pustak_Ghar.Services.Interface;
using System;
using System.IO;
using System.Threading.Tasks;
using WebApplication1.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;

namespace Pustak_Ghar.Services
{
    public class AnnouncementService : IAnnouncementService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AnnouncementService(IWebHostEnvironment env, ApplicationDbContext context)
        {
            _env = env;
            _context = context;
        }

        public async Task CreateAnnouncementAsync(AnnouncementDto dto)
        {
            string? imageUrl = null;

            if (dto.Image != null)
            {
                var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                var uploadsFolder = Path.Combine(webRoot, "uploads");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using var fileStream = new FileStream(filePath, FileMode.Create);
                await dto.Image.CopyToAsync(fileStream);

                imageUrl = "/uploads/" + fileName;
            }

            var announcement = new Announcement
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Message = dto.Message,
                ExpireAt = DateTime.SpecifyKind(dto.ExpireAt, DateTimeKind.Utc),
                ImageUrl = imageUrl
            };

            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Announcement>> GetActiveAnnouncementsAsync()
        {
            return await _context.Announcements
                .Where(a => a.ExpireAt >= DateTime.UtcNow)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }
    }
}
