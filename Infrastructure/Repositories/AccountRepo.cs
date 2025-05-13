using System;
using System.Linq.Expressions;



using Application.DTOs;
using Application.Iinterfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AccountRepo : Repo<Account>, IAccountRepo
{
    private MasterDbContext _db;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AccountRepo(MasterDbContext db, IMapper mapper, IHttpContextAccessor httpContextAccessor) : base(db, mapper)
    {
        _db = db;
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
    }

    private string? GetTeamFromClaims()
    {
        return _httpContextAccessor.HttpContext?.User?
            .Claims.FirstOrDefault(c => c.Type == "Team")?.Value;
    }

    public override async Task<PagedResult<TDto>> GetAllAsync<TDto>(
    int skip = 0,
    int pageSize = 10,
    Expression<Func<TDto, bool>>? filter = null)
    {
        var team = GetTeamFromClaims();

        // Start with the base query
        IQueryable<Account> query = _db.Accounts.OrderByDescending(x => x.Id);
        query = ExcludeDeletedEntities(query);

        // Apply Team filter
        if (!string.IsNullOrEmpty(team))
        {
            query = query.Where(acc => acc.Team == team);
        }

        var projectedQuery = query.ProjectTo<TDto>(_mapper.ConfigurationProvider);

        // Apply search filter if exists
        if (filter is not null)
        {
            projectedQuery = projectedQuery.Where(filter);
        }

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

    public override async Task<TDto?> GetAsync<TDto>(Expression<Func<TDto, bool>> filter) where TDto : class
    {
        var team = GetTeamFromClaims();

        IQueryable<Account> query = _db.Accounts;
        query = ExcludeDeletedEntities(query);

        if (!string.IsNullOrEmpty(team))
        {
            query = query.Where(acc => acc.Team == team);
        }

        return await query
            .ProjectTo<TDto>(_mapper.ConfigurationProvider)
            .AsNoTracking()
            .FirstOrDefaultAsync(filter);
    }


    public async Task<bool> DeleteAsync(int accountId)
    {
        var deleted = await _db.Accounts
            .Where(x => x.Id == accountId)
            .ExecuteUpdateAsync(x => x.SetProperty(x => x.IsDeleted, true));

        return deleted > 0;
    }

    public async Task UpdateAsync(int id, AccountDto accountDto)
    {
        var account = await _db.Accounts.FindAsync(id);

        if (account is null)
            throw new ArgumentException($"Account with ID {id} not found.");

        account.DateAdded = DateTime.Now;

        _mapper.Map(accountDto, account);
        _db.Entry(account).State = EntityState.Modified;

    }
}
