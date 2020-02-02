using Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Common
{
    public interface IListTravelPlanEmployees
    {
        public List<TravelPlanEmployee> TravelPlanEmployees { get; set; }
    }
}
