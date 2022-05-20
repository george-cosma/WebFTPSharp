using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using WebFTPSharp.Hubs;
using WebFTPSharp.Services.FileProvider;

namespace WebFTPSharp
{
	public class Startup
	{
		ServerConfig serverConfig;

		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;

			string configPath = Path.GetFullPath("./config/serverconfig.json", Directory.GetCurrentDirectory());
			if (File.Exists(configPath))
			{
				try
				{
					serverConfig = JsonSerializer.Deserialize<ServerConfig>(File.ReadAllText(configPath));
				}
				catch (Exception ex)
				{
					Console.WriteLine($"Failed to read configuration from {configPath}! Did you misspell something?");
					throw ex;
				}
			}
			else
			{
				Console.WriteLine($"Did not find any configuration file at {configPath}!" +
					$"If you haven't made one yet, check the sample configuration found in the same place as where the configuration file should be");

				throw new FileNotFoundException();
			}
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddRazorPages();
			services.AddSignalR();

			// Why Singleton?
			// https://stackoverflow.com/questions/38138100/addtransient-addscoped-and-addsingleton-services-differences
			services.AddSingleton<IFileProvider, LocalFileProvider>( _ => new LocalFileProvider(serverConfig.ServerFolderPath));
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
			}

			//app.UseDefaultFiles();
			app.UseStaticFiles();

			app.UseRouting();

			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapRazorPages();
				// Map API controlleres
				endpoints.MapControllers();
				endpoints.MapHub<FileBrowserHub>("/api/hubs/filebrowser");
			});

		}
	}

	public class ServerConfig
	{
		public string ServerFolderPath { get; set; }
	}
}
