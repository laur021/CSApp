using System;
using Application.Iinterfaces;

using AutoMapper;
using Domain.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class TransactionLogRepo : Repo<TransactionLog>, ITransactionLogRepo
{
    public TransactionLogRepo(TeamDbContext db, IMapper mapper) : base(db, mapper)
    {
    }
}
