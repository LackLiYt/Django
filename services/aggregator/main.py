from fastapi import FastAPI

app = FastAPI()

@app.get("/search")
async def search_tracks(query: str):
    # Later: implement Jamendo/FMA API queries
    return {
        "query": query,
        "results": [
            {"title": "Free Track 1", "url": "http://example.com/track1"},
            {"title": "Free Track 2", "url": "http://example.com/track2"}
        ]
    }
