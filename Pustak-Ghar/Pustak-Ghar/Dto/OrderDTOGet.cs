using Pustak_Ghar.Dto;

public class OrderDTOGet
{
    public Guid OrderId { get; set; }
    public string UserId { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; }
    public bool IsCanceled { get; set; }
    public decimal TotalAmount { get; set; }
    public string ClaimCode { get; set; }
    public List<GetOrdersItemsDTO> OrderItems { get; set; } 
}