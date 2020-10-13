using GAInsights.Common.Dtos.Requests;
using GAInsights.Data.Entities;
using GAInsights.Services.Utils;
using System.Threading.Tasks;

namespace GAInsights.Services
{
    public interface ITodoService
    {
        Task<Todo> AddTodoAsync(EditTodoRequest todo);

        Task<Todo> UpdateTodoAsync(int todoId, EditTodoRequest todo);

        Task DeleteTodoAsync(int todoId);

        Task<Todo> SetPriorityTodoAsync(int todoId, int priority);

        Task<PaginatedList<Todo>> GetAllTodosAsync(int pag, int perPag, string sortOrder, string search);

        Task<Todo> GetTodoAsync(int id);
    }
}