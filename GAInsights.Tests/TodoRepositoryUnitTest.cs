using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

using GAInsights.Data;
using GAInsights.Data.UoW;
using GAInsights.Data.Entities;

using GAInsights.Data.Repository;
namespace GAInsights.Tests
{
    public class TodoRepositoryUnitTest
    {
        [Fact]
        public async Task AddAsync_Test()
        {
            using (var context = GetSampleData(nameof(AddAsync_Test)))
            {
                var _unitOfWork = new UnitOfWork(context);

                await _unitOfWork.TodoRepository.AddAsync(new Todo
                {
                    
                    Description = "Description 1",
                    Id = 3,
                    Priority = 3,
                    Name="TODO 3"
                    
                });
                await _unitOfWork.CommitAsync();
                Assert.Equal(3, _unitOfWork.TodoRepository.GetAll().Count());
            }
        }

        [Fact]
        public async Task Delete_Test()
        {
            using (var context = GetSampleData(nameof(Delete_Test)))
            {
                var _unitOfWork = new UnitOfWork(context);

                var todo = _unitOfWork.TodoRepository.Get(1);
                _unitOfWork.TodoRepository.Delete(todo);
                await _unitOfWork.CommitAsync();
                Assert.Equal(1, context.Set<Todo>().Count());
            }
        }

        [Fact]
        public async Task UpdateAsync_Test()
        {
            using (var context = GetSampleData(nameof(UpdateAsync_Test)))
            {
                var _unitOfWork = new UnitOfWork(context);

                var todo = _unitOfWork.TodoRepository.Get(1);
                todo.Name = "run in the city";

                await _unitOfWork.TodoRepository.UpdateAsync(todo, todo.Id);
                await _unitOfWork.CommitAsync();
                Assert.Equal("run in the city", todo.Name);
            }
        }

        [Fact]
        public void GetAll_Test()
        {
            using (var context = GetSampleData(nameof(GetAll_Test)))
            {
                var repository = new GenericRepository<Todo>(context);
                var todos = repository.GetAll();
                Assert.Equal(2, todos.Count());
            }
        }

        [Fact]
        public async Task CountAsync_Test()
        {
            using (var context = GetSampleData(nameof(CountAsync_Test)))
            {
                var repository = new GenericRepository<Todo>(context);

                var result = await repository.CountAsync();
                Assert.Equal(await context.Set<Todo>().CountAsync(), result);
            }
        }

        [Fact]
        public async Task FindAsync_Test()
        {
            using (var context = GetSampleData(nameof(FindAsync_Test)))
            {
                var repository = new GenericRepository<Todo>(context);

                var result = await repository.FindAsync(p => p.Id == 1);
                Assert.Equal(1, result.Id);
            }
        }

        [Fact]
        public void FindAll_Test()
        {
            using (var context = GetSampleData(nameof(FindAll_Test)))
            {
                var repository = new GenericRepository<Todo>(context);

                var result = repository.FindAll(p => p.Id == 1);
                Assert.Equal(1, result.Count);
                Assert.Equal(1, result.FirstOrDefault().Id);
            }
        }

        [Fact]
        public async Task FindAllAsync_Test()
        {
            using (var context = GetSampleData(nameof(FindAllAsync_Test)))
            {
                var repository = new GenericRepository<Todo>(context);

                var result = await repository.FindAllAsync(p => p.Id == 1);
                Assert.Equal(1, result.Count);
                Assert.Equal(1, result.FirstOrDefault().Id);
            }
        }

        [Fact]
        public void FindBy_Test()
        {
            using (var context = GetSampleData(nameof(FindBy_Test)))
            {
                var repository = new GenericRepository<Todo>(context);

                var result = repository.FindBy(p => p.Id == 1);
                Assert.Equal(1, result.Count());
                Assert.Equal(1, result.FirstOrDefault().Id);
            }
        }

        [Fact]
        public async Task FindByAsync_Test()
        {
            using (var context = GetSampleData(nameof(FindByAsync_Test)))
            {
                var repository = new GenericRepository<Todo>(context);

                var result = await repository.FindByAsync(p => p.Id == 1);
                Assert.Equal(1, result.Count);
                Assert.Equal(1, result.FirstOrDefault().Id);
            }
        }

        [Fact]
        public void Get_Test()
        {
            using (var context = GetSampleData(nameof(Get_Test)))
            {
                var repository = new GenericRepository<Todo>(context);

                var result = repository.Get(1);
                Assert.Equal(1, result.Id);
            }
        }

        [Fact]
        public async Task GetAsync_Test()
        {
            using (var context = GetSampleData(nameof(GetAsync_Test)))
            {
                var repository = new GenericRepository<Todo>(context);

                var result = await repository.GetAsync(1);
                Assert.Equal(1, result.Id);
            }
        }

        [Fact]
        public async Task GetAllAsync_Test()
        {
            using (var context = GetSampleData(nameof(GetAllAsync_Test)))
            {
                var repository = new GenericRepository<Todo>(context);

                var result = await repository.GetAllAsync();
                Assert.Equal(2, result.Count());
            }
        }

        private GAInsightsDbContext GetSampleData(string db)
        {
            var builder = new DbContextOptionsBuilder<GAInsightsDbContext>();
            builder.UseInMemoryDatabase(databaseName: db);

            var options = builder.Options;

            var context = new GAInsightsDbContext(options);

            var todos = new List<Todo>
            {
               new Todo {
                    Description = "Description 1",
                    Id = 1,
                    Priority = 1,
                    Name="TODO 1"
               },
               new Todo {
                    Description = "Description 1",
                    Id = 2,
                    Priority = 2,
                    Name="TODO 2"
               },
            };
            context.AddRange(todos);
            context.SaveChanges();
            return context;
        }
    }
}
