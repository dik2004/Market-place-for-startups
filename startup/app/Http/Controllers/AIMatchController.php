<?php
namespace App\Http\Controllers;

use App\Models\Startup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIMatchController extends Controller
{
    public function match(Request $request)
    {
        $request->validate([
            'domain'      => 'required|string',
            'stage'       => 'required|string',
            'ticket_size' => 'required|string',
            'interests'   => 'required|string',
        ]);

        $startups = Startup::latest()->take(20)->get()
            ->map(fn($s) => [
                'id'          => (string)$s->_id,
                'name'        => $s->name,
                'domain'      => $s->domain,
                'stage'       => $s->stage,
                'funding_ask' => $s->funding_ask,
                'tagline'     => $s->tagline,
                'tags'        => $s->tags,
            ]);

        $prompt = "You are an expert startup investment advisor.
An investor has this profile:
- Preferred domain: {$request->domain}
- Stage preference: {$request->stage}
- Ticket size (INR lakhs): {$request->ticket_size}
- Interests / notes: {$request->interests}

Here are available startups:
" . json_encode($startups, JSON_PRETTY_PRINT) . "

Recommend the TOP 3 most suitable startups for this investor.
For each, return:
1. Startup ID and name
2. A 2-sentence reason why it's a good fit
3. A match score out of 10

Format as JSON array like:
[{\"id\":\"...\",\"name\":\"...\",\"reason\":\"...\",\"score\":9}]";

        $response = Http::withHeaders([
            'x-api-key'         => config('services.anthropic.key'),
            'anthropic-version' => '2023-06-01',
            'Content-Type'      => 'application/json',
        ])->post('https://api.anthropic.com/v1/messages', [
            'model'      => 'claude-sonnet-4-20250514',
            'max_tokens' => 1000,
            'messages'   => [
                ['role' => 'user', 'content' => $prompt]
            ],
        ]);

        $text    = $response->json('content.0.text');
        $clean   = preg_replace('/```json|```/', '', $text);
        $matches = json_decode(trim($clean), true);

        return response()->json([
            'matches'  => $matches,
            'raw_text' => $text,
        ]);
    }
}