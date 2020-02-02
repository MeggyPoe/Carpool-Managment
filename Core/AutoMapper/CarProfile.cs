using AutoMapper;
using Core.DTOs;
using Core.Models;

namespace Core.AutoMapper
{
    public class CarProfile : Profile
    {
        public CarProfile()
        {
            CreateMap<Car, CarDTO>()
                .ConvertUsing(y => new CarDTO
                {
                    Value = string.Format("{0} ({1} seats)", y.Name, y.NumberOfSeats),
                    Id = y.Plates,
                    NumberOfSeats = y.NumberOfSeats
                });
        }
    }
}
