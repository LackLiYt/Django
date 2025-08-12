from fastapi import FastAPI

app = FastAPI()

@app.get("/recommend")
async def recommend(track_id: str):
    # Later: Implement vector DB search (Qdrant)
    return {
        "track_id": track_id,
        "similar": [
            {"title": "Similar Track A", "url": "http://example.com/a"},
            {"title": "Similar Track B", "url": "http://example.com/b"}
        ]
    }
