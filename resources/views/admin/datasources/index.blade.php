@extends('admin.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">DataSources</div>

                <div class="panel-body">
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <tr>
                                <td>ID</td><td>API Url</td><td>Name</td><td>Slug</td><td>Action</td>
                            </tr>
                            @foreach($sources as $datasource)
                                <td>{{$datasource->id}}</td>
                                <td>{{$datasource->api_url}}</td>
                                <td>{{$datasource->name}}</td>
                                <td>{{$datasource->slug}}</td>
                                <td><a class="btn btn-info btn-xs" href="{{URL::to('admin/datasources/add?id='.$datasource->id)}}">EDIT</a></td>
                            @endforeach
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection