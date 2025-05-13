using System;
using Application.DTOs;
using Application.Iinterfaces;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class TransactionRepo : Repo<Transaction>, ITransactionRepo
{
    private TeamDbContext _db;
    private readonly IMapper _mapper;

    public TransactionRepo(TeamDbContext db, IMapper mapper) : base(db, mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<bool> DeleteAsync(int transactionId)
    {
        var deleteTrnx = await _db.Transactions
        .Where(x => x.Id == transactionId)
        .ExecuteUpdateAsync(x => x.SetProperty(x => x.IsDeleted, true));

        return deleteTrnx > 0;
    }

    public async Task UpdateAsync(string transactionId, TransactionCreateDto transactionCreateDto)
    {
        var obj = await _db.Transactions.FirstOrDefaultAsync(t => t.TransactionId == transactionId);
        if (obj is null)
            throw new ArgumentException($"Transaction with ID {transactionId} not found.");

        obj.DateAdded = DateTime.Now;

        _mapper.Map(transactionCreateDto, obj);
        _db.Entry(obj).State = EntityState.Modified;
    }

}
