using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Core.Models
{
    public class TravelPlan
    {
        public int Id { get; set; }
        [Required]
        public int StartLocationId { get; set; }
        [Required]
        public int EndLocationId { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public string CarId { get; set; }

        public Location StartLocation { get; set; }
        public Location EndLocation { get; set; }
        public Car Car { get; set; }
        [Required, MinLength(1)]
        public List<TravelPlanEmployee> TravelPlanEmployees { get; set; }

        [NotMapped]
        public List<Employee> Employees
        {
            get { return TravelPlanEmployees != null ? TravelPlanEmployees.Select(x => x.Employee).ToList() : new List<Employee>(); }
            set
            {
                TravelPlanEmployees = new List<TravelPlanEmployee>();
                foreach (var employee in value)
                {
                    TravelPlanEmployees.Add(new TravelPlanEmployee { TravelPlanId = Id, EmployeeId = employee.EmployeeId });
                }
            }
        }
    }
}
