<?php

namespace App\Http\Middleware;

use Closure;
use DB;
use Request;

class WidgetParams
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $widgetId = $request->input('widget_id');
        $widgetData = \App\Models\Widget::with('widget_sources.data_source')->where('id', $widgetId)->first();
        if($widgetData->is_today == 0) {
            $nonFormattedStartDate = $widgetData->from_date;
            $nonFormattedEndDate = $widgetData->to_date; 
        } else {
            $nonFormattedStartDate = date('Y-m-d h:i:s');
            $nonFormattedEndDate = date('Y-m-d h:i:s'); 
        }

        $fromDate = explode(' ',$nonFormattedStartDate);
        $toDate = explode(' ',$nonFormattedEndDate);
        $formattedStartDate = $fromDate[0].' 00:00:00';
        $formattedEndDate = $toDate[0].' 23:59:59';

        $dataSources = [];
        if($widgetData->widget_sources){
            foreach ($widgetData->widget_sources as $widgetSource) {
                if($widgetSource->data_source){
                    $dataSources[] = $widgetSource->data_source->slug;
                }
            }
        }
        
        Request::merge([
            'startDate' => $formattedStartDate, 
            'endDate' => $formattedEndDate,
            'branch' => $widgetData->branch_id, 
            'agent' => $widgetData->agent_id,
            'goal' => $widgetData->goal,
            'dataType' => $widgetData->data_type,
            'title' => $widgetData->title,
            'dataSources' => $dataSources
        ]);

        return $next($request);
    }
}
