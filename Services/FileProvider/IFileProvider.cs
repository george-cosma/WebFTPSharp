using System.Collections.Generic;
using WebFTPSharp.Models;

namespace WebFTPSharp.Services.FileProvider
{
	public interface IFileProvider
	{
		public List<NavigationItem> GetNavigationItems(List<string> path);
		public void UpdateFiles();
		public byte[]? GetFile(string id);
	}
}
