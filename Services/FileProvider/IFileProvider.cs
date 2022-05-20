using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using WebFTPSharp.Models;

namespace WebFTPSharp.Services.FileProvider
{
	public interface IFileProvider
	{
		// Events
		public delegate void FileUploadedEventHandler(string fileHash);
		public event FileUploadedEventHandler? FileUploaded;
		// Methods
		public List<NavigationItem> GetNavigationItems(List<string> path);
		public void UpdateFiles();

		public byte[]? GetFile(string id);
		public Task<byte[]?> GetFileAsync(string id);
		public Stream? GetFileStream(string id);

		public Task<string> UploadFileAsync(Stream requestBodyStream, List<string> path, string filename);
	}
}
