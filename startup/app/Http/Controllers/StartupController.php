<?php
namespace App\Http\Controllers;

use App\Models\Startup;
use Illuminate\Http\Request;

class StartupController extends Controller
{
    public function index(Request $request)
    {
        $query = Startup::query();

        if ($request->domain)      $query->where('domain', $request->domain);
        if ($request->stage)       $query->where('stage',  $request->stage);
        if ($request->search)      $query->where('name', 'like', '%'.$request->search.'%');
        if ($request->min_funding) $query->where('funding_ask', '>=', (int)$request->min_funding);
        if ($request->max_funding) $query->where('funding_ask', '<=', (int)$request->max_funding);

        return response()->json($query->latest()->paginate(10));
    }

    public function show($id)
    {
        $startup = Startup::findOrFail($id);
        $startup->increment('views');
        return response()->json($startup);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string',
            'tagline'     => 'required|string|max:120',
            'domain'      => 'required|string',
            'stage'       => 'required|in:idea,mvp,growth',
            'funding_ask' => 'required|numeric',
            'description' => 'required|string',
        ]);

        $startup = Startup::create([
            ...$request->only([
                'name','tagline','domain','stage',
                'funding_ask','team_size','description',
                'tags','dipp_registered','pitch_deck_url'
            ]),
            'founder_id'     => auth()->id(),
            'badge_verified' => false,
            'views'          => 0,
        ]);

        return response()->json($startup, 201);
    }

    public function update(Request $request, $id)
    {
        $startup = Startup::findOrFail($id);

        if ($startup->founder_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $startup->update($request->all());
        return response()->json($startup);
    }

    public function destroy($id)
    {
        $startup = Startup::findOrFail($id);

        if ($startup->founder_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $startup->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function mine()
    {
        return response()->json(
            Startup::where('founder_id', auth()->id())->get()
        );
    }
}