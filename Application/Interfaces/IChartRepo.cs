using Microsoft.Data.SqlClient;

namespace Application.Interfaces;

public interface IChartRepo<T> where T : class
{
    Task<List<T>> ExecuteStoredProcedureAsync(string storedProcedure, DateTime? startDate = null, DateTime? endDate = null);
}
