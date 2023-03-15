<!DOCTYPE html>
<html>
    <head>
        <title>Loading, Please wait</title>
        <script type="text/javascript" src="{{ asset('js/jquery.js') }}"></script>
        <meta name="csrf-token" content="{{ csrf_token() }}">
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-12 text-center">
                    Loading, Please wait
                    <script type="text/javascript">
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $(document).ready(function() { 
                        $.ajax({
                            method: "POST",
                            url: "{{URL::to('/login/auth-token')}}",
                          }).done(function( msg ) {
                            if(msg.status == 1){
                                localStorage.app_token=msg.token;
                                localStorage.user = JSON.stringify(msg.user);
                                window.location.href = "{{URL::to('/app/')}}"
                            }
                        });
                    });
                    </script>
                </div>
            </div>
        </div>
    </body>
</html>
