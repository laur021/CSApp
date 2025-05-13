using System;
using Application.Iinterfaces;

using AutoMapper;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class ProductLogRepo : Repo<ProductLog>, IProductLogRepo
{
    public ProductLogRepo(TeamDbContext db, IMapper mapper) : base(db, mapper)
    {
    }
}
