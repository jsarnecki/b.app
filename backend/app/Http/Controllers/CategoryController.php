<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    protected $userID = 1;

    public function index(Request $request): JsonResponse
    {
        $categories = Category::where('user_id', $this->userID)
            /* $categories = Category::where('user_id', $request->user()->id) */
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        try {
            DB::beginTransaction();
            $category = Category::create([
                'user_id' => $this->userID,
                /* 'user_id' => $request->user()->id, */
                'name'    => $validated['name'],
            ]);
            DB::commit();
        } catch (Exception $error) {
            DB::rollBack();
            Log::error('Failed to create category: ' . $error->getMessage());
            return response()->json(['message' => 'Failed to save category'], 500);
        }

        return response()->json($category, 201);
    }

    public function destroy(Request $request, Category $category): JsonResponse
    {
        if ($category->user_id !== $this->userID) {
            /* if ($category->user_id !== $request->user()->id) { */
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $category->delete();

        return response()->json(['message' => 'Deleted'], 200);
    }
}
