using AutoMapper;
using Core.Common;
using Core.DTOs;
using Core.Exstensions;
using Core.IRepositories;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Services
{
    public class CarService
    {
        private readonly IEntityRepository<Car> _carRepository;
        private readonly IMapper _mapper;

        public CarService(IEntityRepository<Car> carRepository, IMapper mapper)
        {
            _carRepository = carRepository;
            _mapper = mapper;
        }

        public IEnumerable<CarDTO> GetCars(DateTime dateFrom, DateTime dateTo, int travelPlanId)
        {
            var query = _carRepository.ReadAll().FilterIListTravelPlansByAvaibility(dateFrom, dateTo, travelPlanId);
            return _mapper.Map<IQueryable<Car>, IEnumerable<CarDTO>>(query);
        }
    }
}
