using System;
using Application.DTOs;
using Application.Interfaces;

namespace Application.Iinterfaces;
public interface IUnitOfWork : IDisposable
{
    IAccountRepo AccountRepo { get; }
    IProductRepo ProductRepo { get; }
    IProductLogRepo ProductLogRepo { get; }
    IDescriptionRepo DescriptionRepo { get; }
    IDescriptionLogRepo DescriptionLogRepo { get; }
    IActivityLogRepo ActivityLogRepo { get; }
    ITransactionRepo TransactionRepo { get; }
    ITransactionLogRepo TransactionLogRepo { get; }
    IChartRepo<ProductSummaryDto> ProductSummaryRepo { get; }
    IChartRepo<DescriptionSummaryDto> DescriptionSummaryRepo { get; }
    IChartRepo<TransactionSummaryDto> TransactionSummaryRepo { get; }
    IChartRepo<UserCountSummaryDto> UserCountSummaryRepo { get; }
    Task<bool> SaveMasterAsync();
    Task<bool> SaveRegionAsync();
}
