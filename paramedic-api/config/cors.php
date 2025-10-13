<?php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://summative.codegreenquiz.com',
        'https://formative.codegreenquiz.com'],
    'allowed_headers' => ['*'],  
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];

