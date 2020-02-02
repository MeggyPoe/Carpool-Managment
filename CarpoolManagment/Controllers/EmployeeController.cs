using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace CarpoolManagment.Controllers
{
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeService _employeeService;

        public EmployeeController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        [Route("api/employees")]
        public IActionResult GetCars(DateTime dateFrom, DateTime dateTo, int travelPlanId)
        {
            return StatusCode(200, _employeeService.GetEmpolyees(dateFrom, dateTo, travelPlanId));
        }
    }
}