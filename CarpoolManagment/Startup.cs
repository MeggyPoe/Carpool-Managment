using AutoMapper;
using Core.AutoMapper;
using Core.IRepositories;
using Core.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistance;
using Persistance.Repositories;
using Services;

namespace CarpoolManagment
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddDbContext<CarpoolManagmentContext>(options => options.UseSqlite("Data Source=CarpoolManagment.db"));

            services.AddTransient<IEntityRepository<TravelPlan>, EntityRepository<TravelPlan>>();
            services.AddTransient<IEntityRepository<Location>, EntityRepository<Location>>();
            services.AddTransient<IEntityRepository<Car>, EntityRepository<Car>>();
            services.AddTransient<IEntityRepository<Employee>, EntityRepository<Employee>>();

            services.AddTransient<TravelPlanServices>();
            services.AddTransient<LocationServices>();
            services.AddTransient<CarServices>();
            services.AddTransient<EmployeeServices>();

            services.AddAutoMapper(typeof(TravelPlanProfile));
            services.AddAutoMapper(typeof(CarProfile));
            services.AddAutoMapper(typeof(EmployeeProfile));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
