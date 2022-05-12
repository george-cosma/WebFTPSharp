export default class Path {
	path: string[]

	constructor() {
		this.path = [];
	}

	navigate(folder: string): void {
		if (folder === "..") {
			this.navigateBackwards();
		}
		else if (this.isValidPathname(folder)) {
			this.path.push(folder);
		}
	}

	navigateBackwards(): void {
		this.path.pop();
	}

	isValidPathname(name: string): boolean {
		if (name.includes("<")) return false;
		if (name.includes(">")) return false;
		if (name.includes(":")) return false;
		if (name.includes("\"")) return false;
		if (name.includes("/")) return false;
		if (name.includes("\\")) return false;
		if (name.includes("|")) return false;
		if (name.includes("?")) return false;
		if (name.includes("*")) return false;

		return true;
		// TODO: handle NULL BYTES, and all non-printable chars, whilst maintaining international support
	}

	isRoot(): boolean {
		return this.path.length === 0;
	}
}