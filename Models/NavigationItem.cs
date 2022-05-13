namespace WebFTPSharp.Models
{
	public class NavigationItem
	{
		public string ItemType { get; private set; }
		public string Name { get; private set; }
		public string? Id { get; private set; }

		public NavigationItem(NavigationItemType itemType, string name)
		{
			if (itemType == NavigationItemType.FOLDER)
				ItemType = "folder";
			else if (itemType == NavigationItemType.FILE)
				ItemType = "file";
			else
				ItemType = "unknown";

			Name = name;
		}

		public NavigationItem(NavigationItemType itemType, string name, string id) : this(itemType, name)
		{
			Id = id;
		}
	}

	public enum NavigationItemType
	{
		FOLDER,
		FILE
	}
}
