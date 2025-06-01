using Pustak_Ghar.Models;
using Pustak_Ghar.Dto;
namespace Pustak_Ghar.Services.Interface
{
    public interface OrderInterface
    {
        public Order AddOrder(OrderDTO order);
        public bool CancelOrder(Guid id);

        public List<OrderDTOGet> GetUserOrder(string id);
        public List<Order> getallorder();

        public void updateOrderSatus(UpdateOrderStatusDto order);
    }
}
