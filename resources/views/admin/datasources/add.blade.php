@extends('admin.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Add/Edit DataSource</div>

                <div class="panel-body">
                    <form class="form-horizontal" method="post">
                    {!! csrf_field() !!}
                    <div class="form-group">
                        <label class="control-label col-md-2">Name</label>
                        <div class="col-md-10">
                            <input type="text" class="form-control" name="name" value="{{old('name',$source->name)}}">
                            @if($errors->has('name')) <span class="text-danger">{{$errors->first('name')}}</span> @endif
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-md-2">API Url</label>
                        <div class="col-md-10">
                            <input type="text" class="form-control" name="api_url" value="{{old('api_url',$source->api_url)}}">
                            @if($errors->has('api_url')) <span class="text-danger">{{$errors->first('api_url')}}</span> @endif
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-md-2">Slug</label>
                        <div class="col-md-10">
                            <input type="text" class="form-control" name="slug" value="{{old('slug',$source->slug)}}">
                            @if($errors->has('slug')) <span class="text-danger">{{$errors->first('slug')}}</span> @endif
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-md-2">Index</label>
                        <div class="col-md-10">
                            <select class="form-control" name="status">
                                @foreach($status as $type)
                                <option @if($source->status == $type) {{'selected="selected"'}} @endif value="{{$type}}">{{$type}}</option>
                                @endforeach
                            </select>
                            @if($errors->has('status')) <span class="text-danger">{{$errors->first('status')}}</span> @endif
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-md-2">&nbsp;</label>
                        <div class="col-md-4">
                          <button class="btn btn-primary">Save</button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection