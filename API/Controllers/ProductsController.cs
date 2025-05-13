

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
    public class ProductsController(IUnitOfWork _unitOfWork) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllProductsAsync(
            [FromQuery] int skip = 0,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool includeDescriptions = false,
            [FromQuery] bool includeLogs = false)
        {
            object? result;

            if (includeDescriptions && includeLogs)
            {
                result = await _unitOfWork.ProductRepo
                .GetAllAsync<ProductCompleteDetailsDto>(skip: skip, pageSize: pageSize);
            }
            else if (includeDescriptions)
            {
                result = await _unitOfWork.ProductRepo
                .GetAllAsync<ProductWithDescriptionsDto>(skip: skip, pageSize: pageSize);
            }
            else if (includeLogs)
            {
                result = await _unitOfWork.ProductRepo
                .GetAllAsync<ProductWithLogsDto>(skip: skip, pageSize: pageSize);
            }
            else
            {
                result = await _unitOfWork.ProductRepo
                .GetAllAsync<ProductDto>(skip: skip, pageSize: pageSize);
            }

            if (result == null)
                return NotFound("Products not found.");

            return Ok(result);
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetProductAsync(
        int Id,
        [FromQuery] bool includeDescriptions,
        [FromQuery] bool includeProductLogs)
        {
            object? result;

            if (includeDescriptions && includeProductLogs)
            {
                result = await _unitOfWork.ProductRepo
                    .GetAsync<ProductCompleteDetailsDto>(x => x.Id == Id);
            }
            else if (includeDescriptions)
            {
                result = await _unitOfWork.ProductRepo
                    .GetAsync<ProductWithDescriptionsDto>(x => x.Id == Id);
            }
            else if (includeProductLogs)
            {
                result = await _unitOfWork.ProductRepo
                    .GetAsync<ProductWithLogsDto>(x => x.Id == Id);
            }
            else
            {
                result = await _unitOfWork.ProductRepo
                    .GetAsync<ProductDto>(x => x.Id == Id);
            }

            if (result == null)
                return NotFound("Product not found.");

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddProductAsync(ProductDto productDto)
        {
            if (productDto is null)
                return BadRequest("Invalid product.");

            var obj = await _unitOfWork.ProductRepo
                .GetAsync(x => x.Name!.ToLower().Trim() == productDto.Name.ToLower().Trim() &&
                     (x.IsDeleted == false || x.IsDeleted == null));

            if (obj is not null)
                return Conflict("Product name is already taken.");

            var addedProduct = await _unitOfWork.ProductRepo.AddAsync(productDto);


            return Ok(addedProduct);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteProductAsync(int Id)
        {  
            //it also delete the description by id.
            var isDeleted = await _unitOfWork.ProductRepo.DeleteAsync(Id);
            return isDeleted
                ? NoContent()
                : NotFound($"Product with ID {Id} not found.");
        }

        [HttpPut("{Id}")]
        public async Task<IActionResult> UpdateProductAsync(int Id,ProductDto productDto)
        {
            if (productDto is null)
                return BadRequest("Invalid product.");

            var obj = await _unitOfWork.ProductRepo
                .GetAsync(x => x.Name!.ToLower().Trim() == productDto.Name.ToLower().Trim() &&
                      x.Id != Id &&
                     (x.IsDeleted == false || x.IsDeleted == null));

            if (obj is not null)
                return Conflict("Product name is already taken.");

            await _unitOfWork.ProductRepo.UpdateAsync(Id, productDto);

            var isUpdated = await _unitOfWork.SaveRegionAsync();

            return isUpdated ?
                Ok() :
                StatusCode(StatusCodes.Status500InternalServerError, "Error updating product.");

        }
    }
}
