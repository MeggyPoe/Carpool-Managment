using System;

namespace Services.Exceptions
{
    public class BadRequestException : ArgumentException
    {
        public BadRequestException(string msg) : base(msg) { }
    }
}
