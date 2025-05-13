using System.Linq.Expressions;
using Application.DTOs;

namespace Application.Iinterfaces;

    public interface IRepo<T> where T : class
    {
        /// <summary>
        /// METHOD WITH RETURN TYPE = T
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="pageSize"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        Task<PagedResult<T>> GetAllAsync(
            int skip = 0,
            int pageSize = 10,
            Expression<Func<T, bool>>? filter = null);
        Task<T?> GetAsync(Expression<Func<T, bool>> filter);

        Task<TDto> AddAsync<TDto>(TDto dto) where TDto : class;
        
        /// <summary>
        /// METHOD WITH RETURN TYPE = TDto
        /// </summary>
        /// <typeparam name="TDto"></typeparam>
        /// <param name="skip"></param>
        /// <param name="pageSize"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        Task<PagedResult<TDto>> GetAllAsync<TDto>(
            int skip = 0,
            int pageSize = 10,
            Expression<Func<TDto, bool>>? filter = null) where TDto : class;
        Task<TDto?> GetAsync<TDto>(
            Expression<Func<TDto, bool>> filter) where TDto : class;

    Task<List<TDto>> GetAllListAsync<TDto>(Expression<Func<TDto, bool>>? filter = null) where TDto : class;
        // Execute a raw SQL query and return a list of entities.

    }


//NOTES: I put optional Filter function in GET ALL because Transaction have GET ALL by type
