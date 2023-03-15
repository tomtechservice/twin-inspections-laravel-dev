<style>
 @font-face {
    font-family: 'helvetica';
    font-weight: normal;
    font-style: normal; 
    font-variant: normal;
    font-size: 10mm; 
    /* src: url("http://eclecticgeek.com/dompdf/fonts/Elegance.ttf") format("truetype"); */
  }
 
.page-breaks {
    page-break-after: always;
}
.pdf-cont {
    margin: 3px;
    border: solid 1px #000;
    
} 
.tbl1 {
    /* background-color: red; */
    /* width:100%; */
}
.date_time_span {
    font-size: 24px;    
}
.prop_address_span {
    font-weight: bold;
    font-size:20px;
}
.crew_tbl {
    width:50%;
    font-family: sans-serif;    
}
.tbl_blocks {
   width:100%;
   font-family: sans-serif;
}

</style>
<div class="pdf-cont">
<table cellspacing="0" cellpadding="0" border="0" style="width:100%;font-family:helvetica;">
    <tr>
        <td width="50%" align="center">
            <span class="date_time_span">{{$pdfData['date']}}<br>{{$pdfData['time']}}</span>
            <br><br>
            @if($pdfData['property_address1'])
            <span class="prop_address_span">
            {{ $pdfData['property_address1'] }}
                @if($pdfData['property_address2'] != '')
                   {{','.$pdfData['property_address2']}} <br>
                @else
                   <br>
                @endif
                {{ $pdfData['property_city'] . ', ' . $pdfData['property_state'] . ' ' . $pdfData['property_zip'] }}
            </span>
            @endif
        </td>		
		<td width="50%" align="center">
            <!-- <img src="{{$_SERVER['DOCUMENT_ROOT'].'/images/logo_job_card.png'}}" /><br>Crew -->
            <img src="{{URL::asset('/images/logo_job_card.png')}}" /><br><br><strong>Crew</strong>
        </td>
    </tr>
</table>
<br><br>
<!--  /////////////// CREW ///////////////////  -->
<table cellspacing="0" cellpadding="6" border="2" class="crew_tbl">
    <tr>
        <td style="background-color: #000; color: #fff;font-size:24px;">CREW</td>
    </tr>
    <tr>
        <td style="background-color: none; color: #000;font-size:20px;">Lead: {{$pdfData['crew_names']}}</td>
    </tr>
    <tr>
        <td style="background-color: none; color: #000;font-size:20px;">Phone: {{$pdfData['job_perform_lead_phone']}}</td>
    </tr>
</table>
<br><br>
<!--  /////////////// JOB INFO ///////////////////  -->
<table cellspacing="0" cellpadding="6" border="2" class="tbl_blocks">
    <tr>
        <td colspan="2" style="background-color: #000; color: #fff;font-size: 24px;">JOB INFO</td>
    </tr>
    <tr>
        <td colspan="2" style="background-color: none; color: #000;font-size: 20px;">Scheduled by: {{$pdfData['job_scheduled_by']}}</td>
    </tr>
    <tr>
        <td width="50%" style="background-color: none; color: #000;font-size: 20px;">Total: ${{$pdfData['findings_total']}}</td>
        <td width="50%" style="background-color: none; color: #000;font-size: 20px;">Inspector: {{$pdfData['inspector']}}</td>
    </tr>
</table>
<br><br>
<!--  /////////////// NOTES ///////////////////  -->
<table cellspacing="0" cellpadding="6" border="2" class="tbl_blocks">
    <tr><td style="background-color: #000; color: #fff;font-size:24px;">NOTES</td></tr>
    <tr><td style="background-color: none; color: #000;font-size: 20px;">{{$pdfData['job_card_notes']}}</td></tr>
</table>
<br><br>
<!--  /////////////// PAYMENT / AUTHORIZATION ///////////////////  -->
<table cellspacing="0" cellpadding="6" border="2" class="tbl_blocks">
    <tr><td colspan="2" style="background-color: #000; color: #fff;font-size:24px;">PAYMENT / AUTHORIZATION</td></tr>
    <tr><td width="50%" style="background-color: none; color: #000;font-size: 17px;"><span style="font-size: 14px;">Pickup Check:</span>{{" ".$pdfData['job_billing_pu_check']}}</td>
    <td width="50%" style="background-color: none; color: #000;"><span style="font-size: 9px;">Lead Signature</span></td></tr>
    <tr><td style="background-color: none; color: #000;"><span style="font-size: 14px;">Work Authorization Needs Signature:</span>{{" ".$pdfData['job_perform_authorization_status']}}</td>
    <td style="background-color: none; color: #000;"><span style="font-size: 9px;">Lead Signature</span></td></tr>
</table>
<br><br>
<!--  /////////////// ACCESS ///////////////////  -->
<table cellspacing="0" cellpadding="6" border="2" class="tbl_blocks">
    <tr><td style="background-color: #000; color: #fff;font-size:24px;">ACCESS</td></tr>
    <tr><td style="background-color: none; color: #000;font-size: 20px;">Name: {{$pdfData['job_perform_meet_who']}}<br />Phone: <span style="font-size: 11px;"></span> <br />Email: </td></tr>
</table>
<br><br>
<!--  /////////////// ACCESS ///////////////////  -->
<table cellspacing="0" cellpadding="6" border="2" class="tbl_blocks">
    <tr><td style="background-color: #000; color: #fff;font-size:24px;">ITEMS TO PERFORM</td></tr>
    <tr><td style="background-color: none; color: #000;font-size: 20px">{{" ".$pdfData['findings_items']." "}}</td></tr>
</table>
<br><br>
<!--  /////////////// Diagram ///////////////////  -->
<table cellspacing="0" cellpadding="6" border="2" class="tbl_blocks">
    <tr><td style="background-color: #000; color: #fff;font-size:24px;">DIAGRAM</td></tr>
    <!-- $diagram_img = '<img src="'.DO_SPACE.'media/diagrams/' . $job['job_id'] . '/' . $img . '" height="280" border="1" />'; -->
    <tr><td style="background-color: none; color: #000;">{{$pdfData['diagram_img']}}</td></tr>
</table>
</div>