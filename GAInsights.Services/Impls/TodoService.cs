using GAInsights.Common.Dtos.Requests;
using GAInsights.Common.Exceptions;
using GAInsights.Data.Entities;
using GAInsights.Data.UoW;
using GAInsights.Services.Utils;
using Serilog;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace GAInsights.Services.Impls
{
    public class TodoService : ITodoService
    {
        private readonly IUnitOfWork _uow;

        public TodoService(IUnitOfWork uow)
        {
            _uow = uow ?? throw new ArgumentNullException(nameof(uow));
        }

        public async Task<Todo> AddTodoAsync(EditTodoRequest todoRequest)
        {
            var todo = new Todo
            {
                Name = todoRequest.Name,
                Description = todoRequest.Description,
                Priority = todoRequest.Priority
            };
            await _uow.TodoRepository.AddAsync(todo);
            await _uow.CommitAsync();
            Log.Information("New todo added with id " + todo.Id + ".");
            return todo;
        }

        public async Task DeleteTodoAsync(int todoId)
        {
            var todo = await _uow.TodoRepository.GetAsync(todoId);

            if (todo is null)
            {
                Log.Error("Todo with id " + todoId + " not found.");
                throw new CustomNotFoundException();
            }

            _uow.TodoRepository.Delete(todo);
            await _uow.CommitAsync();
            Log.Information("Deleting todo with id " + todoId + ".");
        }

        public async Task<PaginatedList<Todo>> GetAllTodosAsync(int pag, int perPag, string sortOrder, string search)
        {
            var result = _uow.TodoRepository.GetAll();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                result = result.Where(
                        i => i.Name.ToLower().Contains(search) ||
                             i.Description.ToLower().Contains(search) ||
                             i.Priority.ToString().ToLower().Contains(search));
            }

            if (!string.IsNullOrWhiteSpace(sortOrder))
            {
                switch (sortOrder)
                {
                    case "name_desc":
                        result = result.OrderByDescending(i => i.Name);
                        break;

                    case "name_asc":
                        result = result.OrderBy(i => i.Name);
                        break;

                    case "description_desc":
                        result = result.OrderByDescending(i => i.Description);
                        break;

                    case "description_asc":
                        result = result.OrderBy(i => i.Description);
                        break;

                    case "priority_desc":
                        result = result.OrderByDescending(i => i.Priority);
                        break;

                    case "priority_asc":
                        result = result.OrderBy(i => i.Priority);
                        break;

                    default:
                        break;
                }
            }
            Log.Information("Retrieving all todos.");
            return await PaginatedList<Todo>.CreateAsync(result, pag, perPag);
        }

        public async Task<Todo> GetTodoAsync(int id)
        {
            var todo = await _uow.TodoRepository.GetAsync(id);

            if (todo is null)
            {
                Log.Error("Todo with id " + id + " not found.");
                throw new CustomNotFoundException();
            }

            Log.Information("Retrieving todo with id " + id + ".");
            return todo;
        }

        public async Task<Todo> SetPriorityTodoAsync(int todoId, int priority)
        {
            var todo = await _uow.TodoRepository.GetAsync(todoId);

            if (todo is null)
            {
                Log.Error("Todo with id " + todoId + " not found.");
                throw new CustomNotFoundException();
            }

            todo.Priority = priority;
            await _uow.TodoRepository.UpdateAsync(todo, todo.Id);
            await _uow.CommitAsync();
            Log.Information("Todo with id " + todoId + " updated.");
            return todo;
        }

        public async Task<Todo> UpdateTodoAsync(int todoId, EditTodoRequest todoRequest)
        {
            var todo = await _uow.TodoRepository.GetAsync(todoId);

            if (todo is null)
            {
                Log.Error("Todo with id " + todoId + " not found.");
                throw new CustomNotFoundException();
            }
            todo.Name = todoRequest.Name;
            todo.Description = todoRequest.Description;
            todo.Priority = todoRequest.Priority;

            await _uow.TodoRepository.UpdateAsync(todo, todo.Id);
            await _uow.CommitAsync();
            Log.Information("Todo with id " + todoId + " updated.");

            return todo;
        }
    }
}