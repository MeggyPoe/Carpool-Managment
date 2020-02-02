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
        private readonly EmployeeServices _employeeServices;

        public EmployeeController(EmployeeServices employeeServices)
        {
            _employeeServices = employeeServices;
        }

        [HttpGet]
        [Route("api/employees")]
        public IActionResult GetCars(DateTime dateFrom, DateTime dateTo, int travelPlanId)
        {
            return StatusCode(200, _employeeServices.GetEmpolyees(dateFrom, dateTo, travelPlanId));
        }
    }
}