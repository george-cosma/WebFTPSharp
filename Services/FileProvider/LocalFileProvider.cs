using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using WebFTPSharp.Models;
using static WebFTPSharp.Services.FileProvider.IFileProvider;

namespace WebFTPSharp.Services.FileProvider
{
	public class LocalFileProvider : IFileProvider
	{
		private string basePath;
		
		/// <summary>
		/// A dictionary which maps a file's hash to its filepath
		/// HASH -> FILEPATH
		/// </summary>
		private Dictionary<string, string> fileTable = new Dictionary<string, string>();
		/// <summary>
		/// A dictionary which maps a file's filepath to its hash
		/// FILEPATH -> HASH
		/// </summary>
		private Dictionary<string, string> hashTable = new Dictionary<string, string>();

		private ReaderWriterLockSlim updateLock = new ReaderWriterLockSlim();

		// Events
		public event FileUploadedEventHandler? FileUploaded;

		public LocalFileProvider(string basePath)
		{
			this.basePath = basePath;
			UpdateFiles();
		}

		// Update ALL File hashes
		public void UpdateFiles()
		{

			// Another thread is currently waiting for all (old) reads
			// to finish up, before updating. This means that whatever new change happend 
			// will be picked up by that other thread, so we don't need to update in this thread too.
			if (updateLock.WaitingWriteCount > 0) return;

			updateLock.EnterWriteLock();
			try
			{
				fileTable.Clear();
				hashTable.Clear();
				UpdateFiles(basePath);
			}

			finally
			{
				updateLock.ExitWriteLock();
			}
		}
		private void UpdateFiles(string path)
		{
			foreach(string mixedFilePath in Directory.GetFiles(path))
			{
				string filePath = NormalizePath(mixedFilePath);
				string hash = SHA256Hash(filePath);

				fileTable.Add(hash, filePath);
				hashTable.Add(filePath, hash);
			}
			foreach (string dirPath in Directory.GetDirectories(path))
			{
				UpdateFiles(dirPath);
			}
		}


		// Get navigation items
		public List<NavigationItem> GetNavigationItems(List<string> path)
		{
			List<NavigationItem> result = new List<NavigationItem>();

			updateLock.EnterReadLock();
			try
			{
				string finalPath = ConstructAndVerifyPath(path);

				// Construct Result
				foreach (string mixedDirectoryPath in Directory.GetDirectories(finalPath))
				{
					string directoryPath = NormalizePath(mixedDirectoryPath);

					string dirName = Path.GetFileName(directoryPath);
					result.Add(new NavigationItem(NavigationItemType.FOLDER, dirName));
				}

				foreach (string mixedFilePath in Directory.GetFiles(finalPath))
				{
					string filePath = NormalizePath(mixedFilePath);

					string fileName = Path.GetFileName(filePath);
					result.Add(new NavigationItem(NavigationItemType.FILE, fileName, hashTable[filePath]));
				}
			}
			finally 
			{
				updateLock.ExitReadLock(); 
			}

			return result;
		}
		private string ConstructAndVerifyPath(List<string> path)
		{
			// Verify Path
			if (!IsLooselyValidPath(path))
				throw new InvalidPathException();

			string finalPath = basePath;
			foreach (string pathItem in path)
			{
				finalPath = Path.GetFullPath(pathItem, finalPath);
			}

			finalPath = Path.GetFullPath(finalPath);

			if (!Path.IsPathFullyQualified(finalPath) || !Directory.Exists(finalPath) || !IsSubdirectory(basePath, finalPath))
				throw new InvalidPathException();

			return NormalizePath(finalPath);
		}
		private bool IsSubdirectory(string basePath, string finalPath)
		{
			string baseFullPath = Path.GetFullPath(basePath);
			string finalFullPath = Path.GetFullPath(finalPath);

			return finalFullPath.Contains(baseFullPath);
		}
		/// <summary>
		/// Checks if the path array is loosely valid. This function checks that each path segment is valid, 
		/// but does not check that the whole merged path is valid.
		/// In practice, this means that the path cannot be null, cannot have elements which contain '/',
		/// and cannot have elements which are ".." or "."
		/// </summary>
		/// <param name="path"></param>
		/// <returns></returns>
		private bool IsLooselyValidPath(List<string> path)
		{
			if (path == null) return false;
			if (path.Any( item => item.Contains('/'))) return false;
			if (path.Any(item => item.Trim().Equals("..") || item.Trim().Equals("."))) return false;

			return true;
		}

		// Get a file
		public byte[]? GetFile(string id)
		{
			string? filepath = GetFilePath(id);
			if (String.IsNullOrWhiteSpace(filepath)) return null;

			// TODO: add read-lock on file 
			// TODO: return a stream instead? It might use too much RAM for large files...
			return File.ReadAllBytes(filepath);
		}
		public async Task<byte[]?> GetFileAsync(string id)
		{
			string? filepath = GetFilePath(id);
			if (String.IsNullOrWhiteSpace(filepath)) return null;

			// TODO: add read-lock on file 
			// TODO: return a stream instead? It might use too much RAM for large files...
			return await File.ReadAllBytesAsync(filepath);
		}
		public Stream? GetFileStream(string id)
		{
			string? filepath = GetFilePath(id);
			if (String.IsNullOrWhiteSpace(filepath)) return null;

			// TODO: add read-lock on file 
			// TODO: return a stream instead? It might use too much RAM for large files...
			return File.OpenRead(filepath);
		}
		private string? GetFilePath(string id)
		{
			string? filepath = String.Empty;

			// Get the filepath of the desired file
			updateLock.EnterReadLock();
			try
			{
				if (!fileTable.TryGetValue(id, out filepath))
				{
					return null;
				}
			}
			finally
			{
				updateLock.ExitReadLock();
			}

			return filepath;
		}

		// Upload a file
		public async Task<string> UploadFileAsync(Stream requestBodyStream, List<string> path, string filename)
		{
			string finalFilePath = NormalizePath(ConstructAndVerifyPath(path) + "/" + filename);

			if (File.Exists(finalFilePath))
				throw new ArgumentException($"File already exists at {finalFilePath}!", nameof(filename));
			
			// This will throw an exception if the filename is invalid
			var fs = File.OpenWrite(finalFilePath);
			await requestBodyStream.CopyToAsync(fs);
			await fs.DisposeAsync();

			// TODO: create a custom read/write lock, so that we don't need to refresh the whole file/hash tables
			UpdateFiles();

			// TODO: Create a background thread to handle the event handlers, so that the client doesn't need to wait for the event handlers to finish
			// Note: this does not have an impact if all listeners are async...
			FileUploaded?.Invoke(hashTable[finalFilePath]);

			return hashTable[finalFilePath];
		}

		// Auxiliary Methods
		private static string SHA256Hash(string text)
		{
			// https://stackoverflow.com/a/6839784
			if (String.IsNullOrEmpty(text))
				return String.Empty;

			using (var sha = new System.Security.Cryptography.SHA256Managed())
			{
				byte[] textData = System.Text.Encoding.UTF8.GetBytes(text);
				byte[] hash = sha.ComputeHash(textData);

				StringBuilder sb = new StringBuilder();
				foreach (byte b in hash)
					sb.Append(b.ToString("x2"));

				return sb.ToString();
			}
		}
		private static string NormalizePath(string mixedPath)
		{
			return Path.GetFullPath(mixedPath);
		}
	}
}
