from fastapi import FastAPI, UploadFile
import shutil

app = FastAPI()

@app.post("/check")
async def check_audio(file: UploadFile):
    # Here you'd implement real fingerprint matching logic
    with open(f"/tmp/{file.filename}", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"status": "ok", "copyrighted": False, "filename": file.filename}
