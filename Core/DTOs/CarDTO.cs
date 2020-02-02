using Core.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.DTOs
{
    public class CarDTO : KeyValue<string>
    {
        public int NumberOfSeats { get; set; }
    }
}
