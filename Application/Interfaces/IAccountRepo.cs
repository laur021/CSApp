using Application.DTOs;
using Domain.Entities;

namespace Application.Iinterfaces;

    public interface IAccountRepo : IRepo<Account>
    {
        Task UpdateAsync(int id, AccountDto accountDto);
        Task<bool> DeleteAsync(int accountId);
        //Task<bool> IsNameExists(string accountName, int accountId);
    }

