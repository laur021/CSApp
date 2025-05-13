

using Microsoft.AspNetCore.Authorization;
using Application.DTOs;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Application.Iinterfaces;
using Domain.Entities;
using System.Linq.Expressions;

namespace API.Controllers
{
    [Authorize]
    [EnableCors("AllowOrigin")]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ProductLogsController(IUnitOfWork _unitOfWork) : ControllerBase
    {
        // [HttpGet]
        // public async Task<ActionResult<PagedResult<ProductLogDto>>> GetAllProductLogsAsync([FromQuery] int skip = 0,
        // [FromQuery] int pageSize = 10)
        // {
        //     var obj = await _unitOfWork.ProductLogRepo.GetAllAsync<ProductLogDto>(skip: skip, pageSize: pageSize);

        //     return Ok(obj);

        // }

        [HttpGet("{Id}")]
        public async Task<ActionResult<PagedResult<ProductLogDto>>> GetProductLogByProdIdAsync(int Id, [FromQuery] int skip = 0,
        [FromQuery] int pageSize = 10)
        {

            var obj = await _unitOfWork.ProductLogRepo.GetAllAsync<ProductLogDto>(skip: skip, pageSize: pageSize, x => x.ProductId == Id);

            return obj is not null ?
                Ok(obj) :
                NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> AddProductLogsAsync(ProductLogDto productLogDto)
        {
            if (productLogDto is null)
                return BadRequest("Invalid data.");

            var productExists = await _unitOfWork.ProductRepo.GetAsync(p => p.Id == productLogDto.ProductId);
            if (productExists is null)
                return BadRequest("The specified ProductId does not exist.");

            var added = await _unitOfWork.ProductLogRepo.AddAsync(productLogDto);

            return Ok(added);
        }
    }
}
