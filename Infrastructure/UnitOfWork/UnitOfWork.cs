using System;
using Application.DTOs;
using Application.Iinterfaces;
using Application.Interfaces;
using AutoMapper;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.UOW;

public class UnitOfWork : IUnitOfWork
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IDbContextFactory _dbContextFactory;
    private readonly MasterDbContext _masterDb;
    private readonly TeamDbContext _regionDb;
    private IMapper _mapper;
    private bool _disposed;

    public UnitOfWork(
        IHttpContextAccessor accessor,
        IDbContextFactory factory,
        MasterDbContext masterDb,
        IMapper mapper)
    {
        _httpContextAccessor = accessor;
        _dbContextFactory = factory;
        _masterDb = masterDb;
        _mapper = mapper;

        var team = _httpContextAccessor.HttpContext?.User?.Claims
    ?.FirstOrDefault(x => x.Type == "Team")?.Value ?? "CN";

        _regionDb = _dbContextFactory.GetTeamDbContext(team);

        AccountRepo = new AccountRepo(_masterDb, _mapper, _httpContextAccessor);
        ProductRepo = new ProductRepo(_regionDb, _mapper);
        ProductLogRepo = new ProductLogRepo(_regionDb, _mapper);
        DescriptionRepo = new DescriptionRepo(_regionDb, _mapper);
        DescriptionLogRepo = new DescriptionLogRepo(_regionDb, _mapper);
        ActivityLogRepo = new ActivityLogRepo(_regionDb, _mapper);
        TransactionRepo = new TransactionRepo(_regionDb, _mapper);
        TransactionLogRepo = new TransactionLogRepo(_regionDb, _mapper);
        ProductSummaryRepo = new ChartRepo<ProductSummaryDto>(_regionDb);
        DescriptionSummaryRepo = new ChartRepo<DescriptionSummaryDto>(_regionDb);
        TransactionSummaryRepo = new ChartRepo<TransactionSummaryDto>(_regionDb);
        UserCountSummaryRepo = new ChartRepo<UserCountSummaryDto>(_regionDb);
    }

    public IChartRepo<ProductSummaryDto> ProductSummaryRepo { get; private set; }
    public IChartRepo<DescriptionSummaryDto> DescriptionSummaryRepo { get; private set; }
    public IChartRepo<TransactionSummaryDto> TransactionSummaryRepo { get; private set; }
    public IChartRepo<UserCountSummaryDto> UserCountSummaryRepo { get; private set; }
    public IAccountRepo AccountRepo { get; private set; }
    public IProductRepo ProductRepo { get; private set; }
    public IProductLogRepo ProductLogRepo { get; private set; }
    public IDescriptionRepo DescriptionRepo { get; private set; }
    public IDescriptionLogRepo DescriptionLogRepo { get; private set; }
    public IActivityLogRepo ActivityLogRepo { get; private set; }
    public ITransactionRepo TransactionRepo { get; private set; }
    public ITransactionLogRepo TransactionLogRepo { get; private set; }
    public virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _masterDb.Dispose();
                _regionDb.Dispose();
            }
            _disposed = true;
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    public async Task<bool> SaveMasterAsync()
    {
        return await _masterDb.SaveChangesAsync() > 0;
    }


    public async Task<bool> SaveRegionAsync()
    {
        return await _regionDb.SaveChangesAsync() > 0;
    }
}
