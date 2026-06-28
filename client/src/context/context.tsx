import { createContext, useState, useContext, useEffect, useRef } from "react";


type User = {
  _id?: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  join_date: string;
}

type RegisterData = {
  _id?: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  join_date: string;
}


type LoginRequest = {
  email: string;
  password: string;
}


type Item = {
  _id?: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  description: string;
  created_at: string;
  status: string;
  sold_at: string;
  seller_id: string;
  buyer_id: string;
  image: string;
  likes: number;
}



type RequestUsers = {
  _id?: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  join_date: string;
  avatar_url?: string | null;
  address?: string 
  gender?: string 
  bio?: string 
  birthdate?: string
}


type ChatMessage = {
  sender_id: string;
  text: string;
  read: boolean;
  sent_at: string;
}


type MessageSend = {
  sender_id: string;
  receiver_id: string;
  item_id: string;
  text: string;
}

type Conversation = {
  conversation_id: string;
  item_id: string;
  other_user: string;
  unread_count: number;
  last_message: string;
  last_updated: string;
}






type ContextType = {
  user: User | null;
  users: RequestUsers[];
  item: Item | null;
  items: Item[];
  token: string | null;
  loading: boolean;
  likedItems: Item[];
  inbox: Conversation[];

  get_item: (itemId: string) => Promise<Item | null>;
  update_item_sold: (itemId: string, userId: string, status: string, conversationId?: string) => Promise<void>;
  read_messages: (conversationId: string, userId: string) => Promise<void>;
  fetch_conversation_id: (sender_id: string, item_id: string) => Promise<{conversation_id: string} | null>;
  load_messages: (conversation_id: string) => Promise<{conversation_id: string, item_id: string, participants: string[], messages: ChatMessage[]} | null>;
  send_message: (message: MessageSend ) => Promise<{ success: boolean; conversation_id?: string }>;
  load_inbox: (user_id: string) => Promise<void>;
  getUsername: (user_id: string) => string;
  logout: () => void;
  like_item: (userId: string, itemId: string) => Promise<boolean>;
  unlike_item: (userId: string, itemId: string) => Promise<boolean>;    
  load_liked_items: (user_id: string) => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  login: (data: LoginRequest) => Promise<boolean>;
  load_users: () => Promise<void>;
  post_item: (data: Item) => Promise<boolean>;
  load_items: () => Promise<void>;
}


const Context = createContext<ContextType | undefined>(undefined);

//const API_URL = 'http://localhost:8000' // backend url
const API_URL = 'http://192.168.1.19:8000' // backend url

//const WS_URL = 'ws://localhost:8000'
const WS_URL = 'ws://192.168.1.19:8000'
const TOKEN_KEY = 'loopcart_token'



// JWT helpers -------------------------------------------------------------------------------------

function saveToken(token: string){           // Saves the token to local storage
  localStorage.setItem(TOKEN_KEY, token)
} 

function clearToken(){
  localStorage.removeItem(TOKEN_KEY)
}

function getToken(): string | null{
  return localStorage.getItem(TOKEN_KEY)
}

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getToken()
  return{
    'Content-type': 'application/json',
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
    ...extra,
  }
}

















// Providers ------------------------------------------------------------------------------------ 

export function AppContext({children}) {
  const [user, setUser] = useState<User | null>(null);  // Current user
  const [users, setUsers] = useState<RequestUsers[]>([]);       // All users
  const [item, setItem] = useState<Item | null>(null);   
  const [items, setItems] = useState<Item[]>([]);       // All items
  const [token, setToken] = useState<string | null>(getToken())
  const [loading, setLoading] = useState(true)
  const [likedItems, setLikedItems] = useState<Item[]>([])
  const [usersMap, setUsersMap] = useState<Map<string, string>>(new Map())
  const [inbox, setInbox] = useState<Conversation[]>([])

  // On Load -------------------------------------------------------------------------------------
  
  useEffect(() => {
    const loadInitialData = async () => {
      const stored = getToken()
      if(!stored){
        setLoading(false)
        return
      }
      try{

        const res = await fetch(`${API_URL}/users/me`, {
          headers: authHeaders()
        })
        
        if(!res.ok){
          clearToken()
          setToken(null)
          setLoading(false)
        }
        const data = await res.json()

        setUser(data)
        if(data._id){
          await load_liked_items(data._id)
          connectInboxSocket(data._id)
        }

        await load_items()
        await load_users()
        await load_inbox(data._id)

      }catch{
        console.error('Error in loading initial data');
        clearToken()
        setToken(null)
      }finally{
        setLoading(false)
      }  
    }   
    loadInitialData()

  }, [])


  useEffect(() => {
    const map = new Map()
    users.forEach(user => {
    if (user._id && user.username) {
        map.set(user._id, user.username);
    }
    })
    setUsersMap(map)
  }, [users])


  const getUsername = (user_id: string) => {      // Gets the sellerName user the sellerid
    if(!user_id) return 'Unkown Seller'
    return usersMap.get(user_id) || 'Unkown Seller'
  }


  // Auth -------------------------------------------------------------------------------------


  // Sends the data to the backend to register the user
  const register = async (formData: RegisterData): Promise<boolean> => {
    try{
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok){
        saveToken(data.access_token)
        setToken(data.access_token)
        console.log('registered successfully as:' + data.user.username);
        return true;
      }else{
        console.error('registration failed');
        return false;
      }
    }catch{
      console.error('network error in registering');
      return false
    }
  };

  

  // Sends the data to the backend to log the user in
  const login = async(formData: LoginRequest) => {
    try{
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if(res.ok){
        setLikedItems([])
        saveToken(data.access_token)
        setToken(data.access_token)
        const userData = {
          _id: data.user._id || '',  // Make sure _id is included
          username: data.user.username,
          firstname: data.user.firstname,
          lastname: data.user.lastname,
          email: data.user.email,
          password: '', // Don't store password in state
          join_date: data.user.join_date,
          avatar_url: data.user.avatar_url
        }
        setUser(userData)
        load_liked_items(userData?._id)
        console.log('logged in as: ' + data.user.username)
        
        await load_items()
        await load_users()  
        await load_inbox(data.user._id)
        connectInboxSocket(userData._id)
        return true
      }else{
        console.error('invalid email or password')
        return false
      }
    }catch{
      console.error('network error in logging in');
      return false
    }
  }

  const logout = () => {
    wsRef.current?.close()
    wsRef.current = null
    clearToken()
    setUser(null)
    setToken(null)
    setUsers([])
    setItems([])
    setLikedItems([])
    setInbox([])
    
  }


  // Items ------------------------------------------------------------------------------------ 

  // Creates a new item in the database
  const post_item = async(formData: Item): Promise<boolean> => {
    const tempId = `temp_${Date.now()}_${Math.random()}`  // Creates a temp item
    const tempItem = {...formData, _id: tempId}

    setItems(prev => [...items, tempItem])
    try{
      const res = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if(res.ok){
        
        setItems(prev => prev.map(item => item._id === tempId ? data : item)) // Replaces the temp id with the actual id
        console.log('item posted successfully: ' + data.title);
        return true
      }else{
        setItems(prev => prev.filter(item => item._id !== tempId)) // removes the item with the temp id
        if(res.status === 401){
          console.log("not authenticated")
        }else{
          console.error('error in posting item');
        }
        return false
      }
    }catch{
      setItems(prev => prev.filter(item => item._id !== tempId)) 
      console.error('Network error or system error in posting item');
      return false
    }
  }

  

  // Test function, Loads all Items
  const load_items = async () => {
    try{
      const res = await fetch(`${API_URL}/items`);
      const data = await res.json();
      setItems(data)
      console.log('loaded items');
    }catch{
      console.error('error in loading items');
    }
  }


  

  const get_item = async (itemId: string) => {
    try{
      const res = await fetch(`${API_URL}/items/${itemId}`);
      const data = await res.json();
      return data
    }catch{
      console.error('error in getting item');
    }
  }
  
  // Users ------------------------------------------------------------------------------------

  // Test function, Loads all users
  const load_users = async () => {
    try{
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data)
      
      console.log('loaded users');
    }catch{
      console.error('error in loading users');
    }
  }; 




  // Likes ---------------------------------------------------------------------------------------

  
  const load_liked_items = async(user_id: string) => {
    try{
      const res = await fetch(`${API_URL}/likes/${user_id}`);
      const data = await res.json();
      setLikedItems(data) // Optimize (load only the liked items of the logged in user)
      console.log('loaded liked items');
    }catch{
      console.error('error in loading liked items');
    }
  }



  const like_item = async (userId: string, itemId: string) => {
    try{
      const res = await fetch(`${API_URL}/likes`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({user_id: userId, item_id: itemId})
      })

      if(res.ok){
        if(userId){ // only logged in users can like
          await load_liked_items(userId) // Loads the liked items of the logged in user
        }
        await load_items() // Reloads the items that have been liked
        console.log('liked item: ' + itemId);
        return true
      }else{

        console.error('error in liking item');
        return false
      }
    }catch{
      console.error('network error in liking item');
      return false
    }
  } 
  

  const unlike_item = async (userId: string, itemId: string) => {
    try{
      const res = await fetch(`${API_URL}/likes?user_id=${userId}&item_id=${itemId}`, {
        method: 'DELETE'
      }) 
      
      if(res.ok){
        if(userId){
          await load_liked_items(userId)
        }
        await load_items()
        console.log('unliked item: ' + itemId);
        return true
      }else{
        console.error('error in unliking item');
        return false
      }
    }catch{
      console.error('network error in unliking item');
      return false
    }
  }




  // Message ------------------------------------------------------------------------------------

  const load_inbox = async(userId: string) => {
    try{
      const res = await fetch(`${API_URL}/users/${userId}/inbox`) 
      if(res.ok){
        const data = await res.json()
        setInbox(data)
      }else{
        console.error('error in loading inbox: client');
      }
    }catch{
      console.error('network error in loading inbox');
    }
  }

  




  
  const send_message = async(message: MessageSend) => {
    try{
      const res = await fetch(`${API_URL}/messages/send`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          sender_id: message.sender_id, 
          receiver_id: message.receiver_id, 
          item_id: message.item_id, 
          text: message.text})
      })

      const data = await res.json()


      if(res.ok){
        console.log('message sent successfully');
        await load_inbox(message.sender_id) // updates it to inbox
        return {
          success: true,
          conversation_id: data.conversation_id
        };
      }else{
        console.error('error in sending message');
        return {success: false};
      }
    }catch{
      console.error('network error in sending message');
      return {success: false};
    }
  }


  const load_messages = async(conversation_id: string) => {
    try{
      const res = await fetch(`${API_URL}/conversation/${conversation_id}/messages`)
      if(!res.ok) {
        console.error('Error in loading messages')
        return null
      }

      const data = await res.json()
      return data
    }catch{
      console.error('Error in loading messages')
      return null
    }
  }


  const fetch_conversation_id = async (sender_id: string, item_id: string) => {
    try{
      const res = await fetch(`${API_URL}/conversations/${sender_id}/${item_id}`)
      if(res.ok){
        const data = await res.json()
        return data
      }else{
        console.log('No conversation yet');
        return 
      }
    }catch{
      console.error('network error in fetching conversation id');
      return 
    }
  }


  const read_messages = async (conversationId: string, userId: string) => {
    try{
      const res = await fetch(`${API_URL}/conversations/${conversationId}/read?user_id=${userId}`, {
        method: 'PUT',
        headers: authHeaders()
      })
      if(res.ok){
        console.log('messages read successfully');
      }else{
        console.error('error in reading messages');
      }
    }catch{
      console.error(`failed in reading messages`);
    }
  }




  const update_item_sold = async (itemId: string, userId: string, status: string, conversationId?: string) => {
    try{
      const res = await fetch(`${API_URL}/items/${itemId}/${userId}/${status}/sold${conversationId ? `?conversation_id=${conversationId}` : ''}`, {
        method: 'PATCH',
        headers: authHeaders()
      })

      if(res.ok){
        await load_items()
        console.log('successfully updated item to sold');
      }else{
        console.error('error in updating item to sold');
      }
    }catch{
      console.error('network error in updating item to sold');
    }
  }



  
  // Websocket ------------------------------------------------------------------------------------
  const wsRef = useRef<WebSocket | null>(null)
  const wsIntentionalClose = useRef(false)
  const connectInboxSocket = (user_id: string) => {
    wsIntentionalClose.current = false
    const ws = new WebSocket(`${WS_URL}/ws/inbox/${user_id}`)
    
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if(data.type === 'new_message'){
        load_inbox(user_id)
      }
    }
    console.log("connected to inbox socket")
    ws.onclose = () => {
      if(wsIntentionalClose.current) return
      if(wsRef.current !== ws) return
      setTimeout(() => connectInboxSocket(user_id), 3000) // auto-reconnect
    }

    wsRef.current = ws
  }
    
 
  // Context values ----------------------------------------------------------------------------------
  const value = {
    user,
    users,
    item,
    items,
    token,
    loading,
    likedItems,
    inbox,
  
    get_item,
    update_item_sold,
    read_messages,
    fetch_conversation_id,
    load_messages,
    send_message,
    load_inbox,
    getUsername,
    logout,
    like_item,
    unlike_item,
    load_liked_items,
    register,
    login,
    load_users,
    post_item,
    load_items
  }


  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
    
    
}


export function useAppContext(){
  const context = useContext(Context)
  if(context === undefined){
    console.log("useAppContext must be used within a AppProvider");
  }
  return context
}


