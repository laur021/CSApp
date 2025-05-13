using System;
using Application.Iinterfaces;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class ActivityLogRepo : Repo<ActivityLog>, IActivityLogRepo
{
    public ActivityLogRepo(TeamDbContext db, IMapper mapper) : base(db, mapper)
    {

    }
}
