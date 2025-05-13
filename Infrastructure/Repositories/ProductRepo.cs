using System;



using Application.DTOs;
using Application.Iinterfaces;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ProductRepo : Repo<Product>, IProductRepo
{
    private TeamDbContext _db;
    
    private readonly IMapper _mapper;

    public ProductRepo(TeamDbContext db, IMapper mapper) : base(db, mapper)
    {
         _db = db;
         _mapper = mapper;
    }

    public async Task<bool> DeleteAsync(int productId)
    {
    using (var transaction = await _db.Database.BeginTransactionAsync())
    {
        try
        {
            var isProductDeleted = await _db.Products
                .Where(x => x.Id == productId)
                .ExecuteUpdateAsync(x => x.SetProperty(p => p.IsDeleted, true));

            var isDescriptionDeleted = await _db.Descriptions
                .Where(x => x.ProductId == productId)
                .ExecuteUpdateAsync(x => x.SetProperty(d => d.IsDeleted, true));

            // Commit the transaction if both operations succeed
            await transaction.CommitAsync();

            return isProductDeleted > 0;
        }
        catch
        {
            // Rollback the transaction if any operation fails
            await transaction.RollbackAsync();
            throw; 
        }
    }
}

    public async Task UpdateAsync(int id,ProductDto productDto)
    {
        var product = await _db.Products.FindAsync(id);

        if (product is null)
            throw new ArgumentException($"Product with ID {id} not found.");

        product.DateAdded = DateTime.Now;

        _mapper.Map(productDto, product);
        _db.Entry(product).State = EntityState.Modified;
    }
}
