using Application.Interfaces;
using Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ChartRepo<T>(TeamDbContext db) : IChartRepo<T> where T : class
{
    public async Task<List<T>> ExecuteStoredProcedureAsync(string storedProcedure, DateTime? startDate = null, DateTime? endDate = null)
    {
        var parameters = new[]
        {
            new SqlParameter("@StartDate", startDate.HasValue ? startDate.Value : DBNull.Value),
            new SqlParameter("@EndDate", endDate.HasValue ? endDate.Value : DBNull.Value)
        };

        return await db.Database
        .SqlQueryRaw<T>($"EXEC {storedProcedure} @StartDate, @EndDate", parameters)
        .ToListAsync();

    }
}
