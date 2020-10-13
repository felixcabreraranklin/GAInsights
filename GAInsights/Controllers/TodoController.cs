using AutoMapper;
using GAInsights.BasicResponses;
using GAInsights.Common.Dtos.Requests;
using GAInsights.Common.Dtos.Responses;
using GAInsights.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace GAInsights.Controllers
{
    [Route("api/todo")]
    public class TodoController : Controller
    {
        private readonly ITodoService _todoService;
        private readonly IMapper _mapper;

        public TodoController(ITodoService todoService, IMapper mapper)
        {
            _todoService = todoService ?? throw new ArgumentNullException(nameof(todoService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        /// <summary>
        /// Get all todos, it is allowed to use filtering.
        /// </summary>
        /// <param name="page">Page for pagination purposes.</param>
        /// <param name="perPage">How many todos per page.</param>
        /// <param name="sortOrder">For sortering purposes.</param>
        /// <param name="search">For searching purposes.</param>
        [HttpGet()]
        [ProducesResponseType(typeof(IEnumerable<TodoResponse>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetTodos(int? page, int? perPage, string sortOrder, string search)
        {
            var pag = page ?? 1;
            var perPag = perPage ?? 10;

            var result = await _todoService.GetAllTodosAsync(pag, perPag, sortOrder, search);

            HttpContext.Response.Headers.Add("PagingData", JsonConvert.SerializeObject(result.GetPaginationData));
            HttpContext.Response.Headers["Access-Control-Expose-Headers"] = "PagingData";
            HttpContext.Response.Headers["Access-Control-Allow-Headers"] = "PagingData";

            var mapped = _mapper.Map<IEnumerable<TodoResponse>>(result);
            return Ok(new ApiOkResponse(mapped));
        }

        /// <summary>
        /// Create a todo.
        /// </summary>
        /// <param name="todoRequest">Create todo request object.</param>
        [HttpPost]
        [ProducesResponseType(typeof(TodoResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Add([FromBody] EditTodoRequest todoRequest)
        {
            var todo = await _todoService.AddTodoAsync(todoRequest);
            var mapped = _mapper.Map<TodoResponse>(todo);

            return Ok(new ApiOkResponse(mapped));
        }

        /// <summary>
        /// Get todo by id.
        /// </summary>
        /// <param name="id">Todo id param.</param>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(TodoResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetTodo([FromRoute] int id)
        {
            var result = await _todoService.GetTodoAsync(id);

            var mapped = _mapper.Map<TodoResponse>(result);
            return Ok(new ApiOkResponse(mapped));
        }

        /// <summary>
        /// Update a todo.
        /// </summary>
        /// <param name="todoRequest">Update todo request object.</param>
        /// <param name="id">Todo id.</param>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(TodoResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] EditTodoRequest todoRequest)
        {
            var result = await _todoService.UpdateTodoAsync(id, todoRequest);
            var mapped = _mapper.Map<TodoResponse>(result);

            return Ok(new ApiOkResponse(mapped));
        }

        /// <summary>
        /// Set todo priority.
        /// </summary>
        /// <param name="priority">Todo priority.</param>
        /// <param name="id">Todo id.</param>
        [HttpPatch("{id}/priority/{priority}")]
        [ProducesResponseType(typeof(TodoResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> SetPriority([FromRoute] int id, [FromRoute] int priority)
        {
            var result = await _todoService.SetPriorityTodoAsync(id, priority);
            var mapped = _mapper.Map<TodoResponse>(result);

            return Ok(new ApiOkResponse(mapped));
        }

        /// <summary>
        /// Delete todo.
        /// </summary>
        /// <param name="id">Todo id.</param>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(TodoResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            await _todoService.DeleteTodoAsync(id);

            return Ok();
        }
    }
}