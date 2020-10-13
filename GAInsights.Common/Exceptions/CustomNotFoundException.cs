using System.Net;

namespace GAInsights.Common.Exceptions
{
    public class CustomNotFoundException : CustomBaseException
    {
        public CustomNotFoundException() : base()
        {
            HttpCode = (int)HttpStatusCode.NotFound;
            CustomMessage = "Todo not found...";
            CustomCode = 40401;
        }
    }
}