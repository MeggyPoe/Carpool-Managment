using Core.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Core.Exstensions
{
    public static class QueryableExtensions
    {
        public static IQueryable<TEntity> IncludeMultiple<TEntity>(this IQueryable<TEntity> query, params string[] includes) where TEntity : class
        {
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return query;
        }

        public static IQueryable<TEntity> FilterIListTravelPlansByAvaibility<TEntity>(this IQueryable<TEntity> query, DateTime dateFrom, DateTime dateTo, int travelPlanId) where TEntity : class, IListTravelPlans
        {
            return query.Where(x => !x.TravelPlans.Any() ||
             x.TravelPlans.All(x => x.StartDate > dateTo || x.EndDate < dateFrom || x.Id == travelPlanId));
        }

        public static IQueryable<TEntity> FilterIListTravelPlanEmployeesByAvaibility<TEntity>(this IQueryable<TEntity> query, DateTime dateFrom, DateTime dateTo, int travelPlanId) where TEntity : class, IListTravelPlanEmployees
        {
            return query.Where(x => !x.TravelPlanEmployees.Select(x => x.TravelPlan).Any() ||
             x.TravelPlanEmployees.Select(x => x.TravelPlan).All(x => x.StartDate > dateTo || x.EndDate < dateFrom || x.Id == travelPlanId));
        }
    }
}
