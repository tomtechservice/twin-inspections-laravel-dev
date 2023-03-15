export class Post {
	constructor(
		public id: number,
		public heading: string,
		public slug: string,
		public description: string,
		public status: string,
		public title: string,
		public meta_description: string,
		public comment_status: string,
		public post_type: string
  	) {  }
}