

using Microsoft.AspNetCore.Authorization;
using Application.DTOs;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Application.Iinterfaces;

namespace API.Controllers
{
    [Authorize]
    [EnableCors("AllowOrigin")]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ActivityLogsController(IUnitOfWork _unitOfWork) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<PagedResult<ActivityLogDto>>> GetAllActivityLogsAsync([FromQuery] int skip = 0,
        [FromQuery] int pageSize = 10)
        {
            var obj = await _unitOfWork.ActivityLogRepo.GetAllAsync<ActivityLogDto>(skip: skip, pageSize: pageSize);

             return Ok(obj);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> GetActivityLogAsync(int Id)
        {
            var obj = await _unitOfWork.ActivityLogRepo.GetAsync<ActivityLogDto>(x => x.Id == Id);

            return obj is not null ?
                Ok(obj) :
                NotFound($"Log with ID {Id} not found.");
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> AddActivityLogsAsync(ActivityLogDto ActivityLogDto)
        {
            if (ActivityLogDto is null)
                return BadRequest("Invalid data.");

            var addedData = await _unitOfWork.ActivityLogRepo.AddAsync(ActivityLogDto);

            var isAdded = addedData is not null;

            return isAdded ?
                NoContent() :
                StatusCode(StatusCodes.Status500InternalServerError, "Error adding Activity log.");   
        }
    }
}
