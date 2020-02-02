using AutoMapper;
using Core.Common;
using Core.DTOs;
using Core.Models;
using System.Linq;

namespace Core.AutoMapper
{
    public class TravelPlanProfile : Profile
    {
        public TravelPlanProfile()
        {
            CreateMap<TravelPlan, TravelPlanDTO>()
                .ForMember(x => x.Car, opt => opt.MapFrom(
                   y => new CarDTO
                   {
                       Value = string.Format("{0} ({1} seats)", y.Car.Name, y.Car.NumberOfSeats),
                       Id = y.Car.Plates,
                       NumberOfSeats = y.Car.NumberOfSeats
                   }))
                .ForMember(x => x.Employees, opt => opt.MapFrom(y => y.Employees.Select(z =>
                    new TravelPlanEmployeeDTO
                    {
                        Value = z.EmployeeName,
                        Id = z.EmployeeId,
                        TravelPlanEmployeeId = z.TravelPlanEmployees.Single(t => t.TravelPlanId == y.Id && t.EmployeeId == z.EmployeeId).Id
                    })));
        }
    }
}
