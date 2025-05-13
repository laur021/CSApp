using Microsoft.AspNetCore.Authorization;
using Application.DTOs;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Application.Iinterfaces;
using System.Linq.Expressions;
using Domain.Entities;

namespace API.Controllers
{
    [Authorize]
    [EnableCors("AllowOrigin")]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TransactionsController(IUnitOfWork _unitOfWork) : ControllerBase
    {
        [HttpGet("list")]
        public async Task<ActionResult> GetAllTransactionsAsync(
            [FromQuery] int skip = 0,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? transactionType = null,
            [FromQuery] string? customer = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string? search = null)
        {

            // Dates are already in UTC from frontend (converted using toISOString())
            DateTime fromDateValue = fromDate ?? DateTime.MinValue;
            DateTime toDateValue = toDate ?? DateTime.MaxValue;

            // Extract mode filter from search term
            int? modeFilter = null;
            string? remainingSearch = null;

            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.ToLower().Trim();

                if (searchLower.Contains("inbound"))
                {
                    modeFilter = 1; // Inbound
                    remainingSearch = searchLower.Replace("inbound", "").Trim();
                }
                else if (searchLower.Contains("outbound"))
                {
                    modeFilter = 2; // Outbound
                    remainingSearch = searchLower.Replace("outbound", "").Trim();
                }
                else
                {
                    remainingSearch = search;
                }
            }

            // DTO-level filtering
            Expression<Func<TransactionDto, bool>> filter = x =>
                (string.IsNullOrEmpty(transactionType) || x.TransactionType.ToLower().Trim() == transactionType.ToLower().Trim()) &&
                (string.IsNullOrEmpty(customer) || x.Customer.ToLower().Trim() == customer.ToLower().Trim()) &&
                (x.PickUpDate >= fromDateValue && x.PickUpDate <= toDateValue) &&
                (!modeFilter.HasValue || x.Mode == modeFilter.Value) && // Mode filter moved outside search conditions
                (string.IsNullOrEmpty(remainingSearch) || (
                    x.TransactionId.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.TransactionType.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.Customer.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.RepliedBy.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.ProductName.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.DescriptionName.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.Status.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.Remarks.ToLower().Contains(remainingSearch.ToLower().Trim())
                ));

            var result = await _unitOfWork.TransactionRepo.GetAllAsync<TransactionDto>(skip, pageSize, filter);

            return Ok(result);
        }

        [HttpGet("list/all")]
        public async Task<ActionResult> GetAllTransactionsListAsync(
            [FromQuery] string? transactionType = null,
            [FromQuery] string? customer = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string? search = null)
        {
            // Dates are already in UTC from frontend (converted using toISOString())
            DateTime fromDateValue = fromDate ?? DateTime.MinValue;
            DateTime toDateValue = toDate ?? DateTime.MaxValue;

            // Extract mode filter from search term
            int? modeFilter = null;
            string? remainingSearch = null;

            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.ToLower().Trim();

                if (searchLower.Contains("inbound"))
                {
                    modeFilter = 1; // Inbound
                    remainingSearch = searchLower.Replace("inbound", "").Trim();
                }
                else if (searchLower.Contains("outbound"))
                {
                    modeFilter = 2; // Outbound
                    remainingSearch = searchLower.Replace("outbound", "").Trim();
                }
                else
                {
                    remainingSearch = search;
                }
            }

            // DTO-level filtering
            Expression<Func<TransactionDto, bool>> filter = x =>
                (string.IsNullOrEmpty(transactionType) || x.TransactionType.ToLower().Trim() == transactionType.ToLower().Trim()) &&
                (string.IsNullOrEmpty(customer) || x.Customer.ToLower().Trim() == customer.ToLower().Trim()) &&
                (x.PickUpDate >= fromDateValue && x.PickUpDate <= toDateValue) &&
                (!modeFilter.HasValue || x.Mode == modeFilter.Value) && // Mode filter moved outside search conditions
                (string.IsNullOrEmpty(remainingSearch) || (
                    x.TransactionId.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.TransactionType.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.Customer.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.RepliedBy.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.ProductName.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.DescriptionName.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.Status.ToLower().Contains(remainingSearch.ToLower().Trim()) ||
                    x.Remarks.ToLower().Contains(remainingSearch.ToLower().Trim())
                ));

            var result = await _unitOfWork.TransactionRepo.GetAllListAsync<TransactionDto>(filter);

            return Ok(result);
        }

        [HttpGet("{transactionId}")]
        public async Task<ActionResult> GetTransactionAsync(string transactionId, [FromQuery] bool includeLogs = false)
        {
            object? result;

            if (includeLogs)
            {
                result = await _unitOfWork.TransactionRepo
                    .GetAsync<TransactionWithLogsDto>(x => x.TransactionId == transactionId);
            }
            else
            {
                result = await _unitOfWork.TransactionRepo
                    .GetAsync<TransactionDto>(x => x.TransactionId == transactionId);
            }

            if (result == null)
                return NotFound("Transaction not found.");

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddTransactionAsync(TransactionCreateDto transactionCreateDto)
        {
            if (transactionCreateDto is null)
                return BadRequest("Invalid transaction");

            var descExist = await _unitOfWork.DescriptionRepo.GetAsync(x => x.Id == transactionCreateDto.DescriptionId);

            if (descExist is null)
                return BadRequest("Invalid DescriptionId. The specified description does not exist.");

            var added = await _unitOfWork.TransactionRepo.AddAsync(transactionCreateDto);

            return Ok(added);
        }

        [HttpPut("{transactionId}")]
        public async Task<IActionResult> UpdateTransactionAsync(string transactionId, TransactionCreateDto transactionCreateDto)
        {
            if (transactionCreateDto is null)
                return BadRequest("Invalid transaction.");

            await _unitOfWork.TransactionRepo.UpdateAsync(transactionId, transactionCreateDto);

            var isUpdated = await _unitOfWork.SaveRegionAsync();

            return isUpdated ?
                NoContent() :
                StatusCode(StatusCodes.Status500InternalServerError, "Error updating transaction.");
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteTransactionAsync(int Id)
        {
            var isDeleted = await _unitOfWork.TransactionRepo.DeleteAsync(Id);
            return isDeleted
                ? NoContent()
                : NotFound($"Transaction with ID {Id} not found.");
        }
    }
}