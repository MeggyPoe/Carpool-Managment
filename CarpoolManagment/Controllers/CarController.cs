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
    public class CarController : ControllerBase
    {
        private readonly CarService _carService;

        public CarController(CarService carService)
        {
            _carService = carService;
        }

        [HttpGet]
        [Route("api/cars")]
        public IActionResult GetCars(DateTime dateFrom, DateTime dateTo, int travelPlanId)
        {
            return StatusCode(200, _carService.GetCars(dateFrom, dateTo, travelPlanId));
        }
    }
}