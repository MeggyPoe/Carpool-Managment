using Core.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.DTOs
{
    public class EmployeeDTO : KeyValue<int>
    {
        public bool IsDriver { get; set; }
    }
}
