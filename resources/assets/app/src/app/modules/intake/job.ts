export class Job{
	constructor(
		public job_id: number,
		public job_is_completed: number,
		public client_id : number,
		public property_id : number,
		public job_ref_suffix : string,
		public job_work_completion_pdf_file : string,
		public job_billing_statement_pdf_file : string
			){

	}
}