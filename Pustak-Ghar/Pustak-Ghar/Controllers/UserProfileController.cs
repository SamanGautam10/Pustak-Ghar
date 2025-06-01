using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Pustak_Ghar.Dto;
using Pustak_Ghar.Models;
using WebApplication1.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;

[ApiController]
[Route("[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ApplicationDbContext _context;

    public AccountController(UserManager<IdentityUser> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserProfileDto model)
    {
        try
        {
            if (!System.Text.RegularExpressions.Regex.IsMatch(model.FirstName, @"^[A-Za-z]+$"))
            {
                return BadRequest(new 
                { 
                    status = "Error", 
                    message = "First name must contain only alphabets." 
                });
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(model.LastName, @"^[A-Za-z]+$"))
            {
                return BadRequest(new 
                { 
                    status = "Error", 
                    message = "Last name must contain only alphabets." 
                });
            }

            // Check if phone number contains only digits
            if (!System.Text.RegularExpressions.Regex.IsMatch(model.PhoneNumber, @"^\d+$"))
            {
                return BadRequest(new 
                { 
                    status = "Error", 
                    message = "Phone number must contain only digits." 
                });
            }

            // Check if phone number is exactly 10 digits long
            if (model.PhoneNumber.Length != 10)
            {
                return BadRequest(new 
                { 
                    status = "Error", 
                    message = "Phone number must be exactly 10 digits long." 
                });
            }

            // Check if phone number starts with 97 or 98
            if (!model.PhoneNumber.StartsWith("97") && !model.PhoneNumber.StartsWith("98"))
            {
                return BadRequest(new 
                { 
                    status = "Error", 
                    message = "Phone number must start with 97 or 98." 
                });
            }

            var existingUserByEmail = await _userManager.FindByEmailAsync(model.Email);
            if (existingUserByEmail != null)
            {
                return BadRequest(new
                {
                    status = "Error",
                    message = "Email address is already registered."
                });
            }

            // Check if phone number already exists
            var existingUserByPhone = _context.UserProfiles.FirstOrDefault(p => p.PhoneNumber == model.PhoneNumber);
            if (existingUserByPhone != null)
            {
                return BadRequest(new
                {
                    status = "Error",
                    message = "Phone number is already registered."
                });
            }

            // Saving data of user in ASPNetUser table
            var user = new IdentityUser
            {
                UserName = model.Email,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(new
                {
                    status = 400,
                    result.Errors
                });

            var profile = new UserProfile
            {
                UserId = user.Id,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Address = model.Address,
                Gender = model.Gender,
                PhoneNumber = model.PhoneNumber,
                UserRole="Member"
            };

            _context.UserProfiles.Add(profile);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = "Success",
                message = "User registered successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = $"Error occured: {ex.Message}"
            });
        }
    }

    [HttpPut("update-profile/{userId}")]
    public async Task<IActionResult> UpdateUserProfile(string userId, [FromBody] UpdateUserProfileDto model)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new 
                { 
                    status = "Error", 
                    message = "User not found." 
                });

            if (!System.Text.RegularExpressions.Regex.IsMatch(model.FirstName, @"^[A-Za-z]+$"))
            {
                return BadRequest(new 
                { 
                    status = "Error", 
                    message = "First name must contain only alphabets." 
                });
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(model.LastName, @"^[A-Za-z]+$"))
            {
                return BadRequest(new 
                { status = "Error", 
                    message = "Last name must contain only alphabets." 
                });
            }

            // Check if phone number contains only digits
            if (!System.Text.RegularExpressions.Regex.IsMatch(model.PhoneNumber, @"^\d+$"))
            {
                return BadRequest(new 
                { 
                    status = "Error", 
                    message = "Phone number must contain only digits." 
                });
            }

            // Check if phone number is exactly 10 digits long
            if (model.PhoneNumber.Length != 10)
            {
                return BadRequest(new 
                { 
                    status = "Error",
                    message = "Phone number must be exactly 10 digits long." 
                });
            }

            // Check if phone number starts with 97 or 98
            if (!model.PhoneNumber.StartsWith("97") && !model.PhoneNumber.StartsWith("98"))
            {
                return BadRequest(new 
                { 
                    status = "Error", message = "Phone number must start with 97 or 98." 
                });
            }

            // Check if email already exists for another user
            var existingUserWithEmail = await _userManager.FindByEmailAsync(model.Email);
            if (existingUserWithEmail != null && existingUserWithEmail.Id != userId)
            {
                return BadRequest(new 
                { 
                    status = "Error", 
                    message = "Email address is already taken by another user." 
                });
            }

            // Check if phone number already exists for another user
            var duplicatePhoneUser = _context.UserProfiles
                .FirstOrDefault(p => p.PhoneNumber == model.PhoneNumber && p.UserId != userId);

            if (duplicatePhoneUser != null)
            {
                return BadRequest(new 
                { 
                    status = "Error", 
                    message = "Phone number is already used by another user." 
                });
            }

            // Update Identity Email
            user.Email = model.Email;
            user.UserName = model.Email;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Failed to update email.",
                    updateResult.Errors
                });
            }

            // Update UserProfile data
            var profile = _context.UserProfiles.FirstOrDefault(p => p.UserId == user.Id);
            if (profile == null)
                return NotFound(new 
                { 
                    status = "Error", 
                    message = "User profile not found." 
                });

            profile.FirstName = model.FirstName;
            profile.LastName = model.LastName;
            profile.PhoneNumber = model.PhoneNumber;
            profile.Address = model.Address;
            profile.Gender = model.Gender;

            _context.UserProfiles.Update(profile);
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                status = "Success", 
                message = "Profile updated successfully." 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = "Error",
                message = $"An error occurred: {ex.Message}"
            });
        }
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(model.UserId) || string.IsNullOrWhiteSpace(model.OldPassword)
                || string.IsNullOrWhiteSpace(model.NewPassword) || string.IsNullOrWhiteSpace(model.ConfirmPassword))
            {
                return BadRequest(new
                {
                    status = "Error",
                    message = "All fields are required."
                });
            }

            if (model.OldPassword == model.NewPassword)
            {
                return BadRequest(new
                {
                    status = "Error",
                    message = "New password cannot be the same as the old password."
                });
            }

            if (model.NewPassword != model.ConfirmPassword)
            {
                return BadRequest(new
                {
                    status = "Error",
                    message = "New password and confirm password do not match."
                });
            }

            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                return NotFound(new
                {
                    status = "Error",
                    message = "User not found."
                });
            }

            var passwordCheck = await _userManager.CheckPasswordAsync(user, model.OldPassword);
            if (!passwordCheck)
            {
                return BadRequest(new
                {
                    status = "Error",
                    message = "Old password is incorrect."
                });
            }

            var changeResult = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            if (!changeResult.Succeeded)
            {
                return BadRequest(new
                {
                    status = "Error",
                    message = "Failed to change password.",
                    errors = changeResult.Errors
                });
            }

            return Ok(new
            {
                status = "Success",
                message = "Password changed successfully."
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = "Error",
                message = $"An error occurred: {ex.Message}"
            });
        }
    }
    [HttpGet("profile/{userId}")]
public async Task<IActionResult> GetUserProfile(string userId)
{
    try
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound(new { status = "Error", message = "User not found." });
        }

        var profile = _context.UserProfiles.FirstOrDefault(p => p.UserId == userId);
        if (profile == null)
        {
            return NotFound(new { status = "Error", message = "User profile not found." });
        }

        return Ok(new
        {
            userId = user.Id,
            email = user.Email,
            firstName = profile.FirstName,
            lastName = profile.LastName,
            phoneNumber = profile.PhoneNumber,
            gender = profile.Gender,    
            address = profile.Address,
            userRole = profile.UserRole,
            orderCount = profile.OrderCount,
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new
        {
            status = "Error",
            message = $"An error occurred: {ex.Message}"
        });
    }
}
}
