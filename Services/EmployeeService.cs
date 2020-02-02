using Core.IRepositories;
using Core.Models;
using System;
using System.Collections.Generic;
using Core.Exstensions;
using System.Linq;
using Core.DTOs;
using AutoMapper;

namespace Services
{
    public class EmployeeService
    {
        private readonly IEntityRepository<Employee> _employeeRepository;
        private readonly IMapper _mapper;

        public EmployeeService(IEntityRepository<Employee> employeeRepository, IMapper mapper)
        {
            _employeeRepository = employeeRepository;
            _mapper = mapper;
        }

        public IEnumerable<EmployeeDTO> GetEmpolyees(DateTime dateFrom, DateTime dateTo, int travelPlanId)
        {
            var query = _employeeRepository.ReadAll().FilterIListTravelPlanEmployeesByAvaibility(dateFrom, dateTo, travelPlanId);
            return _mapper.Map<IEnumerable<Employee>, IEnumerable<EmployeeDTO>>(query);
        }
    }
}
