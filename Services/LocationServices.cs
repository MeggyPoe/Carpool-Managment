

using Core.IRepositories;
using Core.Models;
using System.Collections.Generic;

namespace Services
{
    public class LocationServices
    {
        private readonly IEntityRepository<Location> _locationRepository;

        public LocationServices(IEntityRepository<Location> locationRepository)
        {
            _locationRepository = locationRepository;
        }

        public IEnumerable<Location> GetLocations()
        {
            return _locationRepository.ReadAll();
        }
    }
}
