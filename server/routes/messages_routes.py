from fastapi import Depends, HTTPException, APIRouter
from database import items, users, conversations
from bson import ObjectId
from auth import get_current_user
from models.models import MessageSend
from websocket_manager import manager
from datetime import datetime, timezone



router = APIRouter()

# Messages ----------------------------------------------------------------------------------

@router.get('/users/{user_id}/inbox')
async def get_inbox(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["sub"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    conversations_list = []

    async for conversation in conversations.find({"participants": user_id, "deleted_by": {"$ne": user_id}}):
        try:
            participants = conversation.get("participants", [])
            other_participant = [p for p in participants if p != user_id]
            
            if not other_participant:
                continue
            
            other_participant_id = other_participant[0]
            unread_count = 0    # Counter for unread messages (placeholder for now)
            for msg in conversation.get("messages", []):
                if msg["sender_id"] != user_id and not msg["read"]:
                    unread_count += 1

            messages = conversation.get("messages", [])
            last_message = messages[-1] if messages else None
            
            
            conversations_list.append({
                "_id": str(conversation["_id"]),
                "item_id": conversation["item_id"],
                "other_user": other_participant_id,
                "unread_count": unread_count,
                "last_message": last_message,
                "last_updated": conversation["last_updated"],
            
            })
        except Exception as e:
            print(f"Error processing conversation {conversation.get('_id')}: {e}")
            continue

    return conversations_list



@router.post('/messages/send')
async def send_message(message: MessageSend, current_user: dict = Depends(get_current_user)):
    item = await items.find_one({"_id": ObjectId(message.item_id)})

    if current_user["sub"] != message.sender_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.get("deleted", False):
        raise HTTPException(status_code=400, detail="Item has been deleted")
    
    if item["status"] == "sold":
        raise HTTPException(status_code=400, detail="Item has been sold")
    
    participants = sorted([message.sender_id, message.receiver_id])

    if message.sender_id == message.receiver_id:
        raise HTTPException(status_code=400, detail="Cannot send message to yourself")

    new_message = {
        "sender_id": message.sender_id,     
        "text": message.text,
        "read": False,
        "sent_at": datetime.now(tz=timezone.utc).isoformat()
    }

    # Find existing conversation between partiicipants
    conversation = await conversations.find_one({ 
        "participants": participants,
        "item_id": message.item_id
    })

    # If Found
    if conversation:


        other_participant = [p for p in conversation.get("participants", []) if p != current_user["sub"]][0]

        other_participant_exists = await users.find_one({"_id": ObjectId(other_participant)})
        if not other_participant_exists:
            raise HTTPException(status_code=404, detail="Other participant not found")

        deleted_by_users = conversation.get("deleted_by", [])
        if current_user["sub"] in deleted_by_users: 
            await restore_conversation(str(conversation["_id"]), current_user["sub"])

        await conversations.update_one(
            {"_id": conversation["_id"]},
            {
                "$push": {"messages": new_message},
                "$set": {"last_updated": datetime.now(tz=timezone.utc).isoformat()}
            }
        )

        conversation_id = str(conversation["_id"])
    else:
        new_conversation = { # this inserted into the db
            "participants": participants,
            "item_id": message.item_id,
            "messages" : [new_message],
            "last_updated": datetime.now(tz=timezone.utc).isoformat()
        }

        result = await conversations.insert_one(new_conversation)
        conversation_id = str(result.inserted_id)

    await manager.broadcast(conversation_id, {
        "type": "new_message",
        "message": new_message
    })

    await manager.broadcast(message.receiver_id, {
        "type": "new_message",
        "conversation_id": conversation_id
    })

    return {"conversation_id": conversation_id}


# Helper function to restore conversation 
async def restore_conversation(conversation_id: str, user_id: str):
    conversation = await conversations.find_one({"_id": ObjectId(conversation_id)})
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if user_id not in conversation["participants"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    await conversations.update_one({"_id": ObjectId(conversation_id)}, {"$pull": {"deleted_by": user_id}})
   

# Load messages of a conversation
@router.get('/conversation/{conversation_id}/messages')
async def load_messages(conversation_id: str, current_user: dict = Depends(get_current_user)):
    
    try:
        conversation = await conversations.find_one({"_id": ObjectId(conversation_id)})
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        if current_user["sub"] not in conversation["participants"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        return {
            "conversation_id": str(conversation["_id"]),
            "item_id": conversation["item_id"],
            "participants": conversation["participants"],
            "messages": conversation.get("messages", [])
        }
    except:
        raise HTTPException(status_code=400, detail="Invalid conversation ID")



# Get conversationID
@router.get('/conversations/{user_id}/{item_id}')
async def fetch_conversation_id(user_id: str, item_id: str, current_user: dict = Depends(get_current_user)):
    try:
        conversation = await conversations.find_one({
            "participants":{"$all": [current_user["sub"],  user_id]},
            "item_id": item_id})
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID or item ID")

    if not conversation:
        #raise HTTPException(status_code=404, detail="Conversation not found")
        return {"conversation_id": None}    # Returns None if there is no conversation_id for that entry

    return {"conversation_id": str(conversation["_id"])}



# Marks messages as read
@router.put('/conversations/{conversation_id}/read')
async def mark_message_as_read(conversation_id: str, user_id: str):
    try:
        conversation = await conversations.find_one({"_id": ObjectId(conversation_id)})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        updated = False
        for msg in conversation.get("messages", []):
            if msg["sender_id"] != user_id and not msg["read"]: # if the message is not sent by the user and is not already read then set to read
                msg["read"] = True
                updated = True

        if updated:
            await conversations.update_one(
                {"_id": ObjectId(conversation_id)},
                {"$set": {"messages": conversation["messages"]}}
            )

        return {"success": True}
    except:
        raise HTTPException(status_code=400, detail="Invalid request")



@router.patch('/conversations/{conversation_id}/delete')
async def delete_conversation(conversation_id: str, current_user: dict = Depends(get_current_user)):
    try:
        conversation = await conversations.find_one({"_id": ObjectId(conversation_id)})

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        if current_user["sub"] not in conversation["participants"]: 
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        await conversations.update_one(
            {"_id": ObjectId(conversation_id)},
            {"$addToSet": {
                "deleted_by": current_user["sub"]}
            }
        )
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=400, detail="Invalid request")

