using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using WebFTPSharp.Models;

namespace WebFTPSharp.Services.FileProvider
{
	public interface IFileProvider
	{
		public List<NavigationItem> GetNavigationItems(List<string> path);
		public void UpdateFiles();
		public byte[]? GetFile(string id);
		public Task<byte[]?> GetFileAsync(string id);
		public Stream? GetFileStream(string id);
	}
}
