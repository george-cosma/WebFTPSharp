using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using WebFTPSharp.Services.FileProvider;

namespace WebFTPSharp.Pages.api
{
	[Route("api/upload")]
	[ApiController]
	public class UploadController : ControllerBase
	{
		private readonly ILogger<UploadController> _logger;
		private readonly IFileProvider fileProvider;

		public UploadController(ILogger<UploadController> logger, IFileProvider fileProvider)
		{
			_logger = logger;
			this.fileProvider = fileProvider;
		}

		// POST api/download
		[HttpPost]
		public async Task<ActionResult> Post([FromBody] UploadRequestModel data)
		{
			if (data.FileName != null && data.Path != null)
			{
				_logger.LogInformation($"Someone is uploading a file with name '${data.FileName}' in ${string.Join('/', data.Path)}");

				string id = await fileProvider.UploadFileAsync(Request.Body, data.Path, data.FileName);

				return Ok(id);
			}
			return BadRequest("You must provide a valid ID or the file no longer exists.");
		}

		public class UploadRequestModel
		{
			[Required]
			public string? FileName { get; set; }
			[Required]
			public List<string>? Path { get; set; }

		}
	}
}
