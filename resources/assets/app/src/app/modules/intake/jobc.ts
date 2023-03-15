export class Job{
	constructor(
		public job_id: number,
		public job_ref_suffix: string,
		public job_ref_parent: number,
		public client_id: number,
		public billing_id: number,
		public buyer_agent_id: number,
		public seller_agent_id: number,
		public title_escrow_id: number,
		public property_id: number,
		public agent_id: number,
		public job_sub_type: string,
		public scheduled_id: number,
		public job_date_scheduled: any,
		public job_fee: any,
        public job_fee_discount: any,
        public job_fee_discount_type: any,
		public report_id: number,
		public job_status: string,
		public report_change_status: number,
		public report_description_general: string,
		public report_diagram_file: string,
		public report_pdf_file: string,
		public report_pdf_file_w_contract: string,
		public property_address1: string,
		public property_address2: string,
		public property_city: string,
		public property_state: string,
		public property_zip: string
			){

	}
}