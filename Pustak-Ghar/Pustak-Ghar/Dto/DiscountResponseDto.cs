// DiscountResponseDto.cs
namespace Pustak_Ghar.Dto
{
    public class DiscountResponseDto
    {
        public bool IsEligible { get; set; }
        public int DiscountPercentage { get; set; }
        public string Message { get; set; }
        public int CurrentOrderCount { get; set; }
    }
}