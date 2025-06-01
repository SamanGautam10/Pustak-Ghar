namespace Pustak_Ghar.Dto
{
    public class UpdateOrderStatusDto
    {
        public Guid OrderId { get; set; }
        public string? Status { get; set; }
    }
}
