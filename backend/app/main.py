
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI(title="DrBleou Hybrid Pro", version="1.0.0")

FRONT_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if FRONT_DIST.exists():
    app.mount("/assets", StaticFiles(directory=FRONT_DIST / "assets"), name="assets")

@app.get("/api/ping")
async def ping():
    return {"status": "ok", "app": "Hybrid Pro", "version": "1.0.0"}

@app.get("/api/defaults")
async def defaults():
    return {
        "universe": ["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","XRPUSDT","ADAUSDT","DOGEUSDT","AVAXUSDT","LINKUSDT","MATICUSDT","APTUSDT","ATOMUSDT","NEARUSDT","OPUSDT","ARBUSDT","ETCUSDT","LTCUSDT","SUIUSDT","TONUSDT","BCHUSDT"],
        "indicators": {"ema_fast":50,"ema_slow":100,"rsi":14,"macd":[12,26,9],"bb":[20,2.0]}
    }

@app.get("/{full_path:path}", response_class=HTMLResponse)
async def spa(full_path: str, request: Request):
    index_file = FRONT_DIST / "index.html"
    if index_file.exists():
        return HTMLResponse(index_file.read_text(encoding="utf-8"))
    return HTMLResponse("<h1>Hybrid Pro API</h1><p>Build frontend non trouvé.</p>")
