<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script src="https://ajax.googleapis.com/ajax/libs/d3js/5.7.0/d3.min.js"></script>
	<script type="text/javascript">
		function printTrigger() {
			if (navigator.userAgent.indexOf("Firefox") != -1) {
			
				window.location.href = "{{$url}}";
			
			} else {
				
			    var getMyFrame = document.getElementById('iframe');
			    getMyFrame.focus();
			    getMyFrame.contentWindow.print();
			}

		}
	</script>
</head>
<body>
	Please wait
	<iframe src="{{$url}}" onload="printTrigger()" id="iframe" style="display: none;"></iframe>
</body>
</html>