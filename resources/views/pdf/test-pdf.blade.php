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
</style>
<div class="pdf-cont">
<table cellspacing="0" cellpadding="0" border="0" style="width:100%;font-family:helvetica;">
    <tr>
        <td width="50%" align="center">
            <span style="font-size: 24px;">{{$date}}<br>{{$time}}</span>
            <br><br>
            <span style="font-weight:bold;">
                {{ $property_address1 }}
                @if($property_address2 != '')
                   {{','.$property_address2}} <br>
                @else
                   <br>
                @endif
                {{ $property_city . ', ' . $property_state . ' ' . $property_zip }}
            </span>
        </td>		
		<td width="50%" align="center">
            <img src="{{$_SERVER['DOCUMENT_ROOT'].'/images/logo_job_card.png'}}" /><br>Crew
        </td>
    </tr>
</table>
<br><br>
<table cellspacing="0" cellpadding="6" border="2" style="width:50%;" >
    <tr>
        <td style="background-color: #000; color: #fff;">CREW</td>
    </tr>
    <tr>
        <td style="background-color: none; color: #000;">Lead: </td>
    </tr>
    <tr>
        <td style="background-color: none; color: #000;">Phone: </td>
    </tr>
</table>
<table cellspacing="0" cellpadding="6" border="2" style="width:100%;" >
    <tr>
        <td style="background-color: #000; color: #fff;">JOB INFO</td>
    </tr>
    <tr>
        <td colspan="2" style="background-color: none; color: #000;">Scheduled by: </td>
    </tr>
    <tr>
        <td width="50%" style="background-color: none; color: #000;">Total: </td>
        <td width="50%" style="background-color: none; color: #000;">Inspector: </td>
    </tr>
</table>
</div>

