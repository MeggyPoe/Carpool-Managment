using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Persistance
{
    public class CarpoolManagmentContext : DbContext
    {
        public CarpoolManagmentContext(DbContextOptions<CarpoolManagmentContext> options) : base(options) { }

        public DbSet<Car> Cars { get; set; }
        public DbSet<CarType> CarTypes { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<TravelPlan> TravelPlans { get; set; }
        public DbSet<TravelPlanEmployee> TravelPlanEmployees { get; set; }
    }


}
