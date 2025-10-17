<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        $user = $request->user();
        $user->name = $data['name'];
        $user->save();

        return response()->json([
            'message' => 'Profile updated',
            'user'    => $user,
        ]);
    }
}
