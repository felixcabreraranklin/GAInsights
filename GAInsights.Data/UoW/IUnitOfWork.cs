using GAInsights.Data.Entities;
using GAInsights.Data.Repository;
using System.Threading.Tasks;

namespace GAInsights.Data.UoW
{
    public interface IUnitOfWork
    {
        IGenericRepository<Todo> TodoRepository { get; set; }

        Task<int> CommitAsync();
    }
}