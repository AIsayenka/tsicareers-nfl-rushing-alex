<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Rushing;
use Illuminate\Support\Facades\Storage;

class RushingRecordsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $filepath = "data/rushing.json";
        if(Storage::exists($filepath)) {
            $jsonData = json_decode(Storage::get($filepath), true);
            //dd($jsonData);
            foreach($jsonData as $jsonRecord) {
                $tempRecord = new Rushing();
                $tempRecord->player = $jsonRecord["Player"];
                $tempRecord->team = $jsonRecord["Team"];
                $tempRecord->position = $jsonRecord["Pos"];
                $tempRecord->att = $jsonRecord["Att"];
                $tempRecord->att_by_g = $jsonRecord["Att/G"];
                $tempRecord->yds = intval($jsonRecord["Yds"]);
                $tempRecord->avg = $jsonRecord["Avg"];
                $tempRecord->yds_by_g = $jsonRecord["Yds/G"];
                $tempRecord->td = $jsonRecord["TD"];
                $tempRecord->lng = $jsonRecord["Lng"];
                $tempRecord->first = $jsonRecord["1st"];
                $tempRecord->first_prc = $jsonRecord["1st%"];
                $tempRecord["20_plus"] = $jsonRecord["20+"];
                $tempRecord["40_plus"] = $jsonRecord["40+"];
                $tempRecord->fum = $jsonRecord["FUM"];
                
                $tempRecord->save();
            }
        }

        return;
    }
}
