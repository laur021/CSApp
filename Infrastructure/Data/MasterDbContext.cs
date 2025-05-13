using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class MasterDbContext : DbContext
    {
        public DbSet<Account> Accounts { get; set; }

        public MasterDbContext(DbContextOptions<MasterDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>().HasIndex(a => a.Username).IsUnique();
            modelBuilder.Entity<Account>().HasIndex(a => a.Team);
        }
    }
}
