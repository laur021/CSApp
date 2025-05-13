

using Application.DTOs;
using Application.Iinterfaces;
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
    public class TransactionLogsController(IUnitOfWork _unitOfWork) : ControllerBase
    {
        //[HttpGet]
        //public async Task<ActionResult<PagedResult<TransactionLogDto>>> GetAllTransactionLogsAsync([FromQuery] int skip = 0,
        //[FromQuery] int pageSize = 10)
        //{
        //    var obj = await _unitOfWork.TransactionLogRepo.GetAllAsync<TransactionLogDto>(skip: skip, pageSize: pageSize);

        //    return Ok(obj);
                
        //}

        [HttpGet("{Id}")]
        public async Task<ActionResult<PagedResult<TransactionLogDto>>> GetTransactionLogByTrnxIdAsync(string Id, [FromQuery] int skip = 0,
        [FromQuery] int pageSize = 10)
        {

            var obj = await _unitOfWork.TransactionLogRepo.GetAllAsync<TransactionLogDto>(skip: skip, pageSize: pageSize, x => x.TransactionId == Id);

            return obj is not null ?
                Ok(obj) :
                NotFound();
        }


        //[HttpGet("{Id}")]
        //public async Task<ActionResult> GetTransactionLogAsync(int Id)
        //{
        //    var obj = await _unitOfWork.TransactionLogRepo.GetAsync<TransactionLogDto>(x => x.TransactionId == Id);

        //    return obj is not null ?
        //        Ok(obj) :
        //        NotFound($"Log with ID {Id} not found.");
        //}

        [HttpPost]
        public async Task<IActionResult> AddTransactionLogsAsync(TransactionLogDto TransactionLogDto)
        {
            if (TransactionLogDto is null)
                return BadRequest("Invalid data.");

            var added = await _unitOfWork.TransactionLogRepo.AddAsync(TransactionLogDto);

           return Ok(added);
        }
    }
}
