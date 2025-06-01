using Pustak_Ghar.Models;
using Pustak_Ghar.Services.Interface;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;

namespace Pustak_Ghar.Services
{
    public class DiscountService : IDiscountService
    {
        private readonly ApplicationDbContext _dbContext;

        public DiscountService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        
        public bool eligiblitry_check(string id)
        {
            var userProfile = _dbContext.UserProfiles
                .FirstOrDefault(up => up.UserId ==id);

            if (userProfile == null)
            {
                return (false);
            }
            if (userProfile.OrderCount > 10)
            {
                userProfile.OrderCount = 0;
                _dbContext.SaveChanges();
            }

            if (userProfile.OrderCount ==10)
            {
                return (true);
            }
            return (false);
        }
    }
}