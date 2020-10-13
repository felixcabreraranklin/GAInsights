using AutoMapper;
using GAInsights.Data.Repository;
using GAInsights.Data.UoW;
using GAInsights.Middlewares;
using GAInsights.Services;
using GAInsights.Services.Impls;
using GAInsights.Utils;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace GAInsights
{
    public class Startup
    {
        readonly private string CustomAllowAllHeadersPolicy = "GAInsightsAllowAllHeadersPolicy";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            Log.Logger = new LoggerConfiguration()
                         .MinimumLevel.Information()
                         .WriteTo.Console()
                         .CreateLogger();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            // In production, the Angular files will be served from this directory
            //services.AddSpaStaticFiles(configuration =>
            //{
            //    //configuration.RootPath = "ClientApp/dist";
            //    configuration.RootPath = "ClientApp";
            //});

            services.ConfigureCors();
            services.AddCors(options =>
            {
                options.AddPolicy(CustomAllowAllHeadersPolicy,
                builder =>
                {
                    builder
                       //.WithOrigins("https://localhost:5001", "https://localhost")
                       .AllowAnyOrigin()
                       .AllowAnyHeader()
                       .AllowAnyMethod();
                });
            });

            services.ConfigureDbContext(Configuration);
            services.ConfigureSwagger();
            services.ConfigurePerformance();

            services.AddAutoMapper(typeof(Startup));

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddTransient<ITodoService, TodoService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API GAInsights V1");
                });
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production
                // scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors();
            //app.UseCors(builder =>
            //{
            //    builder
            //    .AllowAnyOrigin()
            //    .AllowAnyMethod()
            //    .AllowAnyHeader();
            //});
            //app.UseCors(builder =>
            //{
            //    builder
            //    .WithOrigins("https://localhost:5001")
            //    .AllowAnyMethod()
            //    .AllowAnyHeader()
            //    .AllowCredentials();
            //});

            app.UseHttpsRedirection();
            //app.UseStaticFiles();
            //if (!env.IsDevelopment())
            //{
            //    app.UseSpaStaticFiles();
            //}

            app.UseRouting();
            app.UseMiddleware(typeof(ErrorWrappingMiddleware));
            app.UseResponseCompression();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}")
                .RequireCors(CustomAllowAllHeadersPolicy);
            });

            //app.UseSpa(spa =>
            //{
            //    // To learn more about options for serving an Angular SPA from ASP.NET Core, see https://go.microsoft.com/fwlink/?linkid=864501

            //    spa.Options.SourcePath = "ClientApp";

            //    //if (env.IsDevelopment())
            //    //{
            //    //    spa.UseAngularCliServer(npmScript: "start");
            //    //}
            //});
        }
    }
}