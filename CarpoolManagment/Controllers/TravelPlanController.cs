using Core.DTOs;
using Core.Models;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.Exceptions;
using System;

namespace CarpoolManagment.Controllers
{
    [ApiController]
    public class TravelPlanController : ControllerBase
    {
        private readonly TravelPlanServices _travelPlanServices;

        public TravelPlanController(TravelPlanServices travelPlanServices)
        {
            _travelPlanServices = travelPlanServices;
        }

        [HttpGet]
        [Route("api/travelplans")]
        public IActionResult GetTravelPlans(int pageSize, int pageIndex, DateTime dateFrom, DateTime dateTo)
        {
            var tuple = _travelPlanServices.GetTravelPlans(pageSize, pageIndex, dateFrom, dateTo);
            return new ObjectResult(new { travelPlans = tuple.Item1, total = tuple.Item2 });
        }

        [HttpDelete]
        [Route("api/travelPlan/{travelPlanId}")]
        public IActionResult DeleteTravelPlan(int travelPlanId)
        {
            _travelPlanServices.DeleteTravelPlan(travelPlanId);
            return StatusCode(204, "Travel plan successfully deleted!");
        }

        [HttpPost]
        [Route("api/travelPlan")]
        public IActionResult CreateTravelPlan(TravelPlan travelPlan)
        {
            try
            {
                _travelPlanServices.CreateTravelPlan(travelPlan);
                return StatusCode(201, "Travel plan successfully created!");
            }
            catch (BadRequestException e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpPut]
        [Route("api/travelPlan")]
        public IActionResult EditTravelPlan(TravelPlan travelPlan)
        {
            try
            {
                _travelPlanServices.EditTravelPlan(travelPlan);
                return Ok("Travel plan successfully updated!");
            }
            catch (BadRequestException e)
            {
                return StatusCode(500, e.Message);
            }
        }
    }
}