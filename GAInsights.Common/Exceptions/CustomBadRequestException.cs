using System.Net;

namespace GAInsights.Common.Exceptions
{
    public class CustomBadRequestException : CustomBaseException
    {
        public CustomBadRequestException() : base()
        {
            HttpCode = (int)HttpStatusCode.BadRequest;
            CustomMessage = "Todo malformed...";
            CustomCode = 40001;
        }
    }
}