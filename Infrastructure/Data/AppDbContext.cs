using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Account> Accounts { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Description> Descriptions { get; set; } = null!;
        public DbSet<Transaction> Transactions { get; set; } = null!;
        public DbSet<ActivityLog> ActivityLogs { get; set; } = null!;
        public DbSet<ProductLog> ProductLogs { get; set; } = null!;
        public DbSet<DescriptionLog> DescriptionLogs { get; set; } = null!;
        public DbSet<TransactionLog> TransactionLogs { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the unique constraint for TransactionId in the Transaction table
            modelBuilder.Entity<Transaction>(entity =>
            {
               entity.HasIndex(t => t.TransactionId)
                     .IsUnique();
            });

            // Configure the relationship between TransactionLog and Transaction via TRANSACTIONID which is not the primary key
            modelBuilder.Entity<TransactionLog>(entity =>
            {
               entity.HasOne(tl => tl.Transaction)
                     .WithMany(t => t.TransactionLogs)
                     .HasForeignKey(tl => tl.TransactionId)
                     .HasPrincipalKey(t => t.TransactionId) // Use TransactionId as the principal key
                     .OnDelete(DeleteBehavior.Cascade); // Optional: Configure delete behavior
            });
        }
    }
}
