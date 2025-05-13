using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class ChineseDbContext : TeamDbContext
    {
        public ChineseDbContext(DbContextOptions<ChineseDbContext> options) : base(options) { }
    }
}
