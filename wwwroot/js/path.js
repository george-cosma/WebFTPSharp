export default class Path {
	constructor() {
		this.path = [];
	}

	navigate(folder) {
		if (folder === "..") {
			this.navigate_backwards();
		}
		else if (this.is_valid_pathname(folder)) {
			this.path.push(folder);
		}
	}

	navigate_backwards() {
		this.path.pop();
	}

	is_valid_pathname(name) {
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