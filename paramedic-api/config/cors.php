<?php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_headers' => ['*'],   // <- allow Authorization, Content-Type, etc
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];

