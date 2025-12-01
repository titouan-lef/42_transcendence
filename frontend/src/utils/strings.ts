function isOneStringEmtpy(...args: string[]): boolean {
	for (const arg of args) {
		if (!arg)
			return true;
	}
	return false;
}

export { isOneStringEmtpy };
