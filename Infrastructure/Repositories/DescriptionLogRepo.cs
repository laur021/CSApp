using System;
using Application.Iinterfaces;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class DescriptionLogRepo : Repo<DescriptionLog>, IDescriptionLogRepo
{    
    public DescriptionLogRepo(TeamDbContext db, IMapper mapper) : base(db, mapper)
    {

    }
}
