using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Models
{
    public class TravelPlanEmployee
    {
        public int Id { get; set; }
        public int TravelPlanId { get; set; }
        public int EmployeeId { get; set; }

        public TravelPlan TravelPlan { get; set; }
        public Employee Employee { get; set; }
    }
}
