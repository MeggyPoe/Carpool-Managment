using AutoMapper;
using Core.DTOs;
using Core.Models;

namespace Core.AutoMapper
{
    public class EmployeeProfile : Profile
    {
        public EmployeeProfile()
        {
            CreateMap<Employee, EmployeeDTO>()
                .ConvertUsing(y => new EmployeeDTO
                {
                    Value = y.IsDriver ? y.EmployeeName + " (Has driver license)" : y.EmployeeName,
                    Id = y.EmployeeId,
                    IsDriver = y.IsDriver
                });
        }
    }
}
