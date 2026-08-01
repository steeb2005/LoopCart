from websocket_manager import manager
from fastapi import APIRouter,WebSocket, WebSocketDisconnect

router = APIRouter()

@router.websocket("/ws/chat/{conversation_id}")
async def chat_websocket(conversation_id: str, websocket: WebSocket):
    await manager.connect(conversation_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(conversation_id, websocket)


@router.websocket("/ws/inbox/{user_id}")
async def inbox_websocket(user_id: str, websocket: WebSocket):

    await websocket.accept()
    if user_id not in manager.active_connections:
        manager.active_connections[user_id] = []
    manager.active_connections[user_id].append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print("Disconnected inbox websocket")
        manager.disconnect(user_id, websocket)