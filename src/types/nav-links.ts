export interface NavLinks {
	links: Link[];
	linkActiveState: string;
	linkDefaultState?: string;
	otherStyleClasses?: string;
}

export interface Link {
	label: string;
	href: string;
}
