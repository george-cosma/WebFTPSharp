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
		[RequestFormLimits(ValueLengthLimit = int.MaxValue, MultipartBodyLengthLimit = int.MaxValue)]
		[DisableRequestSizeLimit]
		public async Task<ActionResult> Post([FromForm] UploadRequestModel data)
		{
			if(data.Path == null)
			{
				data.Path = new List<string>();
			}

			if (data.FileName != null && Request.Form.Files.Count == 1)
			{
				_logger.LogInformation($"Someone is uploading a file with name '{data.FileName}' in {string.Join('/', data.Path)}");

				string id = await fileProvider.UploadFileAsync(Request.Form.Files[0].OpenReadStream(), data.Path, data.FileName);

				return Ok(id);
			}
			return BadRequest();
		}

		public class UploadRequestModel
		{
			[Required]
			public string? FileName { get; set; }

			public List<string>? Path { get; set; }

		}
	}
}
