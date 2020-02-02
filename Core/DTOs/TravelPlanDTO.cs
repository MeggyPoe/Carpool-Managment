using Core.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.DTOs
{
    public class TravelPlanDTO
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public KeyValue<int> StartLocation { get; set; }
        public KeyValue<int> EndLocation { get; set; }
        public CarDTO Car { get; set; }
        public IEnumerable<TravelPlanEmployeeDTO> Employees { get; set; }
    }
}
