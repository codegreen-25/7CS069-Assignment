<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add columns only if they don't already exist
        Schema::table('quizzes', function (Blueprint $table) {
            if (!Schema::hasColumn('quizzes', 'title')) {
                $table->string('title')->nullable()->after('case_study_id');
            }
            if (!Schema::hasColumn('quizzes', 'instructions')) {
                $table->text('instructions')->nullable()->after('title');
            }
        });
    }

    public function down(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            if (Schema::hasColumn('quizzes', 'instructions')) {
                $table->dropColumn('instructions');
            }
            if (Schema::hasColumn('quizzes', 'title')) {
                $table->dropColumn('title');
            }
        });
    }
};
