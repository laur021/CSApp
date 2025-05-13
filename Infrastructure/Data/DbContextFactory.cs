using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public interface IDbContextFactory
    {
        MasterDbContext GetMasterDbContext();
        TeamDbContext GetTeamDbContext(string team);
    }
    public class DbContextFactory : IDbContextFactory
    {
        private readonly IServiceProvider _provider;
        private readonly IConfiguration _config;

        public DbContextFactory(IServiceProvider provider, IConfiguration config)
        {
            _provider = provider;
            _config = config;
        }

        public MasterDbContext GetMasterDbContext()
        {
            var opts = new DbContextOptionsBuilder<MasterDbContext>()
                .UseSqlServer(_config.GetConnectionString("Master_Db")).Options;

            return new MasterDbContext(opts);
        }

        public TeamDbContext GetTeamDbContext(string team)
        {
            return team.ToUpper() switch
            {
                "CN" => _provider.GetRequiredService<ChineseDbContext>(),
                "VN" => _provider.GetRequiredService<VietnameseDbContext>(),
                _ => throw new ArgumentException("Invalid team specified")
            };
        }
    }
}
