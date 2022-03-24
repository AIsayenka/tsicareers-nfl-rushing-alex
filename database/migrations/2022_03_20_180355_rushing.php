<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rushing_records', function (Blueprint $table) {
            $table->id();
            $table->string('player');
            $table->string('team');
            $table->string('position');
            $table->integer('att');
            $table->float('att_by_g');
            $table->integer('yds');
            $table->float('avg');
            $table->float('yds_by_g');
            $table->integer('td');
            $table->string('lng');
            $table->integer('first');
            $table->integer('first_prc');
            $table->integer('20_plus');
            $table->integer('40_plus');
            $table->integer('fum');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rushing_records');
    }
};
