

using Core.IRepositories;
using Core.Models;
using System.Collections.Generic;

namespace Services
{
    public class LocationService
    {
        private readonly IEntityRepository<Location> _locationRepository;

        public LocationService(IEntityRepository<Location> locationRepository)
        {
            _locationRepository = locationRepository;
        }

        public IEnumerable<Location> GetLocations()
        {
            return _locationRepository.ReadAll();
        }
    }
}
