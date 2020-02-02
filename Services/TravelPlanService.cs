using AutoMapper;
using Core.DTOs;
using Core.Exstensions;
using Core.IRepositories;
using Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Services
{
    public class TravelPlanService
    {
        private readonly IEntityRepository<TravelPlan> _travelPlanRepository;
        private readonly ValidationService _validationService;
        private readonly IMapper _mapper;

        public TravelPlanService(IEntityRepository<TravelPlan> travelPlanRepository, IMapper mapper, ValidationService validationService)
        {
            _travelPlanRepository = travelPlanRepository;
            _mapper = mapper;
            _validationService = validationService;
        }

        public Tuple<IEnumerable<TravelPlanDTO>, int> GetTravelPlans(int pageSize, int pageIndex, DateTime dateFrom, DateTime dateTo)
        {
            var query = _travelPlanRepository.ReadAllWhere(x => x.StartDate.Month == dateFrom.Month && x.StartDate.Year == dateFrom.Year ||
            x.EndDate.Month == dateTo.Month && x.EndDate.Year == dateTo.Year)
                .IncludeMultiple("StartLocation", "EndLocation", "Car", "TravelPlanEmployees.Employee");

            var totalCount = query.Count();

            query = query
                .OrderBy(x => x.StartDate)
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize);

            var t = query.ToList();
            return new Tuple<IEnumerable<TravelPlanDTO>, int>(_mapper.Map<IQueryable<TravelPlan>, IEnumerable<TravelPlanDTO>>(query), totalCount);
        }

        public void DeleteTravelPlan(int travelPlanId)
        {
            _travelPlanRepository.Delete(travelPlanId);
            _travelPlanRepository.Save();
        }

        public void CreateTravelPlan(TravelPlan travelPlan)
        {
            _validationService.ValidateTravelPlan(travelPlan);
            _travelPlanRepository.Create(travelPlan);
            _travelPlanRepository.Save();
        }
        public void EditTravelPlan(TravelPlan travelPlan)
        {
            _validationService.ValidateTravelPlan(travelPlan);
            var existingTravelPlan = _travelPlanRepository.GetAllWhere(x => x.Id == travelPlan.Id).Include(x => x.TravelPlanEmployees).Single();
            existingTravelPlan.EndLocationId = travelPlan.EndLocationId;
            existingTravelPlan.StartLocationId = travelPlan.StartLocationId;
            existingTravelPlan.StartDate = travelPlan.StartDate;
            existingTravelPlan.EndDate = travelPlan.EndDate;
            existingTravelPlan.CarId = travelPlan.CarId;
            existingTravelPlan.TravelPlanEmployees = travelPlan.TravelPlanEmployees;
            _travelPlanRepository.Save();
        }
    }
}
