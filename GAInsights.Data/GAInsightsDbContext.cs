using GAInsights.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GAInsights.Data
{
    public class GAInsightsDbContext : DbContext

    {
        public GAInsightsDbContext(DbContextOptions<GAInsightsDbContext> options) : base(options)
        {
        }

        public DbSet<Todo> Todos { get; set; }
    }
}