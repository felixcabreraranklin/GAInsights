using System;

namespace GAInsights
{
    public class Config
    {
        public string Company => "NTsPrint";

        public string Project => "GAInsights";

        public string Token { get; set; }

        public bool IsAuthentificated { get; set; }
    }
}
