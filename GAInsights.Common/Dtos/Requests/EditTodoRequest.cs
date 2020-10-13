namespace GAInsights.Common.Dtos.Requests
{
    public class EditTodoRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Priority { get; set; }
    }
}