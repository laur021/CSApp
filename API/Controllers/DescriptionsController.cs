

using Microsoft.AspNetCore.Authorization;
using Application.DTOs;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Application.Iinterfaces;
using Microsoft.Data.SqlClient;
using Application.Interfaces;

namespace API.Controllers
{
    [Authorize]
    [EnableCors("AllowOrigin")]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class DescriptionsController(IUnitOfWork _unitOfWork) : ControllerBase
    {

        [HttpGet]
        public async Task<ActionResult> GetAllDescriptionsAsync(
        [FromQuery] int skip = 0,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? productId = null,
        [FromQuery] bool includeLogs = false
        )
        {
            object result;

            if (includeLogs)
            {
                result = await _unitOfWork.DescriptionRepo
                    .GetAllAsync<DescriptionWithLogsDto>(
                        skip: skip,
                        pageSize: pageSize,
                        filter: d => productId == null || d.ProductId == productId);
            }
            else
            {
                result = await _unitOfWork.DescriptionRepo
                    .GetAllAsync<DescriptionDto>(
                        skip: skip,
                        pageSize: pageSize,
                        filter: d => productId == null || d.ProductId == productId);
            }

            if (result == null)
                return NotFound("Descriptions not found.");

            return Ok(result);
        }


        [HttpGet("{Id}")]
        public async Task<ActionResult> GetDescriptionAsync(
            int Id,
            [FromQuery] bool includeLogs = false)
        {
            object? result;

            if (includeLogs)
            {
                result = await _unitOfWork.DescriptionRepo
                .GetAsync<DescriptionWithLogsDto>(x => x.Id == Id);
            }
            else
            {
                result = await _unitOfWork.DescriptionRepo
                .GetAsync<DescriptionDto>(x => x.Id == Id);
            }

            if (result == null)
                return NotFound("Description not found.");

            return Ok(result);

        }

        [HttpPost]
        public async Task<IActionResult> AddDescriptionAsync(DescriptionDto descriptionDto)
        {
            if (descriptionDto is null)
                return BadRequest("Invalid description.");

            var obj = await _unitOfWork.DescriptionRepo
                .GetAsync(x => x.Name!.ToLower().Trim() == descriptionDto.Name.ToLower().Trim() &&
                    x.ProductId == descriptionDto.ProductId &&
                     (x.IsDeleted == false || x.IsDeleted == null));

            if (obj is not null)
                return Conflict("Description is already taken.");

            var addedDescription = await _unitOfWork.DescriptionRepo.AddAsync(descriptionDto);

            return Ok(addedDescription);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteDescriptionAsync(int Id)
        {
            var isDeleted = await _unitOfWork.DescriptionRepo.DeleteAsync(Id);
            return isDeleted
                ? NoContent()
                : NotFound($"Product with ID {Id} not found.");
        }

        [HttpPut("{Id}")]
        public async Task<IActionResult> UpdateDescriptionAsync(int Id, DescriptionDto descriptionDto)
        {
            if (descriptionDto is null)
                return BadRequest("Invalid description.");

            var obj = await _unitOfWork.DescriptionRepo
                .GetAsync(x => x.Name!.ToLower().Trim() == descriptionDto.Name.ToLower().Trim() &&
                      x.Id != Id &&
                      x.ProductId == descriptionDto.ProductId &&
                     (x.IsDeleted == false || x.IsDeleted == null));

            if (obj is not null)
                return Conflict("Description is already taken.");

            await _unitOfWork.DescriptionRepo.UpdateAsync(Id, descriptionDto);

            var isUpdated = await _unitOfWork.SaveRegionAsync();

            return isUpdated ?
                NoContent() :
                StatusCode(StatusCodes.Status500InternalServerError, "Error updating description.");

        }



    }
}
