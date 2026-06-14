import { createContext, useState, useContext } from "react";


type User = {
  _id?: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

type RegisterData = {
  _id?: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}


type LoginData = {
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
  createdAt: string;
  sold: boolean;
  soldAt: string;
  seller: string;
  buyer: string;
  image: string;
  likes: number;
}

type ContextType = {
  user: User | null;
  users: User[];
  item: Item | null;
  items: Item[];
  register: (data: RegisterData) => Promise<boolean>;
  login: (data: LoginData) => Promise<boolean>;
  load_users: () => Promise<void>;
  post_item: (data: Item) => Promise<boolean>;
  load_items: () => Promise<void>;
}



const Context = createContext<ContextType | undefined>(undefined);

const API_URL = 'http://localhost:8000' // MongoDB Api

export function AppContext({children}) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [item, setItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  



  // Creates a new item in the database
  const post_item = async(formData: Item): Promise<boolean> => {
    const tempId = `temp_${Date.now()}_${Math.random()}`  // Creates a temp item
    const tempItem = {...formData, _id: tempId}

    setItems(prev => [...items, tempItem])
    try{
      const res = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if(res.ok){
        setItems(prev => prev.map(item => item._id === tempId ? data : item)) // Replaces the temp id with the actual id
        console.log('item posted successfully: ' + data.title);
        return true
      }else{
        setItems(prev => prev.filter(item => item._id !== tempId)) // removes the item with the temp id
        console.error('error in posting item');
        return false
      }
    }catch{
      setItems(prev => prev.filter(item => item._id !== tempId)) 
      console.error('Network error or system error in posting item');
      return false
    }
  }

  


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
        console.log('registered successfully as:' + data.username);
        return true;
      }else{
        console.error('registration failed');
        return false;
      }
    }catch{
      console.error('error in registering');
      return false
    }
  };

  

  // Sends the data to the backend to log the user in
  const login = async(formData: LoginData) => {
    try{
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if(res.ok){
        setUser(data.user)
        console.log('logged in as: ' + data.user.username)
        await load_items()                // Loads Items after logging in
        return true
      }else{
        console.error('invalid email or password')
        return false
      }
    }catch{
      console.error('error in logging in');
      return false
    }
  }


  // Test function, Loads all users
  const load_users = async () => {
    try{
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data)
      
    }catch{
      console.error('error in loading users');
    }
  }; 

  // Test function, Loads all Items
  const load_items = async () => {
    try{
      const res = await fetch(`${API_URL}/items`);
      const data = await res.json();
      setItems(data)
      
    }catch{
      console.error('error in loading items');
    }
  }



  const value = {
    user,
    users,
    item,
    items,
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


