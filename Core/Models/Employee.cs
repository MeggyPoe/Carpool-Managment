using Core.Common;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Core.Models
{
    public class Employee : IListTravelPlanEmployees
    {
        public int EmployeeId { get; set; }
        [Required]
        public string EmployeeName { get; set; }
        public bool IsDriver { get; set; }
        public List<TravelPlanEmployee> TravelPlanEmployees { get; set; }
    }
}
