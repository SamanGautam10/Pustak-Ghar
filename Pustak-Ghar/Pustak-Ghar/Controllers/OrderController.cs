using Microsoft.AspNetCore.Mvc;
using Pustak_Ghar.Dto;
using Pustak_Ghar.Services;
using Pustak_Ghar.Services.Interface;

namespace Pustak_Ghar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly OrderInterface _OrderService;

        public OrderController(OrderInterface orderservice)
        {
            _OrderService = orderservice;
        }
        [HttpPost("add")]
        public IActionResult AddOrder(OrderDTO instance)
        {
            try
            {
                if (instance == null)
                {
                    return BadRequest("Book data is required.");
                }

                _OrderService.AddOrder(instance);
                return Ok(new
                {
                    success = true,
                    message = "Order created successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                });
            }
        }
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteOrder(Guid id)
        {
            try
            {
                _OrderService.CancelOrder(id);
                return Ok(new { success = true, message = "Order cancelled successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error cancelling order: {ex.Message} - {ex.InnerException?.Message}");
            }
        }

        [HttpGet("all-orders")]
        public IActionResult GetAllOrders()
        {
            var orders = _OrderService.getallorder();
            if (orders == null || !orders.Any())
            {
                return NotFound(new { message = "No orders found." });
            }
            return Ok(orders); 
        }

        [HttpGet("user/orders/{id}")]
        public IActionResult GetUserOrders(string id)
        {
            var orders = _OrderService.GetUserOrder(id);
            if (orders == null || !orders.Any())
            {
                return NotFound(new { message = "No orders found." });
            }
            return Ok(orders);
        }

        [HttpPut("update-status")]
        public IActionResult UpdateOrderStatus([FromBody] UpdateOrderStatusDto dto)
        {
            try
            {
                if (dto == null || dto.OrderId == Guid.Empty || string.IsNullOrEmpty(dto.Status))
                {
                    return BadRequest("Invalid request data.");
                }

                _OrderService.updateOrderSatus(dto);
                return Ok(new
                {
                    success = true,
                    message = "Order status updated to Delivered."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error updating status: {ex.Message}"
                });
            }
        }
    }
}
