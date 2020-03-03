<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChampsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('champs', function (Blueprint $table) {
          
          $table->engine = 'InnoDB';
          $table->charset = 'utf8';
          $table->collation = 'utf8_unicode_ci';
          
          $table->bigIncrements('id');
          $table->string('nombre', 100)->unique();
          $table->string('desc')->unique();
          $table->enum('rol',['Luchador','Asesino','Magos','Tirador','Apoyo','Tanque']);
          $table->enum('linea',['Top','Mid','Bot','Support','Jungle']);
          $table->enum('dificultad',['Fácil','Moderada','Avanzada']);
          $table->string('imagen',400);
          
          $table->timestamps();
          $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('champs');
    }
}
