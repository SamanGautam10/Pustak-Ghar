using Pustak_Ghar.Models;
using Pustak_Ghar.Services.Interface;
using WebApplication1.Data;
using Pustak_Ghar.Dto;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;

namespace Pustak_Ghar.Services
{
    public class OrderService : OrderInterface
    {
        private readonly ApplicationDbContext dbinstance;
        private readonly EmailService _emailService;

        public OrderService(ApplicationDbContext context, EmailService emailService)
        {
            dbinstance = context;
            _emailService = emailService;
        }

        public Order AddOrder(OrderDTO orderDTO)
        {
            if (orderDTO.OrderItems == null || orderDTO.OrderItems.Count < 1)
            {
                throw new ArgumentException("An order must contain at least one item.", nameof(orderDTO));
            }

            var user = dbinstance.Users
                .FirstOrDefault(u => u.Id == orderDTO.UserId);

            if (user == null)
            {
                throw new Exception("User not found");
            }
            if (string.IsNullOrWhiteSpace(user.Email))
            {
                throw new Exception("User email not found in database");
            }

            var order = new Order
            {
                OrderId = Guid.NewGuid(),
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                OrderItems = new List<OrderItem>(),
                UserId = orderDTO.UserId,
                TotalAmount = orderDTO.total
            };
            string userId = orderDTO.UserId.ToString();
            var userList = dbinstance.UserProfiles.ToList();
            for (int i = 0; i < userList.Count; i++)
            {
                if (userList[i].UserId.ToString() == userId)
                {
                    userList[i].OrderCount += 1;
                    break;
                }
            }
            foreach (var itemDTO in orderDTO.OrderItems)
            {
                var currentBook = dbinstance.Books.FirstOrDefault(b => b.BookId == itemDTO.BookId);

                if (currentBook == null)
                    throw new Exception($"Book with ID {itemDTO.BookId} not found.");

                if (currentBook.StockCount < itemDTO.Quantity)
                    throw new Exception($"Not enough stock only  for book only {currentBook.StockCount} available");

                currentBook.StockCount -= itemDTO.Quantity;

                var item = new OrderItem
                {
                    BookId = itemDTO.BookId,
                    Quantity = itemDTO.Quantity,
                    Price = currentBook.Price,
                    OrderId = order.OrderId
                };
                order.OrderItems.Add(item);
            }
            int randomSixDigits = new Random().Next(9999, 1_000_000);
            order.ClaimCode = $"PTGH{order.OrderDate:yyyy}{randomSixDigits:D6}";
            dbinstance.Add(order);
            dbinstance.SaveChanges();

            var emailSubject = "Your Pustak Ghar Order Confirmation";
            var emailBody = $@"
                <h2>Thank you for your order!</h2>
                <p>Order Details:</p>
                <ul>
                    <li><strong>Claim Code:</strong> {order.ClaimCode}</li>
                    <li><strong>Date:</strong> {order.OrderDate.ToString("f")}</li>
                    <li><strong>Total Amount:</strong> {order.TotalAmount:C}</li>
                </ul>
                <p>Please present this claim code when collecting your books.</p>";

            try
            {
                _emailService.SendEmail(user.Email, emailSubject, emailBody);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }

            return order;
        }

        public bool CancelOrder(Guid id)
        {
            var order = dbinstance.Order.FirstOrDefault(o => o.OrderId == id);
            if (order != null)
            {
                order.IsCanceled = true;
                order.Status = "Canceled";
                dbinstance.SaveChanges();
                return true;
            }
            return false;
        }

        public List<Order> getallorder()
        {
            var orderList = dbinstance.Order.ToList();
            foreach (var order in orderList)
            {
                order.OrderItems = dbinstance.OrderItem
                    .Where(oi => oi.OrderId == order.OrderId)
                    .ToList();
            }
            return orderList;
        }

        public List<OrderDTOGet> GetUserOrder(string id)
        {
            var userOrders = dbinstance.Order
                .Where(order => order.UserId == id)
                .ToList();

            var orderDTOs = userOrders.Select(order => new OrderDTOGet
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
                OrderDate = order.OrderDate,
                Status = order.Status,
                IsCanceled = order.IsCanceled,
                TotalAmount = order.TotalAmount,
                ClaimCode = order.ClaimCode,
                OrderItems = dbinstance.OrderItem
                    .Where(oi => oi.OrderId == order.OrderId)
                    .Join(dbinstance.Books,
                          oi => oi.BookId,
                          b => b.BookId,
                          (oi, b) => new GetOrdersItemsDTO
                          {
                              BookId = b.BookId,
                              Quantity = oi.Quantity,
                              BookTitle = b.Title,
                              BookAuthor = b.Author,
                              price = b.Price
                          })
                    .ToList()
            }).ToList();

            return orderDTOs;
        }

        public void updateOrderSatus(UpdateOrderStatusDto dto)
        {
            try
            {
                var order = dbinstance.Order.FirstOrDefault(o => o.OrderId == dto.OrderId);

                if (order == null)
                    throw new Exception("No order with the respective ID found.");

                if (order.IsCanceled)
                    throw new Exception("Cannot update a canceled order.");

                if (order.Status == "Delivered")
                    throw new Exception("Order is already delivered.");

                if (order.Status != "Pending")
                    throw new Exception("Only 'Pending' orders can be marked as 'Delivered'.");

                if (dto.Status != "Delivered")
                    throw new Exception("Only status 'Delivered' is allowed in this update.");

                order.Status = "Delivered";

                dbinstance.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to update order status: " + ex.Message);
            }
        }  
    }
}