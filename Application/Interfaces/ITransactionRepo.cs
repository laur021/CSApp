using Application.DTOs;
using Domain.Entities;

namespace Application.Iinterfaces;

    public interface ITransactionRepo : IRepo<Transaction>
    {
        Task UpdateAsync(string transactionId, TransactionCreateDto transactionCreateDto);
        Task<bool> DeleteAsync(int transactionId);

    }

