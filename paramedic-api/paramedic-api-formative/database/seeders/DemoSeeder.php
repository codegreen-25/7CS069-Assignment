<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {

            // ---- Helper to add a quiz with questions & answers ----
            $addQuiz = function (array $caseStudy, string $quizTitle, string $instructions, array $questions) {
                $quizId = DB::table('quizzes')->insertGetId([
                    'case_study_id' => $caseStudy['id'],
                    'title'         => $quizTitle,
                    'instructions'  => $instructions,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]);

                foreach ($questions as $i => $q) {
                    // $q = ['stem' => '...', 'explanation' => '...', 'answers' => [
                    //   ['text' => 'A', 'correct' => false], ... exactly one correct=true
                    // ]]

                    $questionId = DB::table('questions')->insertGetId([
                        'quiz_id'     => $quizId,
                        'order_index' => $i, // 0-based index
                        'stem'        => $q['stem'],
                        'explanation' => $q['explanation'] ?? null,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);

                    foreach ($q['answers'] as $ans) {
                        DB::table('answers')->insert([
                            'question_id' => $questionId,
                            'text'        => $ans['text'],
                            'is_correct'  => (bool)($ans['correct'] ?? false),
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ]);
                    }
                }
            };

            // ---- Case Study 1 ----
            $cs1Id = DB::table('case_studies')->insertGetId([
                'title'       => 'Adult Medical Emergencies',
                'description' => 'General adult prehospital scenarios.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
            $cs1 = ['id' => $cs1Id];

            $addQuiz($cs1, 'Case Study 1: Asthma & Hypoglycaemia', 'Answer each question. One correct option.', [
                [
                    'stem' => '28-year-old with audible wheeze, RR 28, SpO₂ 90% on air. Most appropriate initial drug/route?',
                    'explanation' => 'Nebulised beta-agonist is first-line for bronchospasm in asthma.',
                    'answers' => [
                        ['text' => 'Salbutamol via nebuliser', 'correct' => true],
                        ['text' => 'Adrenaline 1:1000 IM',     'correct' => false],
                        ['text' => 'IV Morphine',              'correct' => false],
                        ['text' => 'Glucagon IM',              'correct' => false],
                    ],
                ],
                [
                    'stem' => 'Adult with BGL 2.6 mmol/L, drowsy but protecting airway. Best initial treatment?',
                    'explanation' => 'If IV access is available, IV dextrose is fastest; otherwise consider IM glucagon.',
                    'answers' => [
                        ['text' => 'IV Dextrose',              'correct' => true],
                        ['text' => 'Oral glucose gel only',    'correct' => false],
                        ['text' => 'Nebulised saline',         'correct' => false],
                        ['text' => 'IV Furosemide',            'correct' => false],
                    ],
                ],
                [
                    'stem' => 'Asthma exacerbation not responding to initial salbutamol. Helpful adjunct?',
                    'explanation' => 'Ipratropium bromide may be added in moderate-severe exacerbations.',
                    'answers' => [
                        ['text' => 'Ipratropium via nebuliser','correct' => true],
                        ['text' => 'Oral aspirin',             'correct' => false],
                        ['text' => 'IV ketamine for pain',     'correct' => false],
                        ['text' => 'Adrenaline 1:10,000 IV',   'correct' => false],
                    ],
                ],
                // 👉 Duplicate this pattern until you have ~10 questions
            ]);

            // ---- Case Study 2 ----
            $cs2Id = DB::table('case_studies')->insertGetId([
                'title'       => 'Paediatric Scenarios',
                'description' => 'Paediatric hypoglycaemia, respiratory distress, fever.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
            $cs2 = ['id' => $cs2Id];

            $addQuiz($cs2, 'Case Study 2: Paediatrics Mixed', 'Single best answer for each question.', [
                [
                    'stem' => '4-year-old, BGL 2.4 mmol/L, drowsy, protecting airway. Most appropriate initial intervention?',
                    'explanation' => 'If IV/IO access is possible, D10 IV/IO is recommended; otherwise IM glucagon.',
                    'answers' => [
                        ['text' => 'Dextrose 10% IV/IO',       'correct' => true],
                        ['text' => 'Oral glucose gel only',    'correct' => false],
                        ['text' => 'IV furosemide',            'correct' => false],
                        ['text' => 'IM adrenaline 1:1000',     'correct' => false],
                    ],
                ],
                [
                    'stem' => 'Febrile child with tachypnoea and retractions; first priority?',
                    'explanation' => 'Assess and support airway/breathing; supplemental oxygen as indicated.',
                    'answers' => [
                        ['text' => 'Airway and oxygen as needed','correct' => true],
                        ['text' => 'Immediate IV antibiotics',    'correct' => false],
                        ['text' => 'High-flow IV fluids first',   'correct' => false],
                        ['text' => 'Nebulised adrenaline',        'correct' => false],
                    ],
                ],
                [
                    'stem' => 'Child with stridor at rest and suspected croup; prehospital drug?',
                    'explanation' => 'Nebulised adrenaline is indicated in moderate-severe croup.',
                    'answers' => [
                        ['text' => 'Nebulised adrenaline',      'correct' => true],
                        ['text' => 'IV morphine',               'correct' => false],
                        ['text' => 'Oral aspirin',              'correct' => false],
                        ['text' => 'IV salbutamol',             'correct' => false],
                    ],
                ],
                // 👉 Duplicate until you reach ~10 questions
            ]);
        });
    }
}

