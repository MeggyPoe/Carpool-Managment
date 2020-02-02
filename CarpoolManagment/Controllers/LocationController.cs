using Microsoft.AspNetCore.Mvc;
using Services;

namespace CarpoolManagment.Controllers
{
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly LocationServices _locationServices;

        public LocationController(LocationServices locationServices)
        {
            _locationServices = locationServices;
        }

        [HttpGet]
        [Route("api/locations")]
        public IActionResult GetLocations()
        {
            return StatusCode(200, _locationServices.GetLocations());
        }
    }
}