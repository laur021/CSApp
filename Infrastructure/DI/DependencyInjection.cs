using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Iinterfaces;
using Application.Interfaces;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Infrastructure.UOW;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.DI
{
    public static class DependencyInjection
    {
        public static IServiceCollection InfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Register MasterDbContext
            services.AddDbContext<MasterDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("Master_Db")));

            // Register ChineseDbContext
            services.AddDbContext<ChineseDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("CN_Db")));

            // Register VietnameseDbContext
            services.AddDbContext<VietnameseDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("VN_Db")));

            // Register IHttpContextAccessor so we can access user claims (e.g., "Team")
            services.AddHttpContextAccessor();

            // Register your custom DbContext factory
            services.AddScoped<IDbContextFactory, DbContextFactory>();

            // Register your unit of work and authenticator
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAuthenticator, Authenticator>();

            return services;
        }
    }

}
