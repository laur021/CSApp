using System;



using Application.DTOs;
using Application.Iinterfaces;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class DescriptionRepo : Repo<Description>, IDescriptionRepo
{
    private TeamDbContext _db;
    private readonly IMapper _mapper;

    public DescriptionRepo(TeamDbContext db, IMapper mapper) : base(db, mapper)
    {
        _db = db;
         _mapper = mapper;
    }

    public async Task<bool> DeleteAsync(int descriptionId)
    {
        var deleted = await _db.Descriptions
            .Where(x => x.Id == descriptionId)
            .ExecuteUpdateAsync(x => x.SetProperty(x => x.IsDeleted, true));

        return deleted > 0;
    }

    public async Task UpdateAsync(int id, DescriptionDto descriptionDto)
    {
        var description = await _db.Descriptions.FindAsync(id);

        if (description is null)
            throw new ArgumentException($"Description with ID {id} not found.");

        description.DateAdded = DateTime.Now;

        _mapper.Map(descriptionDto, description);
        _db.Entry(description).State = EntityState.Modified;
    }
}
