namespace Pustak_Ghar.Dto
{
    public class UpdateUserProfileDto
    {
        public string Email { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public string Address { get; set; } = null!;
    }
}
