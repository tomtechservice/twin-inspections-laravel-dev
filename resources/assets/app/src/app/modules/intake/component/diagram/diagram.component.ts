import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../../services/report/report.service';
import { DiagramService } from '../../services/diagram/diagram.service';
import { FindingService } from '../../services/finding/finding.service';
import { Router,ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import * as LC from 'literallycanvas';
import { ScaleControlStyle } from '@agm/core/services/google-maps-types';
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit {
    page_title="Inspection: Diagram";
    private apiSite = environment.apiSite;
    lc : any;
    job_id : number;
    letterPrefix = "";
    reportData = [];
    findingsData = [];
    uploadImage = {};
  	constructor( 
        private  _router : Router,
        private  router : ActivatedRoute,
        private reportService: ReportService,
        private diagramService: DiagramService,
        private findingService: FindingService
    ) { }

  	ngOnInit() {
        localStorage.setItem('tab', JSON.stringify(true) );
        this.router.params.subscribe(params => { 
            if(params.jobId){
                this.job_id = params.jobId;
                this.getReport(this.job_id);   
            }
      
        })
        
  	}
    getReport(jobId){
        this.reportService.getReportUsingJobId(jobId).subscribe(
            data => { 
                this.reportData = data;
                // console.log(this.reportData);
                this.loadLc(this.reportData);
                this.getFindings(this.job_id);
            }
        );
   }
   getFindings(jobId){
       this.findingService.getJobFindings(jobId).subscribe(
            data => { 
                this.findingsData = data;
                this.loadCustomText();
            }
        );
   }
   loadLc(reportData){
        this.lc = LC.init( document.getElementsByClassName('literally2')[0], {
            imageURLPrefix: 'assets/literallycanvas/img',
            strokeWidths: [2,5,10,25],
            primaryColor: '#000',
            tools:[
                LC.tools.Pencil,
                LC.tools.Eraser,
                LC.tools.Line,
                LC.tools.Rectangle,
                LC.tools.Ellipse,
                LC.tools.Text,
                LC.tools.Polygon,
                LC.tools.Pan
            ],
            secondaryColor: 'transparent',
            backgroundColor: 'transparent',
            defaultStrokeWidth: 2
        });

        if(reportData.report_diagram_vector){
            this.lc.loadSnapshot(JSON.parse(reportData.report_diagram_vector));
        } else if(reportData.report_diagram_file) {
            var newImage = new Image();
            newImage.src = this.diagramService.getDiagramUrl(this.job_id, reportData.report_diagram_file);
            this.lc.saveShape(LC.createShape('Image', {x: 10, y: 10, image: newImage}));
        }
        
    }
    loadCustomText(){
        var optionString='<option value=""></option>';
        var lettersString='<option value=""></option>';
        var letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
        var arrayLength = this.findingsData.length;
        for (var i = 0; i < arrayLength; i++) {
            var strDropDown = this.findingsData[i].finding_type+this.findingsData[i].finding_finding
            optionString += '<option value="'+strDropDown+'">' + strDropDown + '</option>';    
        }
        
        // add a to z letters
        for(var j = 0; j < letters.length; j++) {
            lettersString += '<option value="'+letters[j]+'">' + letters[j] + '</option>';    
        }
        optionString = '<style>.active-letter-prefix{background-color: #a6a6a6 !important;}</style><div id="textoptiondiv" style="display: block;height: 30px;line-height: 31px;padding-left: 120px;background-color: #f5f5f5;text-align: left;"><select id="textoptionselect">' + optionString + '</select><label style="margin-left:20px;margin-right:0px;">Manual</label><button class="letterPrefix btn btn-primary" style="margin-left:5px;padding: 0px 5px;font-size: 14px;background-color: #e9e9ed;border-color: #8f8f9d;color:#000;margin-top: -3px;" data-value="1">1</button><button class="letterPrefix btn btn-primary" style="margin-left:5px;padding: 0px 5px;font-size: 14px;background-color: #e9e9ed;border-color: #8f8f9d;color:#000;margin-top: -3px;" data-value="2">2</button><button class="letterPrefix btn btn-primary" style="margin-left:5px;padding: 0px 5px;font-size: 14px;background-color: #e9e9ed;border-color: #8f8f9d;color:#000;margin-top: -3px;" data-value="3">3</button><button class="letterPrefix btn btn-primary" style="margin-left:5px;padding: 0px 5px;font-size: 14px;background-color: #e9e9ed;border-color: #8f8f9d;color:#000;margin-top: -3px;" data-value="4">4</button><button class="letterPrefix btn btn-primary" style="margin-left:5px;padding: 0px 5px;font-size: 14px;background-color: #e9e9ed;border-color: #8f8f9d;color:#000;margin-top: -3px;" data-value="5">5</button><select id="lettersoptionselect" style="margin-left:5px;>' + lettersString + '</select><button id="selectNextLetter" class="btn btn-primary" style="margin-left:5px;padding: 0px 5px;font-size: 14px;background-color: #e9e9ed;border-color: #8f8f9d;color:#000;margin-top: -3px;">></button><span style="margin-left:-112px; margin-right: 10px;"> Click and hold to place text. Select Blank for custom text</span></div>';
        
        $(".literally.toolbar-at-top .lc-options").append(optionString);
        
        $(".literally.toolbar-at-top .lc-options").find('.lc-font-settings').remove();
        console.log("dfd",this.lc);
        if (this.lc.tool.name != "Text"){
            $("#textoptiondiv").hide();
        }

        var unsubscribe = this.lc.on('toolChange', function({tool}) {

            if (tool.name == "Text")
            {
                
                $("#textoptiondiv").show();
                var selectedValue = $("#textoptionselect").val();
                if(selectedValue == ""){
                    tool.dropdownText = false;
                }else{
                    tool.dropdownText = true;        
                }  
                tool.setText(selectedValue);
            }else{
                $("#textoptiondiv").hide();
            }             

         
        });
        let that = this.lc; 
        let thisthat = this;  
        $('#textoptionselect').on('change', function() {
        
            if (that.tool.name == "Text")
            {            
                $('.letterPrefix').removeClass('active-letter-prefix');
                thisthat.letterPrefix =  "";
                var selectedValue = $("#textoptionselect").val();       
                if(selectedValue == ""){
                    that.tool.dropdownText = false;
                }else{
                    that.tool.dropdownText = true;        
                }  
                that.tool.setText(selectedValue);
            }
        });

        $('#lettersoptionselect').on('change', function() {
            thisthat.setCustomText();
        });

        $('.letterPrefix').on('click', function() {
            $('.letterPrefix').removeClass('active-letter-prefix');
            $(this).addClass('active-letter-prefix');
            thisthat.letterPrefix =  $(this).attr('data-value');
            thisthat.setCustomText();
        });

        $('#selectNextLetter').on('click', function() {
            var optionSelected = $("#lettersoptionselect > option:selected");
            optionSelected.removeAttr("selected");
            optionSelected.next("option").attr("selected","selected");       
            thisthat.setCustomText();
        });
    }

    setCustomText() {
        let that = this.lc; 
        let thisthat = this;
        if (that.tool.name == "Text")
        {            
            var selectedValue = $("#lettersoptionselect").val();       
            if(selectedValue == ""){
                that.tool.dropdownText = false;
            }else{
                that.tool.dropdownText = true;        
            }  
            selectedValue = thisthat.letterPrefix + selectedValue;
            that.tool.setText(selectedValue);
        }
    }

    upload_diagram(lc){
        let snapshot = JSON.stringify(lc.getSnapshot());
        this.draw_border(lc);
        let image = lc.getImage().toDataURL();
        let type = 'base64';
        this.uploadImage ={
            'snapshot': snapshot,
            'image':image,
            'type':type,
            'report':this.reportData
        };
            
        this.diagramService.uploadDiagram(this.uploadImage).subscribe(
            data => {
                Swal(
                    'Saved!',
                'Diagram has been saved.',
                    'success'
                )
            }
        );
    }
    doneReview(){
        this._router.navigate(['inspections-profile-review/',this.job_id]);
        // window.location.href = this.apiSite+'url/inspections_profile_review/'+this.job_id;
    }
    draw_border(lc){
        //console.log(shapes);
        var shapes = lc.shapes;
        var len = shapes.length; ;
        if (len < 2)
        {
            return;
        }
        var beforeRect;
        beforeRect = shapes[0].getBoundingRect();
    
        var xMin, xMax, yMin, yMax, width, height;
        xMin = xMax = beforeRect.x;
        yMin = yMax = beforeRect.y;
        for(var i = 0; i < len; i++){
            var rect = shapes[i].getBoundingRect();
            var x = rect.x;
            var	y = rect.y;       
            
            if(x < xMin){
             xMin = x;   
            }		
            if(x > xMax){
             xMax = x;   
            }    
            if(y < yMin){
             yMin = y;   
            }
            if(y > yMax){
             yMax = y;   
            }
            x = rect.x + rect.width;
            y = rect.y + rect.height;
            
            if(x < xMin){
             xMin = x;   
            }		
            if(x > xMax){
             xMax = x;   
            }    
            if(y < yMin){
             yMin = y;   
            }
            if(y > yMax){
             yMax = y;   
            }
        
        }
        width = xMax-xMin;
        height = yMax-yMin;
        //alert("here");
        //createShape('Rectangle', {x, y, width, height, strokeWidth, strokeColor, fillColor})
        if(xMin!=beforeRect.x || yMin!=beforeRect.y || width!=beforeRect.width || height!=beforeRect.height){
            xMin -= 5;
            yMin -= 5;
            width += 10;
            height += 10;
        }
        
        lc.saveShape(LC.createShape('Rectangle', {x:xMin, y:yMin, width:width, height:height, stokeWidth:1, strokeColor:"white", fillColor:"transparent"}));
    }
    saveDiagram(){
        if (this.lc.tool.name == "Text")
        {

            if (this.lc.tool.currentShapeState === 'selected' || this.lc.tool.currentShapeState === 'editing')
            {

                Swal({
                    title: 'Important information',
                    text: 'There is not committed text in the diagram. Are you sure you want to save this text into the diagram?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                })
                .then((result) => {
                    if (result.value) {
                        this.upload_diagram(this.lc);
                    }
                })
                
            }else{
               this.upload_diagram(this.lc);
            }
        }else{
            this.upload_diagram(this.lc);
        }
    }
    clearCacheAdm(){
        this.diagramService.clearCache(this.job_id).subscribe(
            data => {
                this.ngOnInit();
            }
        );
    }
}
