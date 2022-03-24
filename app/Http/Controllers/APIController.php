<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Rushing;

class APIController extends Controller
{
    protected $dataFolder = "data";
    protected $filePrefix = "rushing";
    protected $fileExt = ".json";

    protected $defaultPageSize = 20;

    protected $acceptableRushingColumns = [
            "player",
            "team",
            "position",
            "att",
            "att_by_g",
            "yds",
            "avg",
            "yds_by_g",
            "td",
            "lng",
            "first",
            "first_prc",
            "20_plus",
            "40_plus",
            "fum",
    ];

    protected $acceptableOrder = [
        "asc", "desc",
    ];

    public function downloadData(Request $request) {
        //dd($request);
        // prepping values
        $processingType = ($request->has("processing") ? $request->input("processing") : null);
        $byColumn = ($request->has("byColumn") ? $request->input("byColumn") : null);
        $order = ($request->has("order") ? $request->input("order") : null);
        $byValue = ($request->has("byValue") ? $request->input("byValue") : null);

        if($byColumn != null && !in_array($byColumn, $this->acceptableRushingColumns)) {
            return response()->json([
                "message" => "Not Allowed Column"
            ], 403);
        }

        if($order != null && !in_array($order, $this->acceptableOrder)) {
            return response()->json([
                "message" => "Not Allowed Order"
            ], 403);
        }

        //dd($request->has("processing"));

        // check if any order or filtering needs to be done
        if($processingType != null) {
            switch($processingType) {
                case "filter":
                    //dd("filter by '{$byColumn}' value '{$byValue}'");
                    $dataset = Rushing::where($byColumn, 'like', '%'.$byValue.'%')->get();
                    break;

                case "sort":
                default:
                    //dd("sort by '{$byColumn}' order '{$order}'");
                    $dataset = Rushing::orderBy($byColumn, $order)->get();
                    break;
            }
        } else { // if not, just return the records
            $dataset = Rushing::all();
        }
        

        $headers = [
            'Cache-Control'       => 'post-check=0, pre-check=0'
        ,   'Content-type'        => 'text/csv'
        ,   'Content-Disposition' => 'attachment; filename=data.csv'
        ];

        $arrayOfRecord = $dataset->toArray();

        # add headers for each column in the CSV download
        array_unshift($arrayOfRecord, array_keys($arrayOfRecord[0]));

        $callback = function() use ($arrayOfRecord) 
        {
            $csvFile = fopen('php://output', 'w');
            foreach ($arrayOfRecord as $row) { 
                fputcsv($csvFile, $row);
            }
            fclose($csvFile);
        };

        return response()->stream($callback, 200, $headers);
        
    }

    public function getData(Request $request, $page = 1) {
        $pageSize = ($request->has("pageSize") ? $request->input("pageSize") : $this->defaultPageSize);
        
        $totalPages = intdiv(Rushing::all()->count(), $pageSize);

        $records = Rushing::skip(($page-1) * $pageSize)->take($pageSize)->get();

        return response()->json(array(
            "data" => $records,
            "totalPages" => $totalPages
        ));
    }

    public function sortData(Request $request, $byColumn, $order = "asc", $page = 1) {
        if(!in_array($byColumn, $this->acceptableRushingColumns)) {
            return response()->json([
                "message" => "Not Allowed Column"
            ], 403);
        }

        if(!in_array($order, $this->acceptableOrder)) {
            return response()->json([
                "message" => "Not Allowed Order"
            ], 403);
        }


        $pageSize = ($request->has("pageSize") ? $request->input("pageSize") : $this->defaultPageSize);


        // getting the columns in order
        $records = Rushing::orderBy($byColumn, $order)->skip(($page-1) * $pageSize)->take($pageSize)->get();
        $totalPages = intdiv(Rushing::all()->count(), $pageSize);

        return response()->json(array(
            "data" => $records,
            "totalPages" => $totalPages
        ));
    }

    public function searchByName(Request $request, $nameInput, $page = 1) {

        $pageSize = ($request->has("pageSize") ? $request->input("pageSize") : $this->defaultPageSize);
        //dd($nameInput);

        // getting the record where player's name is similar to the input
        $records = Rushing::where('player', 'like', '%'.$nameInput.'%')->skip(($page-1) * $pageSize)->take($pageSize)->get();

        $totalPages = intdiv(Rushing::where('player', 'like', '%'.$nameInput.'%')->count(), $pageSize);

        return response()->json(array(
            "data" => $records,
            "totalPages" => $totalPages
        ));
    }
        

}
