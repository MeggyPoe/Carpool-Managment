using Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Common
{
    public interface IListTravelPlans
    {
        public IEnumerable<TravelPlan> TravelPlans { get; set; }
    }
}
