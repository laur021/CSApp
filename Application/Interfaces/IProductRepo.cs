
using Application.DTOs;
using Domain.Entities;

namespace Application.Iinterfaces;

    public interface IProductRepo : IRepo<Product>
    {
        Task UpdateAsync(int id, ProductDto productDto);

        Task<bool> DeleteAsync(int productId);

    }

