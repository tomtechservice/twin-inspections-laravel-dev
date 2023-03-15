<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>{{$settings->setting_company_name}} - {{$settings->setting_website_name}}</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="{{ URL::asset('assets/bootstrap/css/bootstrap.min.css') }}">
        <link rel="stylesheet" href="{{ URL::asset('assets/font-awesome/css/font-awesome.min.css') }}">
        <link rel="stylesheet" href="{{ URL::asset('css/flaty.css') }}">
        <link rel="stylesheet" href="{{ URL::asset('css/flaty-responsive.css') }}">
        
    </head>
    <body class="login-page" style="background: #373737 url({{asset('images/bg_squares_bottom.png')}}) repeat-x center bottom;">




    <!-- BEGIN Main Content -->
    <div class="login-wrapper" style="">
        
        <!-- BEGIN Login Form -->
        <form name="form_login" id="form_login" action="{{route('login')}}" method="post">
            @csrf
        <img src="{{env('DO_SPACE')."media/logo/0/".$settings->settings_logo_login_image}}" class="img-responsive" />
            <br />
            <br />
            <br />
            <p id="errmes" style="color:#900; font-size:12px;"></p> 
            <hr/>
            <h3 class="login_title">Login: the ISM Web Portal</h3>
            <hr/>
            <div class="form-group">
                <div class="controls">
                    <input type="text" name="username" id="username" placeholder="Username" class="form-control" required  value="{{ old('username') }}" />
                </div>
            </div>
            <div class="form-group">
                <div class="controls">
                    <input type="password" name="password" id="password" placeholder="Password" class="form-control" required />
                </div>
            </div>
            <div class="form-group">
                <div class="controls">
                    <label class="checkbox">
                        <input name="remember" type="checkbox" value="1" /> Remember me
                    </label>
                </div>
            </div>
            @if ($message = Session::get('error'))
            <p class="text-danger"><b>{{ $message }}</b></p>
            @endif
            <div class="form-group">
                <div class="controls">
                    <button type="submit" class="btn btn-primary form-control">Sign In</button>
                </div>
            </div>
            <hr/>
            <p class="clearfix">
                <a href="/password_recovery" class="goto-forgot pull-left">Forgot Password?</a>
            </p>
        </form>
        <!-- END Login Form -->
        <br />
        <br />
        <br />
        <br />
        <br />
        <div style="color: #999; text-align:center; padding: 20px;">&copy;{{date('Y')}} {{$settings->setting_company_name}}.  All Rights Reserved.</div>
    </div>
    <!-- END Main Content -->


</body>
</html>
