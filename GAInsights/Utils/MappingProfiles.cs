using AutoMapper;
using GAInsights.Common.Dtos.Responses;
using GAInsights.Data.Entities;

namespace GAInsights.Utils
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Todo, TodoResponse>();
        }
    }
}