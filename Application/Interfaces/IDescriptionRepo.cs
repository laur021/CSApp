using Application.DTOs;
using Domain.Entities;

namespace Application.Iinterfaces;

    public interface IDescriptionRepo : IRepo<Description>
    {
        Task UpdateAsync(int id, DescriptionDto descriptionDto);

        Task<bool> DeleteAsync(int descriptionId);

    }

