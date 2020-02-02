using Core.Models;
using Services.Exceptions;
using System.Linq;

namespace Services
{
    public class ValidationService
    {
        private readonly EmployeeService _employeeService;
        private readonly CarService _carService;

        public ValidationService(EmployeeService employeeService, CarService carService)
        {
            _employeeService = employeeService;
            _carService = carService;
        }

        public void ValidateTravelPlan(TravelPlan travelPlan)
        {
            var newTravelPlanEmployees = travelPlan.TravelPlanEmployees.Select(x => x.EmployeeId);
            var availableEmloyees = _employeeService.GetEmpolyees(travelPlan.StartDate, travelPlan.EndDate, travelPlan.Id);

            if (newTravelPlanEmployees.Intersect(availableEmloyees.Select(x => x.Id)).Count() < newTravelPlanEmployees.Count())
            {
                throw new BadRequestException("Some employees are not available for selected travel period!");
            }
            if (!availableEmloyees.Any(x => x.IsDriver && newTravelPlanEmployees.Contains(x.Id)))
            {
                throw new BadRequestException("Travel plan needs to have atleast one driver!");
            }

            var availableCars = _carService.GetCars(travelPlan.StartDate, travelPlan.EndDate, travelPlan.Id).Select(x => x.Id);
            if (!availableCars.Contains(travelPlan.CarId))
            {
                throw new BadRequestException("Car is not available for selected travel period!");
            }
        }
    }
}
