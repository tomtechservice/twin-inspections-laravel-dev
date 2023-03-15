import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class DiagramService {

	constructor(private http: HttpClient) { }
  	
  	private doSpace = environment.doSpace;
  	private apiURL = environment.api;
  	private apiSite = environment.apiSite;

  	getDiagramUrl = function(jobId, imagePath) {
		return this.apiSite+'image/proxy?url='+this.doSpace+'/media/diagrams/'+jobId+'/'+imagePath;
	}
	uploadDiagram(diagram) {
		return this.http.post(this.apiURL+'upload_diagram',diagram, httpOptions);
	}
	clearCache(job_id) {
		return this.http.get(this.apiURL+'clear_cache/'+job_id);
	}
}
