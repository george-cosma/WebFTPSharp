export default class Path {
	path: string[]

	constructor() {
		this.path = [];
	}

	navigate(folder: string): void {
		if (folder === "..") {
			this.navigate_backwards();
		}
		else if (this.is_valid_pathname(folder)) {
			this.path.push(folder);
		}
	}

	navigate_backwards(): void {
		this.path.pop();
	}

	is_valid_pathname(name: string): boolean {
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
}