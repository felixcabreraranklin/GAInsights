using GAInsights.Data.Entities;
using GAInsights.Data.Repository;
using System;
using System.Threading.Tasks;

namespace GAInsights.Data.UoW
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly GAInsightsDbContext _context;

        private bool disposed = false;

        public IGenericRepository<Todo> TodoRepository { get; set; }

        public UnitOfWork(GAInsightsDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            TodoRepository = TodoRepository ?? new GenericRepository<Todo>(_context);
        }

        public async Task<int> CommitAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
                this.disposed = true;
            }
        }
    }
}