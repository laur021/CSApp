

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
    public class DescriptionLogsController(IUnitOfWork _unitOfWork) : ControllerBase
    {
        // [HttpGet]
        // public async Task<ActionResult<PagedResult<DescriptionLogDto>>> GetAllDescriptionLogsAsync([FromQuery] int skip = 0,
        // [FromQuery] int pageSize = 10)
        // {
        //     var obj = await _unitOfWork.DescriptionLogRepo.GetAllAsync<DescriptionLogDto>(skip: skip, pageSize: pageSize);

        //     return Ok(obj);
                
        // }

        [HttpGet("{Id}")]
        public async Task<ActionResult<PagedResult<DescriptionLogDto>>> GetDescriptionLogByDescIdAsync(int Id, [FromQuery] int skip = 0,
        [FromQuery] int pageSize = 10)
        {
            var obj = await _unitOfWork.DescriptionLogRepo.GetAllAsync<DescriptionLogDto>(skip: skip, pageSize: pageSize, x => x.DescriptionId == Id);

            return obj is not null ?
                Ok(obj) :
                NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> AddDescriptionLogsAsync(DescriptionLogDto descriptionLogDto)
        {
            if (descriptionLogDto is null)
                return BadRequest("Invalid data.");

            var descExists = await _unitOfWork.DescriptionRepo.GetAsync(p => p.Id == descriptionLogDto.DescriptionId);
            
            if (descExists is null)
                return BadRequest("The specified DescriptionId does not exist.");

            var added = await _unitOfWork.DescriptionLogRepo.AddAsync(descriptionLogDto);

            return Ok(added);
        }
    }
}
