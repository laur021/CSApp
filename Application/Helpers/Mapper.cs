using System;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;

namespace API.Helpers;

public class Mapper : Profile
{
    public Mapper()
    {
        //Account
        CreateMap<Account, AccountDto>()
            .ReverseMap();

        //Product     
        CreateMap<Product, ProductDto>()
            .ReverseMap();

        CreateMap<Product, ProductDto>()
            .ReverseMap();

        CreateMap<Product, ProductCompleteDetailsDto>();

        CreateMap<Product, ProductWithLogsDto>();

        CreateMap<Product, ProductWithDescriptionsDto>();

        //Description      
        CreateMap<Description, DescriptionDto>()
            .ReverseMap();

        CreateMap<Description, DescriptionWithLogsDto>();

        //ProductLog
        CreateMap<ProductLog, ProductLogDto>()
            .ReverseMap();

        //DescriptionLog
        CreateMap<DescriptionLog, DescriptionLogDto>()
            .ReverseMap();

        //ActivityLog
        CreateMap<ActivityLog, ActivityLogDto>()
            .ReverseMap();

        //Transaction
        CreateMap<Transaction, TransactionDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Description.Product.Name))
            .ForMember(dest => dest.DescriptionName, opt => opt.MapFrom(src => src.Description.Name));

        CreateMap<TransactionCreateDto, Transaction>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ReverseMap();

        CreateMap<Transaction, TransactionWithLogsDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Description.Product.Name))
            .ForMember(dest => dest.DescriptionName, opt => opt.MapFrom(src => src.Description.Name));

        //TransactionLog
        CreateMap<TransactionLog, TransactionLogDto>()
            .ReverseMap();

    }
}

