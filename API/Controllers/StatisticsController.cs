using Application.Iinterfaces;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [EnableCors("AllowOrigin")]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class StatisticsController(IUnitOfWork _unitOfWork) : ControllerBase
    {
        [HttpGet("User")]
        public async Task<IActionResult> GetUserSummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var result = await _unitOfWork.UserCountSummaryRepo.ExecuteStoredProcedureAsync("[dbo].[UserSummary]", startDate, endDate);
            return Ok(result);
        }

        [HttpGet("Product")]
        public async Task<IActionResult> GetProductSummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var result = await _unitOfWork.ProductSummaryRepo.ExecuteStoredProcedureAsync("[dbo].[ProductSummary]", startDate, endDate);
            return Ok(result);
        }

        [HttpGet("Description")]
        public async Task<IActionResult> GetDescriptionSummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var result = await _unitOfWork.DescriptionSummaryRepo.ExecuteStoredProcedureAsync("[dbo].[DescriptionSummary]", startDate, endDate);
            return Ok(result);
        }

        [HttpGet("Transaction")]
        public async Task<IActionResult> GetTransactionSummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var result = await _unitOfWork.TransactionSummaryRepo.ExecuteStoredProcedureAsync("[dbo].[TransactionSummary]", startDate, endDate);
            return Ok(result);
        }
    }
}
