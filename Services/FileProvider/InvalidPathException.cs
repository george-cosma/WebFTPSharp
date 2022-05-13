using System;
using System.Runtime.Serialization;

namespace WebFTPSharp.Services.FileProvider
{
	[Serializable]
	public class InvalidPathException : Exception
	{
		public InvalidPathException() : base("The provided path is invalid, or exits outside the scope of the sandboxed folder.") { }
		public InvalidPathException(string message) : base(message) { }
		public InvalidPathException(string message, Exception inner) : base(message, inner) { }

		protected InvalidPathException(SerializationInfo info, StreamingContext context) : base(info, context) { }
	}
}
