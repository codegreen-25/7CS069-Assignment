<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void {
    Schema::create('case_studies', function (Blueprint $t) {
        $t->id();
        $t->string('title');
        $t->text('description')->nullable();
        $t->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
        $t->timestamps();
    });

    Schema::create('quizzes', function (Blueprint $t) {
        $t->id();
        $t->foreignId('case_study_id')->constrained()->cascadeOnDelete();
        $t->string('title');
        $t->text('instructions')->nullable();
        $t->timestamps();
    });

    Schema::create('questions', function (Blueprint $t) {
        $t->id();
        $t->foreignId('quiz_id')->constrained()->cascadeOnDelete();
        $t->integer('order_index');
        $t->text('stem');
        $t->text('explanation')->nullable(); // shown after submit
        $t->timestamps();
    });

    Schema::create('answers', function (Blueprint $t) {
        $t->id();
        $t->foreignId('question_id')->constrained()->cascadeOnDelete();
        $t->text('text');
        $t->boolean('is_correct')->default(false);
        $t->timestamps();
    });

    Schema::create('attempts', function (Blueprint $t) {
        $t->id();
        $t->foreignId('user_id')->constrained()->cascadeOnDelete();
        $t->foreignId('quiz_id')->constrained()->cascadeOnDelete();
        $t->timestamp('started_at')->useCurrent();
        $t->timestamp('submitted_at')->nullable();
        $t->integer('score')->nullable();
        $t->integer('total')->nullable();
        $t->decimal('percentage',5,2)->nullable();
        $t->timestamps();
    });

    Schema::create('attempt_items', function (Blueprint $t) {
        $t->id();
        $t->foreignId('attempt_id')->constrained()->cascadeOnDelete();
        $t->foreignId('question_id')->constrained()->cascadeOnDelete();
        $t->foreignId('chosen_answer_id')->nullable()->constrained('answers')->nullOnDelete();
        $t->boolean('is_correct')->nullable();
        $t->timestamps();
        $t->unique(['attempt_id','question_id']);
    });

    Schema::create('flags', function (Blueprint $t) {
        $t->id();
        $t->foreignId('user_id')->constrained()->cascadeOnDelete();
        $t->foreignId('question_id')->constrained()->cascadeOnDelete();
        $t->timestamps();
        $t->unique(['user_id','question_id']);
    });
}


    /**
     * Reverse the migrations.
     */
public function down(): void {
    Schema::dropIfExists('flags');
    Schema::dropIfExists('attempt_items');
    Schema::dropIfExists('attempts');
    Schema::dropIfExists('answers');
    Schema::dropIfExists('questions');
    Schema::dropIfExists('quizzes');
    Schema::dropIfExists('case_studies');
}
};
