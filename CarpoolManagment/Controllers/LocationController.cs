using Microsoft.AspNetCore.Mvc;
using Services;

namespace CarpoolManagment.Controllers
{
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly LocationService _locationService;

        public LocationController(LocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet]
        [Route("api/locations")]
        public IActionResult GetLocations()
        {
            return StatusCode(200, _locationService.GetLocations());
        }
    }
}