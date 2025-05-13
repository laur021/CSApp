using Application.DTOs;
using Application.Iinterfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Repositories
{
    public class Repo<T> : IRepo<T> where T : class
    {
        private readonly DbContext _db;
        private readonly DbSet<T> _dbSet;
        private readonly IMapper _mapper;

        public Repo(DbContext db, IMapper mapper)
        {
            _db = db;
            _dbSet = _db.Set<T>();
            _mapper = mapper;
        }

        public virtual async Task<PagedResult<T>> GetAllAsync(
            int skip = 0,
            int pageSize = 10,
            Expression<Func<T, bool>>? filter = null)
        {
            IQueryable<T> query = _dbSet.OrderByDescending(x => EF.Property<int>(x, "Id"));

            if (filter is not null)
                query = query.Where(filter);

            query = ExcludeDeletedEntities(query);

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip(skip * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();

            return new PagedResult<T>
            {
                Items = items,
                TotalCount = totalCount,
                Skip = skip,
                PageSize = pageSize
            };
        }

        public virtual async Task<T?> GetAsync(Expression<Func<T, bool>> filter)
        {
            IQueryable<T> query = _dbSet;

            query = ExcludeDeletedEntities(query);

            return await query.AsNoTracking().FirstOrDefaultAsync(filter);
        }

        public virtual async Task<TDto> AddAsync<TDto>(TDto dto) where TDto : class
        {
            var entity = _mapper.Map<T>(dto);
            entity.GetType().GetProperty("DateAdded")?.SetValue(entity, DateTime.Now);
            await _dbSet.AddAsync(entity);
            await _db.SaveChangesAsync();
            return _mapper.Map<TDto>(entity);
        }

        public virtual async Task<PagedResult<TDto>> GetAllAsync<TDto>(int skip = 0, int pageSize = 10, Expression<Func<TDto, bool>>? filter = null) where TDto : class
        {
            IQueryable<T> query = _dbSet.OrderByDescending(x => EF.Property<int>(x, "Id"));
            query = ExcludeDeletedEntities(query);

            var projectedQuery = query.ProjectTo<TDto>(_mapper.ConfigurationProvider);

            if (filter is not null)
                projectedQuery = projectedQuery.Where(filter);

            var totalCount = await projectedQuery.CountAsync();

            var items = await projectedQuery
                .Skip(skip)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();

            return new PagedResult<TDto>
            {
                Items = items,
                TotalCount = totalCount,
                Skip = skip,
                PageSize = pageSize
            };
        }

        public virtual async Task<TDto?> GetAsync<TDto>(Expression<Func<TDto, bool>> filter) where TDto : class
        {
            IQueryable<T> query = _dbSet;
            query = ExcludeDeletedEntities(query);

            return await query
                .ProjectTo<TDto>(_mapper.ConfigurationProvider)
                .AsNoTracking()
                .FirstOrDefaultAsync(filter);
        }

        protected IQueryable<T> ExcludeDeletedEntities(IQueryable<T> query)
        {
            if (typeof(T).GetProperty("IsDeleted") != null)
            {
                query = query.Where(e => EF.Property<bool?>(e, "IsDeleted") == false ||
                                         EF.Property<bool?>(e, "IsDeleted") == null);
            }
            return query;
        }

        public virtual async Task<List<TDto>> GetAllListAsync<TDto>(Expression<Func<TDto, bool>>? filter = null) where TDto : class
        {
            IQueryable<T> query = _dbSet.OrderByDescending(x => EF.Property<int>(x, "Id"));
            query = ExcludeDeletedEntities(query);

            var projectedQuery = query.ProjectTo<TDto>(_mapper.ConfigurationProvider);

            if (filter is not null)
                projectedQuery = projectedQuery.Where(filter);

            return await projectedQuery
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
